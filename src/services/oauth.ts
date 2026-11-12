export type OAuthProvider = "google" | "apple";

export type OAuthResult =
  | { ok: true; email: string }
  | { ok: false; message: string };

const DEMO_ACCOUNT = "demo@gmail.com";

const NOT_IMPLEMENTED: Record<OAuthProvider, string> = {
  google: "Entrar com Google ainda não está disponível.",
  apple: "Entrar com Apple ainda não está disponível.",
};

export async function signIn(provider: OAuthProvider): Promise<OAuthResult> {
  if (provider === "google") {
    return { ok: true, email: DEMO_ACCOUNT };
  }

  return { ok: false, message: NOT_IMPLEMENTED[provider] };
}
