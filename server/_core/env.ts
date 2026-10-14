export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
  // Destinataire des messages du formulaire de contact (l'adresse publique du site par défaut).
  ownerEmail: process.env.OWNER_EMAIL || "badiane.falou95@gmail.com",
  // Resend (https://resend.com) : fournisseur d'e-mail utilisé en production sur Vercel.
  resendApiKey: process.env.RESEND_API_KEY ?? "",
  resendApiUrl: process.env.RESEND_API_URL || "https://api.resend.com",
  // L'expéditeur de test de Resend peut écrire à l'adresse du compte Resend sans domaine vérifié.
  contactFromEmail: process.env.CONTACT_FROM_EMAIL || "Portfolio Falou Badiane <onboarding@resend.dev>",
};
