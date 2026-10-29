import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const alt = "Gastronom, Eastern European delicatessen in Sanremo";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Default social card for every page that does not set its own image
 * (products, collections and articles do). Uses the hero photo with a dark
 * overlay and Latin text so the default font covers every glyph.
 */
export default async function OpenGraphImage() {
  const hero = await readFile(join(process.cwd(), "public", "hero-shop.jpg"));
  const heroSrc = `data:image/jpeg;base64,${hero.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          fontFamily: "serif",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={heroSrc}
          alt=""
          width={1200}
          height={630}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(20,24,38,0.55) 0%, rgba(20,24,38,0.85) 100%)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "72px 80px",
            width: "100%",
            height: "100%",
            color: "#f7f1e6",
          }}
        >
          <div style={{ fontSize: 28, letterSpacing: 8, textTransform: "uppercase", opacity: 0.8 }}>
            Sanremo, Liguria
          </div>
          <div style={{ fontSize: 112, fontWeight: 700, lineHeight: 1.05, marginTop: 12 }}>Gastronom</div>
          <div style={{ fontSize: 40, marginTop: 20, opacity: 0.9 }}>Eastern European Delicatessen</div>
          <div style={{ fontSize: 26, marginTop: 36, opacity: 0.7 }}>www.gastronomsanremo.com</div>
        </div>
      </div>
    ),
    size,
  );
}
