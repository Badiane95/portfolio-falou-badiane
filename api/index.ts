import "dotenv/config";
import express from "express";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "../server/routers.js";
import { createContext } from "../server/_core/context.js";
import { registerOAuthRoutes } from "../server/_core/oauth.js";

const app = express();

// Corps limité à 100 ko : le formulaire de contact n'a pas besoin de plus
// (au-delà, Express répond 413).
app.use(express.json({ limit: "100kb" }));
app.use(express.urlencoded({ limit: "100kb", extended: true }));

// OAuth
registerOAuthRoutes(app);

// tRPC
app.use(
  "/api/trpc",
  createExpressMiddleware({
    router: appRouter,
    createContext,
    // Pas de lots : une requête HTTP = un appel, sinon un seul POST pourrait
    // déclencher des dizaines d'envois (le client utilise httpLink).
    allowBatching: false,
  })
);

export default app;
