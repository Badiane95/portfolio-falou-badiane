export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

// Generate login URL at runtime so redirect URI reflects the current origin.
export const getLoginUrl = () => {
  const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  const appId = import.meta.env.VITE_APP_ID;
  const redirectUri = `${window.location.origin}/api/oauth/callback`;
  const state = btoa(redirectUri);

  const url = new URL(`${oauthPortalUrl}/app-auth`);
  url.searchParams.set("appId", appId);
  url.searchParams.set("redirectUri", redirectUri);
  url.searchParams.set("state", state);
  url.searchParams.set("type", "signIn");

  return url.toString();
};

// Contact information
export const CONTACT_EMAIL = "badiane.falou95@gmail.com";
export const CONTACT_PHONE = "+33 (à ajouter si nécessaire)";
export const SOCIAL_LINKS = {
  github: "https://github.com/Badiane95",
  linkedin: "https://linkedin.com/in/falou-badiane",
  email: `mailto:${CONTACT_EMAIL}`
};
