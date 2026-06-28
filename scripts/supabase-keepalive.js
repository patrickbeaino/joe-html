const https = require("https");

const SUPABASE_URL = process.env.SUPABASE_URL || "https://lzvzdcwpxrtnnitrgzcs.supabase.co";
const SUPABASE_ANON_KEY =
  process.env.SUPABASE_ANON_KEY || "sb_publishable_4oD6rFXBcHl2XTpNpNSrxA_KUyl_ALU";

const endpoint = new URL("/rest/v1/works", SUPABASE_URL);
endpoint.searchParams.set("select", "id");
endpoint.searchParams.set("limit", "1");

const requestOptions = {
  method: "GET",
  headers: {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    Accept: "application/json"
  },
  timeout: 15000
};

const request = https.request(endpoint, requestOptions, (response) => {
  let body = "";

  response.setEncoding("utf8");
  response.on("data", (chunk) => {
    body += chunk;
  });

  response.on("end", () => {
    if (response.statusCode >= 200 && response.statusCode < 300) {
      console.log(`Supabase keepalive succeeded with HTTP ${response.statusCode}.`);
      return;
    }

    console.error(`Supabase keepalive failed with HTTP ${response.statusCode}.`);
    if (body) {
      console.error(body.slice(0, 500));
    }
    process.exit(1);
  });
});

request.on("timeout", () => {
  request.destroy(new Error("Supabase keepalive timed out."));
});

request.on("error", (error) => {
  console.error(error.message || "Supabase keepalive failed.");
  process.exit(1);
});

request.end();
