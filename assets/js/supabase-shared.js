(function () {
  const DEFAULT_BUCKET = "works-images";
  const PLACEHOLDER_MARKERS = ["YOUR_SUPABASE_PROJECT_URL", "YOUR_SUPABASE_PUBLISHABLE_KEY", "YOUR_ADMIN_EMAIL"];
  const config = window.ENTRACTE_SUPABASE_CONFIG || {};
  const bucket = config.bucket || DEFAULT_BUCKET;
  let client = null;

  function includesPlaceholder(value) {
    return PLACEHOLDER_MARKERS.some((marker) => typeof value === "string" && value.includes(marker));
  }

  function getAdminEmails() {
    if (!Array.isArray(config.adminEmails)) return [];
    return config.adminEmails
      .map((email) => String(email || "").trim().toLowerCase())
      .filter(Boolean)
      .filter((email) => !includesPlaceholder(email));
  }

  function isConfigured() {
    return Boolean(
      config.url &&
      config.anonKey &&
      !includesPlaceholder(config.url) &&
      !includesPlaceholder(config.anonKey)
    );
  }

  function getClient() {
    if (!isConfigured()) {
      throw new Error("Supabase is not configured yet.");
    }
    if (!window.supabase || typeof window.supabase.createClient !== "function") {
      throw new Error("Supabase client library failed to load.");
    }
    if (!client) {
      client = window.supabase.createClient(config.url, config.anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true
        }
      });
    }
    return client;
  }

  function toPublicImageUrl(path) {
    if (!path) return "";
    if (/^(https?:)?\/\//i.test(path) || path.startsWith("/")) return path;
    if (!isConfigured()) return path;
    const { data } = getClient().storage.from(bucket).getPublicUrl(path);
    return data && data.publicUrl ? data.publicUrl : path;
  }

  function normalizeWork(row) {
    const imagePath = row.image_path || row.imagePath || "";
    const imageUrl = row.image_url || row.imageUrl || toPublicImageUrl(imagePath);
    return {
      id: row.id,
      title: row.title || "",
      type: row.type || "Promoreel",
      director: row.director || "",
      vimeoUrl: row.vimeo_url || row.vimeoUrl || "",
      imagePath,
      imageUrl,
      imageStyle: row.image_style || row.imageStyle || "",
      imageAlt: row.image_alt || row.imageAlt || row.title || "Work image",
      createdAt: row.created_at || row.createdAt || "",
      updatedAt: row.updated_at || row.updatedAt || ""
    };
  }

  async function listWorks(orderAscending) {
    const supabase = getClient();
    const { data, error } = await supabase
      .from("works")
      .select("id,title,type,director,vimeo_url,image_path,image_url,image_style,image_alt,created_at,updated_at")
      .order("created_at", { ascending: orderAscending });
    if (error) throw error;
    return (data || []).map(normalizeWork);
  }

  async function isAdminEmail(email) {
    const normalized = String(email || "").trim().toLowerCase();
    if (!normalized) return false;

    const configuredAdmins = getAdminEmails();
    if (configuredAdmins.length > 0 && configuredAdmins.includes(normalized)) {
      return true;
    }

    const supabase = getClient();
    const { data, error } = await supabase
      .from("admin_users")
      .select("email")
      .eq("email", normalized)
      .limit(1);

    if (error) {
      throw error;
    }

    return Array.isArray(data) && data.length > 0;
  }

  async function resolveSession() {
    const supabase = getClient();
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    return data.session || null;
  }

  function slugifyFilename(name) {
    const raw = String(name || "image").trim();
    const dotIndex = raw.lastIndexOf(".");
    const base = dotIndex > 0 ? raw.slice(0, dotIndex) : raw;
    const ext = dotIndex > 0 ? raw.slice(dotIndex).toLowerCase() : "";
    const safeBase = base
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "image";
    return `${Date.now()}-${safeBase}${ext}`;
  }

  window.EntracteSupabase = {
    bucket,
    config,
    getAdminEmails,
    getClient,
    isAdminEmail,
    isConfigured,
    listAdminWorks() {
      return listWorks(false);
    },
    listPublicWorks() {
      return listWorks(true);
    },
    normalizeWork,
    resolveSession,
    slugifyFilename,
    toPublicImageUrl
  };
})();
