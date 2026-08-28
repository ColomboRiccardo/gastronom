import { Resend } from "resend";

let client: Resend | null = null;

/**
 * Created on first send rather than at import time, so a missing API key fails
 * the one email instead of crashing every module that imports a template.
 */
export function getResend(): Resend {
  if (!client) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error("RESEND_API_KEY is not set");
    }
    client = new Resend(apiKey);
  }
  return client;
}
