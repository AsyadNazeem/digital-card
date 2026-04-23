/**
 * passImageComposer.js
 *
 * Drop this file next to your walletRoutes.js and import the helpers.
 * Uses only `sharp` (already installed) — no canvas needed.
 *
 * Exports:
 *   buildThumbnail(imageBuffer)  → Buffer  (circular profile photo, 300×300)
 *   buildStrip(contact, photoBuffer, logoBuffer) → Buffer  (styled banner, 1125×432)
 *   buildLogo(logoBuffer, fallbackText) → Buffer  (clean logo, 160×50)
 */

import sharp from "sharp";

/* ─────────────────────────────────────────────────────────
   CONSTANTS  (Apple recommended sizes @3x)
───────────────────────────────────────────────────────── */
const STRIP_W = 1125;   // strip.png @3x  (375pt × 3)
const STRIP_H = 432;    // ~144pt tall  × 3
const THUMB_SIZE = 270; // thumbnail @3x  (90pt × 3)
const LOGO_W = 480;     // logo @3x
const LOGO_H = 150;

/* ─────────────────────────────────────────────────────────
   HELPER: download image from URL → Buffer
───────────────────────────────────────────────────────── */
export async function fetchBuffer(url) {
    if (!url) return null;
    try {
        const res = await fetch(url);
        if (!res.ok) return null;
        return Buffer.from(await res.arrayBuffer());
    } catch {
        return null;
    }
}

/* ─────────────────────────────────────────────────────────
   1. THUMBNAIL  — circular profile photo
      White ring border + soft shadow baked in via
      an SVG circle mask composited over the photo.
───────────────────────────────────────────────────────── */
export async function buildThumbnail(imageBuffer) {
    if (!imageBuffer) return null;

    try {
        const size = THUMB_SIZE;
        const border = 10; // white ring thickness
        const inner = size - border * 2;

        // Circular mask SVG
        const circleMask = Buffer.from(
            `<svg width="${inner}" height="${inner}">
         <circle cx="${inner / 2}" cy="${inner / 2}" r="${inner / 2}" fill="white"/>
       </svg>`
        );

        // Resize + apply circular mask to the photo
        const circularPhoto = await sharp(imageBuffer)
            .resize(inner, inner, { fit: "cover", position: "centre" })
            .composite([{ input: circleMask, blend: "dest-in" }])
            .png()
            .toBuffer();

        // Build final canvas: dark circle bg + white ring + circular photo
        const ringBg = Buffer.from(
            `<svg width="${size}" height="${size}">
         <!-- subtle shadow ring -->
         <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 2}" 
                 fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="4"/>
         <!-- white border ring -->
         <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 4}" 
                 fill="none" stroke="white" stroke-width="${border - 2}"/>
       </svg>`
        );

        const result = await sharp({
            create: {
                width: size,
                height: size,
                channels: 4,
                background: { r: 0, g: 0, b: 0, alpha: 0 },
            },
        })
            .composite([
                { input: ringBg },
                { input: circularPhoto, top: border, left: border },
            ])
            .png()
            .toBuffer();

        return result;
    } catch (err) {
        console.warn("buildThumbnail failed:", err.message);
        return null;
    }
}

/* ─────────────────────────────────────────────────────────
   2. STRIP BANNER  — full-width header image
      Layout:
        [left]  circular photo (large)  |  name + title + company
        [right] subtle gradient overlay
      Background: dark gradient matching pass bg
───────────────────────────────────────────────────────── */
export async function buildStrip(contact, photoBuffer, logoBuffer) {
    try {
        const W = STRIP_W;
        const H = STRIP_H;

        const name = (contact.name || "").replace(/&/g, "&amp;").replace(/</g, "&lt;");
        const designation = (contact.designation || "").replace(/&/g, "&amp;").replace(/</g, "&lt;");
        const companyName = (contact.companyName || "").replace(/&/g, "&amp;").replace(/</g, "&lt;");

        // ── Photo circle ──────────────────────────────────────
        const photoSize = 280;
        const photoTop = (H - photoSize) / 2;
        const photoLeft = 60;

        let photoComposite = [];

        if (photoBuffer) {
            const circleMask = Buffer.from(
                `<svg width="${photoSize}" height="${photoSize}">
           <circle cx="${photoSize/2}" cy="${photoSize/2}" r="${photoSize/2}" fill="white"/>
         </svg>`
            );
            const circularPhoto = await sharp(photoBuffer)
                .resize(photoSize, photoSize, { fit: "cover", position: "centre" })
                .composite([{ input: circleMask, blend: "dest-in" }])
                .png()
                .toBuffer();

            // White ring around photo
            const photoRing = Buffer.from(
                `<svg width="${photoSize + 12}" height="${photoSize + 12}">
           <circle cx="${(photoSize+12)/2}" cy="${(photoSize+12)/2}" r="${(photoSize+12)/2 - 2}"
                   fill="none" stroke="rgba(255,255,255,0.6)" stroke-width="3"/>
         </svg>`
            );

            photoComposite = [
                { input: photoRing, top: Math.round(photoTop - 6), left: Math.round(photoLeft - 6) },
                { input: circularPhoto, top: Math.round(photoTop), left: photoLeft },
            ];
        }

        // ── Company logo (small, top-right) ───────────────────
        let logoComposite = [];
        if (logoBuffer) {
            try {
                const logoResized = await sharp(logoBuffer)
                    .resize(140, 140, { fit: "contain", background: { r: 0, g: 0, b: 0, alpha: 0 } })
                    .png()
                    .toBuffer();
                logoComposite = [{ input: logoResized, top: 30, left: W - 170 }];
            } catch {
                // skip logo if it fails
            }
        }

        // ── Text overlay SVG ──────────────────────────────────
        const textX = photoLeft + photoSize + 50;
        const textMaxW = logoBuffer ? W - textX - 180 : W - textX - 40;
        const centerY = H / 2;

        const textSvg = Buffer.from(
            `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
        <!-- Decorative accent line -->
        <rect x="${textX - 8}" y="${centerY - 60}" width="4" height="120"
              rx="2" fill="rgba(255,255,255,0.5)"/>

        <!-- Name -->
        <text x="${textX + 10}" y="${centerY - 20}"
              font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
              font-size="62" font-weight="700" fill="white"
              textLength="${Math.min(textMaxW, name.length * 34)}"
              lengthAdjust="spacingAndGlyphs">
          ${name.length > 20 ? name.substring(0, 19) + "…" : name}
        </text>

        <!-- Designation -->
        <text x="${textX + 10}" y="${centerY + 50}"
              font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
              font-size="38" font-weight="400" fill="rgba(200,200,200,0.95)">
          ${designation.length > 28 ? designation.substring(0, 27) + "…" : designation}
        </text>

        <!-- Company name -->
        <text x="${textX + 10}" y="${centerY + 102}"
              font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
              font-size="34" font-weight="300" fill="rgba(160,160,160,0.85)">
          ${companyName.length > 32 ? companyName.substring(0, 31) + "…" : companyName}
        </text>

        <!-- Bottom divider -->
        <line x1="${textX + 10}" y1="${H - 40}" x2="${W - 40}" y2="${H - 40}"
              stroke="rgba(255,255,255,0.1)" stroke-width="1"/>
      </svg>`
        );

        // ── Background gradient SVG ───────────────────────────
        const bgSvg = Buffer.from(
            `<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stop-color="#0d0d0d"/>
            <stop offset="50%"  stop-color="#141414"/>
            <stop offset="100%" stop-color="#0a0a0a"/>
          </linearGradient>
          <!-- Subtle vignette on left where photo sits -->
          <radialGradient id="glow" cx="12%" cy="50%" r="40%">
            <stop offset="0%"   stop-color="#1a1a2e" stop-opacity="0.4"/>
            <stop offset="100%" stop-color="transparent" stop-opacity="0"/>
          </radialGradient>
        </defs>
        <rect width="${W}" height="${H}" fill="url(#bg)"/>
        <rect width="${W}" height="${H}" fill="url(#glow)"/>
        <!-- Top shimmer line -->
        <line x1="0" y1="0" x2="${W}" y2="0"
              stroke="rgba(255,255,255,0.08)" stroke-width="2"/>
      </svg>`
        );

        // ── Composite everything ──────────────────────────────
        const result = await sharp(bgSvg)
            .composite([
                ...photoComposite,
                ...logoComposite,
                { input: textSvg },
            ])
            .png()
            .toBuffer();

        return result;
    } catch (err) {
        console.warn("buildStrip failed:", err.message);
        return null;
    }
}

/* ─────────────────────────────────────────────────────────
   3. LOGO  — top-left header logo
      If company logo exists: use it (resized, on transparent bg)
      Fallback: text-based "TapMyName" wordmark SVG
───────────────────────────────────────────────────────── */
export async function buildLogo(logoBuffer, fallbackText = "TapMyName") {
    try {
        if (logoBuffer) {
            return await sharp(logoBuffer)
                .resize(LOGO_W, LOGO_H, {
                    fit: "contain",
                    background: { r: 0, g: 0, b: 0, alpha: 0 },
                })
                .png()
                .toBuffer();
        }

        // Fallback: styled text logo
        const text = (fallbackText || "TapMyName")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .substring(0, 20);

        const svgLogo = Buffer.from(
            `<svg width="${LOGO_W}" height="${LOGO_H}" xmlns="http://www.w3.org/2000/svg">
        <text x="10" y="110"
              font-family="Helvetica Neue, Helvetica, Arial, sans-serif"
              font-size="90" font-weight="700" fill="white"
              letter-spacing="-2">
          ${text}
        </text>
      </svg>`
        );

        return await sharp(svgLogo).png().toBuffer();
    } catch (err) {
        console.warn("buildLogo failed:", err.message);
        return null;
    }
}
