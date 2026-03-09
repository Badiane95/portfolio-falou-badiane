import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the notifyOwner function
vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

describe("contact.send", () => {
  it("should send a contact message successfully", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.contact.send({
      name: "John Doe",
      email: "john@example.com",
      subject: "Collaboration Request",
      message: "I would like to collaborate on a web project with you."
    });

    expect(result).toEqual({
      success: true,
      message: "Votre message a été envoyé avec succès!"
    });
  });

  it("should reject invalid email", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.contact.send({
        name: "John Doe",
        email: "invalid-email",
        subject: "Collaboration Request",
        message: "I would like to collaborate on a web project with you."
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.message).toContain("Email invalide");
    }
  });

  it("should reject short name", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.contact.send({
        name: "J",
        email: "john@example.com",
        subject: "Collaboration Request",
        message: "I would like to collaborate on a web project with you."
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.message).toContain("Le nom doit contenir au moins 2 caractères");
    }
  });

  it("should reject short subject", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.contact.send({
        name: "John Doe",
        email: "john@example.com",
        subject: "Hi",
        message: "I would like to collaborate on a web project with you."
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.message).toContain("Le sujet doit contenir au moins 5 caractères");
    }
  });

  it("should reject short message", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    try {
      await caller.contact.send({
        name: "John Doe",
        email: "john@example.com",
        subject: "Collaboration Request",
        message: "Short"
      });
      expect.fail("Should have thrown an error");
    } catch (error: any) {
      expect(error.message).toContain("Le message doit contenir au moins 10 caractères");
    }
  });
});
