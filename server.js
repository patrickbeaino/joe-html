const http = require("http");
const fs = require("fs");
const fsp = fs.promises;
const path = require("path");

function loadLocalEnv() {
  const envPath = path.join(__dirname, ".env");

  try {
    const raw = fs.readFileSync(envPath, "utf8");
    const lines = raw.split(/\r?\n/);

    for (const line of lines) {
      const trimmed = line.trim();

      if (!trimmed || trimmed.startsWith("#")) continue;

      const separatorIndex = trimmed.indexOf("=");
      if (separatorIndex === -1) continue;

      const key = trimmed.slice(0, separatorIndex).trim();
      let value = trimmed.slice(separatorIndex + 1).trim();

      if (!key || process.env[key] !== undefined) continue;

      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }

      process.env[key] = value;
    }
  } catch (error) {
    if (error.code !== "ENOENT") {
      console.warn("Could not load .env:", error.message);
    }
  }
}

loadLocalEnv();

const PORT = Number(process.env.PORT || 3000);
const ROOT = __dirname;
const WORKS_FILE = path.join(ROOT, "data", "works-extra.json");
const UPLOAD_DIR = path.join(ROOT, "assets-2");
const RESEND_API_KEY = process.env.RESEND_API_KEY || "re_xxxxxxxxx";
const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
const CONTACT_TO_EMAIL = process.env.CONTACT_TO_EMAIL || "patrikbeaino@gmail.com";

const ADMIN_USER = process.env.ADMIN_USER || "admin";
const ADMIN_PASS = process.env.ADMIN_PASS || "change-me";

const MIME_TYPES = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
};

async function ensureStorage() {
  await fsp.mkdir(path.dirname(WORKS_FILE), { recursive: true });
  await fsp.mkdir(UPLOAD_DIR, { recursive: true });
  try {
    await fsp.access(WORKS_FILE, fs.constants.F_OK);
  } catch {
    await fsp.writeFile(WORKS_FILE, "[]\n", "utf8");
  }
}

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  res.end(JSON.stringify(payload));
}

function sendText(res, statusCode, text) {
  res.writeHead(statusCode, { "Content-Type": "text/plain; charset=utf-8" });
  res.end(text);
}

function escapeHtml(value) {
  return String(value || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatFromEmail(value) {
  const raw = String(value || "").trim();
  if (!raw) return "onboarding@resend.dev";
  return raw.includes("<") ? raw : `Entracte <${raw}>`;
}

function unauthorized(res) {
  res.writeHead(401, {
    "WWW-Authenticate": 'Basic realm="Admin Area", charset="UTF-8"',
    "Content-Type": "text/plain; charset=utf-8",
  });
  res.end("Authentication required.");
}

function isAuthorized(req) {
  const header = req.headers.authorization || "";
  if (!header.startsWith("Basic ")) return false;
  let decoded = "";
  try {
    decoded = Buffer.from(header.slice(6), "base64").toString("utf8");
  } catch {
    return false;
  }
  const separator = decoded.indexOf(":");
  if (separator === -1) return false;
  const user = decoded.slice(0, separator);
  const pass = decoded.slice(separator + 1);
  return user === ADMIN_USER && pass === ADMIN_PASS;
}

async function readJsonBody(req) {
  const chunks = [];
  let total = 0;

  for await (const chunk of req) {
    total += chunk.length;
    if (total > 10 * 1024 * 1024) {
      throw new Error("Body too large.");
    }
    chunks.push(chunk);
  }

  const raw = Buffer.concat(chunks).toString("utf8").trim();
  if (!raw) return {};
  return JSON.parse(raw);
}

function sanitizeFilename(name) {
  const base = path.basename(name || "image.jpg");
  const normalized = base
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^\.+/, "");
  return normalized || "image.jpg";
}

function safePublicImagePath(imagePath) {
  if (typeof imagePath !== "string") return "";
  const cleaned = imagePath.trim();
  if (!cleaned.startsWith("/assets-2/")) return "";
  if (cleaned.includes("..")) return "";
  return cleaned;
}

function extractWorkId(pathname) {
  const match = pathname.match(/^\/api\/admin\/works\/([^/]+)$/);
  return match ? match[1] : "";
}

async function readWorks() {
  const content = await fsp.readFile(WORKS_FILE, "utf8");
  const parsed = JSON.parse(content);
  if (!Array.isArray(parsed)) return [];
  return parsed
    .map((work, index) => ({
      ...work,
      sortOrder: Number.isFinite(Number(work && work.sortOrder)) ? Number(work.sortOrder) : index + 1,
    }))
    .sort((a, b) => {
      const sortDelta = (a.sortOrder || 0) - (b.sortOrder || 0);
      if (sortDelta !== 0) return sortDelta;
      return String(a.id || "").localeCompare(String(b.id || ""));
    });
}

async function writeWorks(works) {
  const normalized = Array.isArray(works)
    ? works.map((work, index) => ({ ...work, sortOrder: index + 1 }))
    : [];
  await fsp.writeFile(WORKS_FILE, JSON.stringify(normalized, null, 2) + "\n", "utf8");
}

function contentTypeFor(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || "application/octet-stream";
}

async function serveFile(res, absPath) {
  try {
    const stats = await fsp.stat(absPath);
    if (stats.isDirectory()) {
      sendText(res, 404, "Not found");
      return;
    }
    res.writeHead(200, { "Content-Type": contentTypeFor(absPath) });
    fs.createReadStream(absPath).pipe(res);
  } catch {
    sendText(res, 404, "Not found");
  }
}

async function handleUpload(req, res) {
  let body;
  try {
    body = await readJsonBody(req);
  } catch {
    sendJson(res, 400, { error: "Invalid JSON body." });
    return;
  }

  const filename = sanitizeFilename(body.filename || "image.jpg");
  const ext = path.extname(filename).toLowerCase();
  const allowedExt = new Set([".jpg", ".jpeg", ".png", ".webp"]);
  if (!allowedExt.has(ext)) {
    sendJson(res, 400, { error: "Unsupported image type. Use JPG, PNG, or WEBP." });
    return;
  }

  const fileData = typeof body.fileData === "string" ? body.fileData : "";
  const match = fileData.match(/^data:image\/[a-zA-Z0-9.+-]+;base64,(.+)$/);
  if (!match) {
    sendJson(res, 400, { error: "Invalid file data." });
    return;
  }

  let buffer;
  try {
    buffer = Buffer.from(match[1], "base64");
  } catch {
    sendJson(res, 400, { error: "Could not decode image data." });
    return;
  }

  if (!buffer.length) {
    sendJson(res, 400, { error: "Empty image payload." });
    return;
  }

  if (buffer.length > 8 * 1024 * 1024) {
    sendJson(res, 400, { error: "Image too large. Max size is 8MB." });
    return;
  }

  const storedName = `${Date.now()}-${filename}`;
  const targetPath = path.join(UPLOAD_DIR, storedName);
  await fsp.writeFile(targetPath, buffer);

  sendJson(res, 200, {
    ok: true,
    imagePath: `/assets-2/${storedName}`,
  });
}

async function handleCreateWork(req, res) {
  let body;
  try {
    body = await readJsonBody(req);
  } catch {
    sendJson(res, 400, { error: "Invalid JSON body." });
    return;
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const type = typeof body.type === "string" ? body.type.trim() : "";
  const director = typeof body.director === "string" ? body.director.trim() : "";
  const vimeoUrl = typeof body.vimeoUrl === "string" ? body.vimeoUrl.trim() : "";
  const imageStyle = typeof body.imageStyle === "string" ? body.imageStyle.trim() : "";
  const imagePath = safePublicImagePath(body.imagePath);

  if (!title || !director || !imagePath) {
    sendJson(res, 400, {
      error: "Missing required fields. title, director, and imagePath are required.",
    });
    return;
  }

  const entry = {
    id: `extra-${Date.now()}`,
    title,
    type: type || "Promoreel",
    director,
    vimeoUrl,
    imagePath,
    imageAlt: title,
  };

  if (imageStyle) {
    entry.imageStyle = imageStyle;
  }

  const works = await readWorks();
  entry.sortOrder = works.length + 1;
  works.push(entry);
  await writeWorks(works);

  sendJson(res, 201, { ok: true, work: entry });
}

async function handleUpdateWork(req, res, workId) {
  let body;
  try {
    body = await readJsonBody(req);
  } catch {
    sendJson(res, 400, { error: "Invalid JSON body." });
    return;
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const type = typeof body.type === "string" ? body.type.trim() : "";
  const director = typeof body.director === "string" ? body.director.trim() : "";
  const vimeoUrl = typeof body.vimeoUrl === "string" ? body.vimeoUrl.trim() : "";
  const imageStyle = typeof body.imageStyle === "string" ? body.imageStyle.trim() : "";
  const imagePath = safePublicImagePath(body.imagePath);

  if (!title || !director || !imagePath) {
    sendJson(res, 400, {
      error: "Missing required fields. title, director, and imagePath are required.",
    });
    return;
  }

  const works = await readWorks();
  const index = works.findIndex((work) => work && work.id === workId);
  if (index === -1) {
    sendJson(res, 404, { error: "Work not found." });
    return;
  }

  const current = works[index];
  const updated = {
    ...current,
    title,
    type: type || "Promoreel",
    director,
    vimeoUrl,
    imagePath,
    imageAlt: title,
  };

  if (imageStyle) {
    updated.imageStyle = imageStyle;
  } else {
    delete updated.imageStyle;
  }

  works[index] = updated;
  await writeWorks(works);

  sendJson(res, 200, { ok: true, work: updated });
}

async function handleDeleteWork(res, workId, shouldDeleteImage) {
  const works = await readWorks();
  const index = works.findIndex((work) => work && work.id === workId);
  if (index === -1) {
    sendJson(res, 404, { error: "Work not found." });
    return;
  }

  const [removed] = works.splice(index, 1);
  await writeWorks(works);

  let imageDeleted = false;
  if (shouldDeleteImage && removed && typeof removed.imagePath === "string") {
    const imagePath = safePublicImagePath(removed.imagePath);
    const isStillReferenced = works.some((work) => work && work.imagePath === imagePath);
    const basename = path.basename(imagePath);
    const isManagedUpload = /^\d{10,}-/.test(basename);
    if (imagePath && isManagedUpload && !isStillReferenced) {
      const absImagePath = path.resolve(ROOT, `.${imagePath}`);
      if (absImagePath.startsWith(UPLOAD_DIR)) {
        try {
          await fsp.unlink(absImagePath);
          imageDeleted = true;
        } catch {
          imageDeleted = false;
        }
      }
    }
  }

  sendJson(res, 200, { ok: true, removedId: workId, imageDeleted });
}

async function handleContact(req, res) {
  let body;
  try {
    body = await readJsonBody(req);
  } catch {
    sendJson(res, 400, { error: "Invalid JSON body." });
    return;
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";
  const subject = typeof body.subject === "string" ? body.subject.trim() : "";
  const message = typeof body.message === "string" ? body.message.trim() : "";

  if (!name || !email || !message) {
    sendJson(res, 400, { error: "Name, email, and message are required." });
    return;
  }

  if (!RESEND_API_KEY || RESEND_API_KEY === "re_xxxxxxxxx") {
    sendJson(res, 500, {
      error: "Resend is not configured. Replace re_xxxxxxxxx with your real API key in RESEND_API_KEY."
    });
    return;
  }

  let Resend;
  try {
    ({ Resend } = await import("resend"));
  } catch {
    sendJson(res, 500, {
      error: "Resend package is not installed yet. Run npm install before using contact email."
    });
    return;
  }

  const resend = new Resend(RESEND_API_KEY);
  const safeSubject = subject || "New Project Inquiry";
  const html = `
    <p>You received a new message from the Entracte contact form.</p>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
    <p><strong>Subject:</strong> ${escapeHtml(safeSubject)}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(message).replace(/\n/g, "<br/>")}</p>
  `;

  try {
    const result = await resend.emails.send({
      from: formatFromEmail(RESEND_FROM_EMAIL),
      to: CONTACT_TO_EMAIL,
      reply_to: email,
      subject: `Entracte Contact: ${safeSubject}`,
      html
    });

    if (result && result.error) {
      throw new Error(result.error.message || "Email send failed.");
    }
  } catch (error) {
    sendJson(res, 502, { error: error.message || "Failed to send email." });
    return;
  }

  sendJson(res, 200, { ok: true });
}

async function handleAccessRequest(req, res) {
  let body;
  try {
    body = await readJsonBody(req);
  } catch {
    sendJson(res, 400, { error: "Invalid JSON body." });
    return;
  }

  const title = typeof body.title === "string" ? body.title.trim() : "";
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";

  if (!title || !name || !email) {
    sendJson(res, 400, { error: "Film title, name, and email are required." });
    return;
  }

  if (!RESEND_API_KEY || RESEND_API_KEY === "re_xxxxxxxxx") {
    sendJson(res, 500, {
      error: "Resend is not configured. Replace re_xxxxxxxxx with your real API key in RESEND_API_KEY."
    });
    return;
  }

  let Resend;
  try {
    ({ Resend } = await import("resend"));
  } catch {
    sendJson(res, 500, {
      error: "Resend package is not installed yet. Run npm install before using access request email."
    });
    return;
  }

  const resend = new Resend(RESEND_API_KEY);
  const html = `
    <p>You received a new private screening access request from the Entracte website.</p>
    <p><strong>Film:</strong> ${escapeHtml(title)}</p>
    <p><strong>Name:</strong> ${escapeHtml(name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(email)}</p>
  `;

  try {
    const result = await resend.emails.send({
      from: formatFromEmail(RESEND_FROM_EMAIL),
      to: CONTACT_TO_EMAIL,
      reply_to: email,
      subject: `Entracte Access Request: ${title}`,
      html
    });

    if (result && result.error) {
      throw new Error(result.error.message || "Email send failed.");
    }
  } catch (error) {
    sendJson(res, 502, { error: error.message || "Failed to send email." });
    return;
  }

  sendJson(res, 200, { ok: true });
}

const server = http.createServer(async (req, res) => {
  const urlObj = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = decodeURIComponent(urlObj.pathname);

  try {
    if (req.method === "POST" && pathname === "/api/contact") {
      await handleContact(req, res);
      return;
    }

    if (req.method === "POST" && pathname === "/api/access-request") {
      await handleAccessRequest(req, res);
      return;
    }

    if (req.method === "GET" && pathname === "/api/works-extra") {
      const works = await readWorks();
      sendJson(res, 200, works);
      return;
    }

    if (req.method === "GET" && pathname === "/admin") {
      if (!isAuthorized(req)) {
        unauthorized(res);
        return;
      }
      await serveFile(res, path.join(ROOT, "admin.html"));
      return;
    }

    if (pathname.startsWith("/api/admin/")) {
      if (!isAuthorized(req)) {
        unauthorized(res);
        return;
      }

      if (req.method === "GET" && pathname === "/api/admin/works") {
        const works = await readWorks();
        sendJson(res, 200, works);
        return;
      }

      if (req.method === "POST" && pathname === "/api/admin/upload-image") {
        await handleUpload(req, res);
        return;
      }

      if (req.method === "POST" && pathname === "/api/admin/works") {
        await handleCreateWork(req, res);
        return;
      }

      const workId = extractWorkId(pathname);
      if (workId && req.method === "PUT") {
        await handleUpdateWork(req, res, workId);
        return;
      }

      if (workId && req.method === "DELETE") {
        const shouldDeleteImage = urlObj.searchParams.get("deleteImage") === "1";
        await handleDeleteWork(res, workId, shouldDeleteImage);
        return;
      }

      sendText(res, 404, "Not found");
      return;
    }

    if (req.method === "GET" && pathname === "/") {
      await serveFile(res, path.join(ROOT, "index.html"));
      return;
    }

    if (req.method !== "GET" && req.method !== "HEAD") {
      sendText(res, 405, "Method not allowed");
      return;
    }

    const absPath = path.resolve(ROOT, `.${pathname}`);
    if (!absPath.startsWith(ROOT)) {
      sendText(res, 403, "Forbidden");
      return;
    }
    await serveFile(res, absPath);
  } catch (error) {
    console.error(error);
    sendJson(res, 500, { error: "Internal server error." });
  }
});

ensureStorage()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server listening on http://localhost:${PORT}`);
      console.log("Admin route: /admin");
    });
  })
  .catch((error) => {
    console.error("Failed to initialize storage:", error);
    process.exit(1);
  });
