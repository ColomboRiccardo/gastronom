import { NextResponse } from "next/server";
import { resend } from "@/lib/resend";

export async function GET() {
  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: "riccardocolombopro@gmail.com",
    subject: "Hello World",
    html: "<p>Congrats on sending your <strong>first email</strong>!</p>",
  });

  if (error) {
    console.error("Resend error:", error);
    return NextResponse.json({ ok: false, error }, { status: 500 });
  }

  return NextResponse.json({ ok: true, data });
}