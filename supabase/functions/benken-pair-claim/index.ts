// BenKen web editor: hand the web page its own sign-in after the app has approved its code (V26.226).
// Deploy with "Verify JWT" off. The caller must know the secret whose SHA-256 hash was stored with the code.
import { createClient } from "npm:@supabase/supabase-js@2";

const ORIGINS = ["https://benkenstagepro.com", "https://www.benkenstagepro.com", "https://kenhje.github.io", "http://localhost:8765", "http://localhost:8766"];

function headers(req: Request) {
  const origin = req.headers.get("origin") ?? "";
  return {
    "Access-Control-Allow-Origin": ORIGINS.includes(origin) ? origin : ORIGINS[0],
    "Access-Control-Allow-Headers": "apikey, authorization, content-type, x-client-info",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
    "Vary": "Origin",
  };
}

async function sha256(text: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

Deno.serve(async (req) => {
  const h = headers(req);
  if (req.method === "OPTIONS") return new Response("ok", { headers: h });
  const reply = (status: number, body: unknown) => new Response(JSON.stringify(body), { status, headers: h });
  if (req.method !== "POST") return reply(405, { message: "Use POST." });

  let code = "", secret = "";
  try {
    const body = await req.json();
    code = String(body?.code ?? "").toUpperCase();
    secret = String(body?.secret ?? "");
  } catch { return reply(400, { message: "Invalid request." }); }
  if (!/^[A-Z2-9]{8}$/.test(code) || !/^[0-9a-f]{64}$/.test(secret)) return reply(400, { message: "Invalid code." });

  let key = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
  if (!key) try { key = Object.values(JSON.parse(Deno.env.get("SUPABASE_SECRET_KEYS") ?? "{}"))[0] as string ?? ""; } catch { key = ""; }
  if (!key) return reply(500, { message: "Sign-in with a code is not configured." });
  const admin = createClient(Deno.env.get("SUPABASE_URL")!, key, { auth: { persistSession: false } });
  const { data: row } = await admin.from("benken_pair_codes").select("*").eq("code", code).maybeSingle();
  if (!row || row.secret_hash !== await sha256(secret) || new Date(row.expires_at).getTime() < Date.now()) {
    return reply(410, { message: "The code expired. Show a new code." });
  }
  if (!row.approved_by) return reply(200, { status: "waiting" });
  if (row.claimed_at) return reply(410, { message: "This code was already used. Show a new code." });

  // Claim once, atomically.
  const { data: claimed } = await admin.from("benken_pair_codes").update({ claimed_at: new Date().toISOString() })
    .eq("code", code).is("claimed_at", null).select("code");
  if (!claimed?.length) return reply(410, { message: "This code was already used. Show a new code." });

  const { data: user, error: userError } = await admin.auth.admin.getUserById(row.approved_by);
  const email = user?.user?.email;
  if (userError || !email) return reply(500, { message: "Could not find the BenKen account." });
  const { data: link, error: linkError } = await admin.auth.admin.generateLink({ type: "magiclink", email });
  const tokenHash = link?.properties?.hashed_token;
  if (linkError || !tokenHash) return reply(500, { message: "Could not create the sign-in. Try again." });
  return reply(200, { status: "approved", token_hash: tokenHash });
});
