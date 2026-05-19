<template>
  <div class="features-page" :class="{ 'dark-mode': isDark }">

    <!-- ═══════════════════════════════════════════
         PHONE VIDEO SHOWCASE (HERO SECTION)
    ════════════════════════════════════════════ -->
    <section class="phone-showcase">

      <!-- Ambient background (mirrors hero) -->
      <div class="showcase-canvas">
        <div class="blob blob-1"></div>
        <div class="blob blob-2"></div>
        <div class="blob blob-3"></div>
        <div class="grid-overlay"></div>
      </div>

      <div class="phone-showcase__inner">

        <!-- LEFT: PHONE MOCKUP (with video) -->
        <div class="phone-mockup-wrap">

          <!-- Glow halo behind phone -->
          <div class="phone-halo"></div>

          <div class="phone-mockup" ref="mockupRef">

            <!-- Canvas renders the warped video (z-index 1, behind frame) -->
            <canvas ref="canvasRef" class="phone-canvas"/>

            <!-- Hidden video source -->
            <video
                ref="videoRef"
                class="phone-video-hidden"
                autoplay
                muted
                loop
                playsinline
                crossorigin="anonymous"
                @loadeddata="startCanvas"
            >
              <source
                  :src="isDark
    ? '/videos/DigitalCardSRDark.mp4'
    : '/videos/DigitalCardSR.MP4'"
                  type="video/mp4"
              />
            </video>

            <!-- Phone frame sits ON TOP (z-index 3) -->
            <img
                src="/images/Iphone-mockup.png"
                alt="iPhone Mockup"
                class="phone-frame"
                ref="frameRef"
                @load="onFrameLoad"
            />
          </div>

          <!-- Feature badges -->
          <div class="feature-badge badge-views">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            <span>12 new views</span>
          </div>

          <div class="feature-badge badge-engagement">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
            <span>31% engagement</span>
          </div>

        </div>

        <!-- RIGHT: COPY SECTION -->
        <div class="phone-copy">

          <div class="section-meta">
            <span class="meta-label">Features</span>
            <span class="meta-divider">·</span>
            <span class="meta-subtitle">What You Get</span>
          </div>

          <h1 class="showcase-headline">
            Comprehensive tools for
            <span class="highlight">modern teams.</span>
          </h1>

          <p class="showcase-subheading">
            Every team member gets a premium digital business card with built-in analytics, wallet integration, and team
            management — all designed for enterprise adoption.
          </p>

          <!-- Feature highlights row -->
          <div class="highlights-row">
            <div class="highlight-item">
              <span class="highlight-icon">✓</span>
              <span class="highlight-text">Works with Apple & Google Wallet</span>
            </div>
            <div class="highlight-item">
              <span class="highlight-icon">✓</span>
              <span class="highlight-text">Real-time analytics & insights</span>
            </div>
            <div class="highlight-item">
              <span class="highlight-icon">✓</span>
              <span class="highlight-text">Centralized team management</span>
            </div>
          </div>



          <!-- CTA Group -->
          <div class="cta-group">
            <a href="#" class="btn btn-primary">
              <span>Explore Features</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
            <a href="#" class="btn btn-secondary">
              Watch Demo
            </a>
          </div>

        </div>

      </div>
    </section>

    <!-- ═══════════════════════════════════════════
         FEATURES GRID
    ════════════════════════════════════════════ -->
    <section class="features-grid-section">
      <div class="section-header">
        <h2 class="features-grid-title">
          Everything built for scale
        </h2>
      </div>

      <div class="features-grid">
        <div
            v-for="(f, i) in features"
            :key="f.title"
            class="feature-card"
            :style="{ '--i': i }"
        >
          <div class="card-icon">{{ f.icon }}</div>
          <h3>{{ f.title }}</h3>
          <p>{{ f.desc }}</p>
        </div>
      </div>
    </section>

    <!-- ═══════════════════════════════════════════
     WALLET SHOWCASE
════════════════════════════════════════════ -->
    <section class="wallet-showcase">
      <div class="wallet-showcase__inner">

        <div class="wallet-header">
          <div class="section-meta">
            <span class="meta-label">Wallet Integration</span>
            <span class="meta-divider">·</span>
            <span class="meta-subtitle">Always One Swipe Away</span>
          </div>
          <h2 class="wallet-title">
            Lives in Apple &amp; Google Wallet.<br>
            <span class="highlight">Natively.</span>
          </h2>
          <p class="wallet-subtitle">
            Your digital card installs directly into the native wallet app on any device —
            no app downloads, no friction, just tap and share.
          </p>
        </div>

        <div class="wallet-phones">

          <!-- Apple Wallet -->
          <div class="wallet-phone wallet-phone--apple">
            <div class="wallet-phone__label">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <span>Apple Wallet</span>
            </div>
            <img :src=" isDark ? '/images/AppleWalletCard.png' : '/images/AppleWalletCardLight.png'" alt="Apple Wallet Card" class="wallet-phone__img apple" />
          </div>

          <!-- Divider pill -->
          <div class="wallet-divider">
            <span>+</span>
          </div>

          <!-- Google Wallet -->
          <div class="wallet-phone wallet-phone--google">
            <div class="wallet-phone__label">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M21.35 11.1H12.18V13.83H18.69C18.36 17.64 15.19 19.27 12.19 19.27C8.36 19.27 5 16.25 5 12C5 7.9 8.2 4.73 12.2 4.73C15.29 4.73 17.1 6.7 17.1 6.7L19 4.72C19 4.72 16.56 2 12.1 2C6.42 2 2.03 6.8 2.03 12C2.03 17.05 6.16 22 12.25 22C17.6 22 21.5 18.33 21.5 12.91C21.5 11.76 21.35 11.1 21.35 11.1Z"/>
              </svg>
              <span>Google Wallet</span>
            </div>
            <img
                :src=" isDark ? '/images/GooglWalletCard.png' : '/images/googleWalletLight.png'"
                :alt=" isDark ? 'Google Wallet Card Dark' : 'Google Wallet Card Light'" class="wallet-phone__img google"
            />

<!--            <img-->
<!--                :src="isDark ? '/images/analyticNewDark.png' : '/images/analyticNewLight.png'"-->
<!--                :alt="isDark ? 'Analytics Dashboard Dark' : 'Analytics Dashboard Light'"-->
<!--                class="analytics-laptop"-->
<!--            />-->
          </div>

        </div>

      </div>
    </section>

    <!-- ═══════════════════════════════════════════
     ANALYTICS SHOWCASE
════════════════════════════════════════════ -->
    <section class="analytics-showcase">
      <div class="analytics-showcase__inner">

        <!-- LEFT: COPY -->
        <div class="analytics-copy">
          <div class="section-meta">
            <span class="meta-label">Analytics</span>
            <span class="meta-divider">·</span>
            <span class="meta-subtitle">Real-Time Insights</span>
          </div>

          <h2 class="analytics-title">
            Know exactly who's<br>
            <span class="highlight">engaging with you.</span>
          </h2>

          <p class="analytics-subtitle">
            Every view, click, and interaction is tracked in real time.
            See who opened your card, when they did it, and what they tapped —
            so you can follow up at exactly the right moment.
          </p>

          <div class="analytics-stats">
            <div class="stat-item">
              <span class="stat-number">502</span>
              <span class="stat-label">Total Views</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-number">66.3%</span>
              <span class="stat-label">Engagement Rate</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-number">333</span>
              <span class="stat-label">Total Clicks</span>
            </div>
          </div>

          <ul class="analytics-features">
            <li>
              <span class="af-dot"></span>
              Views over time with daily breakdown
            </li>
            <li>
              <span class="af-dot"></span>
              Click distribution across your links
            </li>
            <li>
              <span class="af-dot"></span>
              Peak activity hours heatmap
            </li>
            <li>
              <span class="af-dot"></span>
              Unique visitor tracking per card
            </li>
          </ul>
        </div>

        <!-- RIGHT: LAPTOP MOCKUP (theme-aware) -->
        <div class="analytics-visual">
          <div class="analytics-glow"></div>
          <img
              :src="isDark ? '/images/analyticNewDark.png' : '/images/analyticNewLight.png'"
              :alt="isDark ? 'Analytics Dashboard Dark' : 'Analytics Dashboard Light'"
              class="analytics-laptop"
          />
        </div>

      </div>
    </section>

    <!-- ═══════════════════════════════════════════
     TEAM MANAGEMENT SHOWCASE
════════════════════════════════════════════ -->
    <section class="team-showcase">
      <div class="team-showcase__inner">

        <!-- LEFT: COPY -->
        <div class="team-copy">
          <div class="section-meta">
            <span class="meta-label">Team Management</span>
            <span class="meta-divider">·</span>
            <span class="meta-subtitle">One Dashboard</span>
          </div>

          <h2 class="team-title">
            Create, assign, and manage<br>
            <span class="highlight">your entire team.</span>
          </h2>

          <p class="team-subtitle">
            Create companies, add employees, assign cards, and manage everyone
            from a single dashboard — across desktop and mobile.
          </p>

          <div class="team-feature-list">
            <div class="team-feature-item">
              <div class="team-feature-icon">🏢</div>
              <div class="team-feature-text">
                <strong>Company Profiles</strong>
                <span>Create and organise multiple companies with full branding control.</span>
              </div>
            </div>
            <div class="team-feature-item">
              <div class="team-feature-icon">👥</div>
              <div class="team-feature-text">
                <strong>Employee Cards</strong>
                <span>Add team members and assign personalised digital cards instantly.</span>
              </div>
            </div>
            <div class="team-feature-item">
              <div class="team-feature-icon">📇</div>
              <div class="team-feature-text">
                <strong>Contact Management</strong>
                <span>Collect, view, and export leads captured through every card.</span>
              </div>
            </div>
            <div class="team-feature-item">
              <div class="team-feature-icon">📱</div>
              <div class="team-feature-text">
                <strong>Works on Any Device</strong>
                <span>Full-featured dashboard on desktop and a native mobile experience.</span>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT: CYCLING MOCKUPS -->
        <div class="team-visual">
          <div class="team-glow"></div>

          <!-- Slide indicators -->
          <div class="team-indicators">
            <button
                class="team-indicator"
                :class="{ active: teamSlide === 0 }"
                @click="teamSlide = 0; resetTeamTimer()"
                aria-label="Companies view"
            ></button>
            <button
                class="team-indicator"
                :class="{ active: teamSlide === 1 }"
                @click="teamSlide = 1; resetTeamTimer()"
                aria-label="Contacts view"
            ></button>
          </div>

          <div class="team-slides">
            <img
                src="/images/companyLight.png"
                alt="Company Management Dashboard"
                class="team-slide"
                :class="{ active: teamSlide === 0 }"
            />
            <img
                src="/images/contactLight.png"
                alt="Contact Management Dashboard"
                class="team-slide"
                :class="{ active: teamSlide === 1 }"
            />
          </div>

        </div>

      </div>
    </section>

    <!-- ═══════════════════════════════════════════
     QR CODE SHOWCASE
════════════════════════════════════════════ -->
    <section class="qr-showcase">
      <div class="qr-showcase__inner">

        <!-- LEFT: COPY -->
        <div class="qr-copy">
          <div class="section-meta">
            <span class="meta-label">QR Code Generation</span>
            <span class="meta-divider">·</span>
            <span class="meta-subtitle">Share Instantly</span>
          </div>

          <h2 class="qr-title">
            Every card comes with<br>
            <span class="highlight">its own QR code.</span>
          </h2>

          <p class="qr-subtitle">
            Every card comes with a unique QR code. Print it, share it,
            embed it — works anywhere, no app required on the other end.
          </p>

          <div class="qr-feature-list">
            <div class="qr-feature-item">
              <div class="qr-feature-icon">🖨️</div>
              <div class="qr-feature-text">
                <strong>Print Ready</strong>
                <span>Download your QR in high resolution and put it on business cards, flyers, or signage.</span>
              </div>
            </div>
            <div class="qr-feature-item">
              <div class="qr-feature-icon">🔗</div>
              <div class="qr-feature-text">
                <strong>Embed Anywhere</strong>
                <span>Drop your QR into email signatures, presentations, or your website.</span>
              </div>
            </div>
            <div class="qr-feature-item">
              <div class="qr-feature-icon">📲</div>
              <div class="qr-feature-text">
                <strong>Instant Scan</strong>
                <span>Anyone with a camera app can scan and open your full digital card in seconds.</span>
              </div>
            </div>
            <div class="qr-feature-item">
              <div class="qr-feature-icon">♾️</div>
              <div class="qr-feature-text">
                <strong>Always Up to Date</strong>
                <span>The QR never changes — update your card details and it reflects instantly.</span>
              </div>
            </div>
          </div>
        </div>

        <!-- RIGHT: THEME-AWARE IMAGE -->
        <div class="qr-visual">
          <div class="qr-glow"></div>
          <img
              :src="isDark ? '/images/qrDark.png' : '/images/qrlight.png'"
              :alt="isDark ? 'QR Code Dark' : 'QR Code Light'"
              class="qr-image"
          />
        </div>

      </div>
    </section>

    <!-- ═══════════════════════════════════════════
         CTA STRIP
    ════════════════════════════════════════════ -->
    <section class="cta-strip">
      <div class="cta-inner">
        <div class="cta-copy">
          <h2>Ready to get started?</h2>
          <p>Create your digital card and start sharing instantly.</p>
        </div>
        <router-link to="/register" class="cta-btn">
          <span>Create your card</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </router-link>
      </div>
    </section>

  </div>
</template>

<script setup>
import {inject, onMounted, onUnmounted, ref, watch} from 'vue'

const { isDark, toggleDarkMode } = inject('theme')

/* ─── refs ─── */
const mockupRef = ref(null)
const canvasRef = ref(null)
const videoRef = ref(null)

let animFrame = null
let frameReady = false
let videoReady = false

/* ─── Team slideshow ─── */
const teamSlide = ref(0)
let teamTimer = null

function resetTeamTimer() {
  if (teamTimer) clearInterval(teamTimer)
  teamTimer = setInterval(() => {
    teamSlide.value = (teamSlide.value + 1) % 2
  }, 4000)
}

/* ─── Screen corners as fractions of the PNG (1024 × 1536) ───
   DO NOT CHANGE - Measured by scanning the actual pixel boundaries of the screen.
   TL = top-left, TR = top-right, BR = bottom-right, BL = bottom-left
   These are PERCENTAGES of the mockup image dimensions.                          */
const SCREEN = {
  TL: {x: 0.1578, y: 0.1900},
  TR: {x: 0.5029, y: 0.1570},
  BR: {x: 0.8586, y: 0.6896},
  BL: {x: 0.5390, y: 0.7454},
}

/* ─── Solve 2D homography (unit square → quad) ─────────────── */
function computeHomography(dst) {
  /* dst = [TL, TR, BR, BL] each {x, y} in canvas pixels */
  const [d0, d1, d2, d3] = dst

  /* Build the 8×8 linear system (Hartley & Zisserman) */
  const A = [
    [-0, -0, -1, 0, 0, 0, d0.x * 0, d0.x * 0, d0.x],
    [0, 0, 0, -0, -0, -1, d0.y * 0, d0.y * 0, d0.y],
    [-1, -0, -1, 0, 0, 0, d1.x * 1, d1.x * 0, d1.x],
    [0, 0, 0, -1, -0, -1, d1.y * 1, d1.y * 0, d1.y],
    [-1, -1, -1, 0, 0, 0, d2.x * 1, d2.x * 1, d2.x],
    [0, 0, 0, -1, -1, -1, d2.y * 1, d2.y * 1, d2.y],
    [-0, -1, -1, 0, 0, 0, d3.x * 0, d3.x * 1, d3.x],
    [0, 0, 0, -0, -1, -1, d3.y * 0, d3.y * 1, d3.y],
  ]

  /* Gaussian elimination to solve Ah = 0 */
  const M = A.map(r => [...r])
  for (let col = 0; col < 8; col++) {
    let maxRow = col
    for (let r = col + 1; r < 8; r++)
      if (Math.abs(M[r][col]) > Math.abs(M[maxRow][col])) maxRow = r;
    [M[col], M[maxRow]] = [M[maxRow], M[col]]
    for (let r = col + 1; r < 8; r++) {
      const f = M[r][col] / M[col][col]
      for (let c = col; c < 9; c++) M[r][c] -= f * M[col][c]
    }
  }
  const h = new Array(9).fill(0)
  h[8] = 1
  for (let r = 7; r >= 0; r--) {
    let s = M[r][8]
    for (let c = r + 1; c < 8; c++) s -= M[r][c] * h[c]
    h[r] = s / M[r][r]
  }
  /* return as 3×3 row-major */
  return [h[0], h[1], h[2], h[3], h[4], h[5], h[6], h[7], 1]
}

/* ─── Draw video frame warped into perspective quad ────────── */
function drawFrame() {
  const canvas = canvasRef.value
  const video = videoRef.value
  if (!canvas || !video || video.readyState < 2) {
    animFrame = requestAnimationFrame(drawFrame)
    return
  }

  const cw = canvas.width
  const ch = canvas.height

  /* Map SCREEN fractions → canvas pixel coords */
  const dst = [
    {x: SCREEN.TL.x * cw, y: SCREEN.TL.y * ch},
    {x: SCREEN.TR.x * cw, y: SCREEN.TR.y * ch},
    {x: SCREEN.BR.x * cw, y: SCREEN.BR.y * ch},
    {x: SCREEN.BL.x * cw, y: SCREEN.BL.y * ch},
  ]

  /* Video natural dimensions */
  const vw = video.videoWidth || 390
  const vh = video.videoHeight || 844

  const ctx = canvas.getContext('2d')
  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'
  ctx.clearRect(0, 0, cw, ch)

  /*
    CSS canvas2d doesn't support perspective transforms natively.
    We tile the quad into triangles and use setTransform to warp
    the video into each triangle (affine per-triangle approximation).
    For a phone-sized quad this looks perfect.

    We subdivide into a grid for smooth perspective correction.
  */
  const SEGS = 8  // subdivision grid — higher = more accurate perspective

  for (let row = 0; row < SEGS; row++) {
    for (let col = 0; col < SEGS; col++) {
      /* Bilinear interpolation of the 4 corners */
      const u0 = col / SEGS
      const u1 = (col + 1) / SEGS
      const v0 = row / SEGS
      const v1 = (row + 1) / SEGS

      const interp = (u, v) => ({
        x: (1 - u) * (1 - v) * dst[0].x + u * (1 - v) * dst[1].x + u * v * dst[2].x + (1 - u) * v * dst[3].x,
        y: (1 - u) * (1 - v) * dst[0].y + u * (1 - v) * dst[1].y + u * v * dst[2].y + (1 - u) * v * dst[3].y,
      })

      const p00 = interp(u0, v0)
      const p10 = interp(u1, v0)
      const p11 = interp(u1, v1)
      const p01 = interp(u0, v1)

      /* Source UV in video pixels */
      const sx0 = u0 * vw, sx1 = u1 * vw
      const sy0 = v0 * vh, sy1 = v1 * vh

      /* Draw two triangles per cell using affine transform */
      drawTriangle(ctx, video,
          p00, p10, p01,
          sx0, sy0, sx1, sy0, sx0, sy1
      )
      drawTriangle(ctx, video,
          p10, p11, p01,
          sx1, sy0, sx1, sy1, sx0, sy1
      )
    }
  }

  animFrame = requestAnimationFrame(drawFrame)
}

function drawTriangle(ctx, img, d0, d1, d2, s0x, s0y, s1x, s1y, s2x, s2y) {
  ctx.save()

  /* Clip to the triangle */
  ctx.beginPath()
  ctx.moveTo(d0.x, d0.y)
  ctx.lineTo(d1.x, d1.y)
  ctx.lineTo(d2.x, d2.y)
  ctx.closePath()
  ctx.clip()

  /* Slightly expand edges to hide seams */
  ctx.translate(-0.5, -0.5)

  /*
    Solve the affine matrix that maps:
      (s0x,s0y) → (d0.x,d0.y)
      (s1x,s1y) → (d1.x,d1.y)
      (s2x,s2y) → (d2.x,d2.y)
    [a c e] [sx]   [dx]
    [b d f] [sy] = [dy]
    [0 0 1] [ 1]   [ 1]
  */
  const denom = (s1x - s0x) * (s2y - s0y) - (s2x - s0x) * (s1y - s0y)
  if (Math.abs(denom) < 1e-6) {
    ctx.restore();
    return
  }

  const a = ((d1.x - d0.x) * (s2y - s0y) - (d2.x - d0.x) * (s1y - s0y)) / denom
  const b = ((d1.y - d0.y) * (s2y - s0y) - (d2.y - d0.y) * (s1y - s0y)) / denom
  const c = ((d2.x - d0.x) * (s1x - s0x) - (d1.x - d0.x) * (s2x - s0x)) / denom
  const d = ((d2.y - d0.y) * (s1x - s0x) - (d1.y - d0.y) * (s2x - s0x)) / denom
  const e = d0.x - a * s0x - c * s0y
  const f = d0.y - b * s0x - d * s0y

  ctx.setTransform(a, b, c, d, e, f)
  ctx.drawImage(
      img,
      -1,
      -1,
      img.videoWidth + 2,
      img.videoHeight + 2
  )

  ctx.restore()
}

/* ─── Resize canvas to match the rendered mockup image ─────── */
function resizeCanvas() {
  const img = mockupRef.value?.querySelector('.phone-frame')
  const canvas = canvasRef.value
  if (!img || !canvas) return
  canvas.width = img.offsetWidth || 1024
  canvas.height = img.offsetHeight || 1536
  /* Canvas CSS size matches the img element's rendered size */
  canvas.style.width = img.offsetWidth + 'px'
  canvas.style.height = img.offsetHeight + 'px'
}

function onFrameLoad() {
  frameReady = true
  resizeCanvas()
  tryStart()
}

function startCanvas() {
  videoReady = true
  tryStart()
}

function tryStart() {
  if (frameReady && videoReady) {
    resizeCanvas()
    if (animFrame) cancelAnimationFrame(animFrame)
    drawFrame()
  }
}

onMounted(() => {
  window.addEventListener('resize', resizeCanvas)
  setTimeout(tryStart, 500)
  resetTeamTimer()          // ← start slideshow
})

onUnmounted(() => {
  window.removeEventListener('resize', resizeCanvas)
  if (animFrame) cancelAnimationFrame(animFrame)
  if (teamTimer) clearInterval(teamTimer)   // ← cleanup
})
watch(isDark, async () => {

  const video = videoRef.value

  if (!video) return

  video.pause()

  video.currentTime = 0

  video.load()

  try {
    await video.play()
  } catch (e) {
    console.log(e)
  }

  videoReady = false

  setTimeout(() => {
    videoReady = true
    resizeCanvas()
    tryStart()
  }, 300)
})

/* ─── Features data ─── */
const features = [
  {
    icon: '📱',
    title: 'Apple & Google Wallet',
    desc: 'Add your digital business card directly to mobile wallets so it\'s always one swipe away.'
  },
  {
    icon: '📊',
    title: 'Real-time Analytics',
    desc: 'See exactly who viewed your card, when, and from where. Turn profile views into actionable leads.'
  },
  {
    icon: '🏢',
    title: 'Team Management',
    desc: 'Create companies, add employees, assign cards, and manage everyone from a single dashboard.'
  },
  {
    icon: '🔒',
    title: 'Secure Cloud Storage',
    desc: 'Your data is encrypted and always synced — update your profile once and it reflects everywhere instantly.'
  },
  {
    icon: '🎨',
    title: 'Custom Branding',
    desc: 'Make every card unmistakably yours with full logo, colour, and theme customisation.'
  },
  {
    icon: '🔗',
    title: 'QR Code Generation',
    desc: 'Every card comes with a unique QR code. Print it, share it, embed it — works anywhere.'
  },
  {
    icon: '📇',
    title: 'Contact Management',
    desc: 'Collect and organise leads captured through your card in a clean, exportable contact list.'
  },
  {
    icon: '🌐',
    title: 'Public Profile Page',
    desc: 'Each card gets a shareable link — a beautiful micro-site that works on any browser.'
  },
]
</script>


<style scoped>
/* ═══════════════════════════════════════════════════════
   DESIGN TOKENS — Professional, minimalist aesthetic
═══════════════════════════════════════════════════════ */
.features-page {
  --c-bg: #faf9f7;
  --c-surface: #ffffff;
  --c-border: #e8e3dc;
  --c-text-primary: #1c1410;
  --c-text-secondary: #5a4f46;
  --c-text-muted: #9e8e84;
  --c-accent: #7c5c4e;
  --c-accent-2: #a07060;
  --c-accent-hover: #5e443a;
  --c-accent-light: #f0e8e4;
  --c-accent-subtle: #f8f3f0;
  --c-success: #2d6a50;

  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', sans-serif;
  background: var(--c-bg);
  color: var(--c-text-primary);
  padding-top: 10px;
  min-height: 100vh;
  position: relative;
}

.features-page.dark-mode {
  --c-bg: #100e14;
  --c-surface: #1a1720;
  --c-border: #2c2838;
  --c-text-primary: #f2ede8;
  --c-text-secondary: #a89490;
  --c-text-muted: #6a5e5a;
  --c-accent: #c4906e;
  --c-accent-2: #d4a880;
  --c-accent-hover: #d4a070;
  --c-accent-light: #281e18;
  --c-accent-subtle: #1e1612;
}

*, *::before, *::after {
  box-sizing: border-box;
}

/* ═══════════════════════════════════════════════════════
   PHONE SHOWCASE SECTION
═══════════════════════════════════════════════════════ */
.phone-showcase {
  position: relative;
  padding: 100px 38px 20px;
  overflow: hidden;
}

/* Ambient blobs */
.showcase-canvas {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.55;
}

.blob-1 {
  width: 520px;
  height: 520px;
  background: radial-gradient(circle, rgba(160, 112, 96, 0.22), transparent);
  top: -120px;
  right: -140px;
}

.blob-2 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(124, 92, 78, 0.18), transparent);
  bottom: 0;
  left: -80px;
}

.blob-3 {
  width: 260px;
  height: 260px;
  background: radial-gradient(circle, rgba(200, 148, 114, 0.14), transparent);
  top: 40%;
  right: 42%;
}

.dark-mode .blob {
  opacity: 0.65;
}

.grid-overlay {
  position: absolute;
  inset: 0;
  background-image: linear-gradient(
      rgba(124, 92, 78, 0.035) 1px,
      transparent 1px
  ),
  linear-gradient(
      90deg,
      rgba(124, 92, 78, 0.035) 1px,
      transparent 1px
  );
  background-size: 48px 48px;
  z-index: 1;
  opacity: 0.45;
  pointer-events: none;
  mask-image: radial-gradient(
      circle at 72% 48%,
      transparent 0%,
      transparent 18%,
      rgba(0, 0, 0, 0.15) 28%,
      rgba(0, 0, 0, 0.7) 42%,
      black 60%
  );
}

.features-page.dark-mode .grid-overlay {
  opacity: 0.22;
}

.phone-showcase__inner {
  position: relative;
  z-index: 10;
  max-width: 1480px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 120px;
}

/* Ensure phone mockup is on left, copy on right */
.phone-mockup-wrap {
  order: -1;
}

.phone-copy {
  order: 0;
}

/* ═══════════════════════════════════════════════════════
   COPY SECTION — PROFESSIONAL & CLEAN
═══════════════════════════════════════════════════════ */
.phone-copy {
  max-width: 630px;
  margin-top: -120px;
}

.section-meta {
  display: flex;
  align-items: center;
  gap: 40px;
  margin-bottom: 24px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  color: var(--c-text-muted);
}

.meta-label {
  color: var(--c-accent);
  font-weight: 700;
}

.meta-divider {
  color: var(--c-border);
}

.meta-subtitle {
  color: var(--c-text-secondary);
}

.showcase-headline {
  margin: 0 0 24px;
  font-size: clamp(2.2rem, 4vw, 3.6rem);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -1.2px;
  color: var(--c-text-primary);
}

.highlight {
  color: var(--c-accent);
  position: relative;
}

.showcase-subheading {
  font-size: 1.05rem;
  line-height: 1.8;
  color: var(--c-text-secondary);
  max-width: 520px;
  margin: 0 0 32px;
  font-weight: 400;
}

/* Feature highlights */
.highlights-row {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 40px;
}

.highlight-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  font-size: 0.95rem;
  color: var(--c-text-secondary);
  line-height: 1.5;
}

.highlight-icon {
  color: var(--c-success);
  font-weight: 700;
  font-size: 1.1rem;
  flex-shrink: 0;
  margin-top: 2px;
}

.highlight-text {
  font-weight: 500;
}

/* CTA Group */
.cta-group {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.25s ease;
  text-decoration: none;
  white-space: nowrap;
  letter-spacing: 0.3px;
}

.btn-primary {
  background: linear-gradient(135deg, var(--c-accent-hover) 0%, var(--c-accent) 100%);
  color: white;
  box-shadow: 0 10px 28px rgba(124, 92, 78, 0.22);
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 16px 40px rgba(124, 92, 78, 0.32);
}

.btn-secondary {
  background: transparent;
  color: var(--c-accent);
  border: 2px solid var(--c-accent);
  font-weight: 700;
}

.btn-secondary:hover {
  background: var(--c-accent-subtle);
  border-color: var(--c-accent-hover);
}

.btn svg {
  transition: transform 0.2s ease;
}

.btn-primary:hover svg {
  transform: translateX(3px);
}

/* ═══════════════════════════════════════════════════════
   PHONE MOCKUP SECTION
═══════════════════════════════════════════════════════ */
.phone-mockup-wrap {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px 100px;
  z-index: 20;
}

.phone-halo {
  position: absolute;
  width: 400px;
  height: 400px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(200, 148, 114, 0.22), transparent 70%);
  filter: blur(48px);
  pointer-events: none;
}

.phone-mockup {
  position: relative;
  width: 530px;
  z-index: 25;
  isolation: isolate;
  transform-style: preserve-3d;
  will-change: transform;
  animation: floatPhone 7s ease-in-out infinite;
}

@keyframes floatPhone {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-14px);
  }
}

.phone-video-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.phone-canvas {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 26;
  pointer-events: none;
}

.phone-canvas,
.phone-frame {
  transform: translateZ(0);
}

.phone-frame {
  position: relative;
  width: 100%;
  display: block;
  z-index: 30;
  pointer-events: none;
  user-select: none;
  filter: drop-shadow(0 40px 80px rgba(0, 0, 0, 0.28));
}

/* Feature badges on phone */
.feature-badge {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  background: var(--c-surface);
  border: 1.5px solid var(--c-border);
  border-radius: 100px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  font-size: 12px;
  font-weight: 600;
  color: var(--c-text-primary);
  box-shadow: 0 8px 28px rgba(28, 20, 16, 0.12);
  white-space: nowrap;
  z-index: 10;
}

.feature-badge svg {
  color: var(--c-accent);
  flex-shrink: 0;
}

.badge-views {
  top: 180px;
  left: 55px;
  animation: floatBadge1 4.5s ease-in-out infinite;
}

.badge-engagement {
  bottom: 280px;
  right: 20px;
  animation: floatBadge2 4.8s ease-in-out 0.3s infinite;
}

@keyframes floatBadge1 {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
}

@keyframes floatBadge2 {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(8px);
  }
}

/* ═══════════════════════════════════════════════════════
   FEATURES GRID SECTION
═══════════════════════════════════════════════════════ */
.features-grid-section {
  padding: 80px 48px 100px;
  max-width: 1480px;
  margin: 0 auto;
}

.section-header {
  margin-bottom: 56px;
  text-align: center;
}

.features-grid-title {
  margin: 0;
  font-size: clamp(2rem, 3.5vw, 3.2rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -1px;
  color: var(--c-text-primary);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.feature-card {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: 16px;
  padding: 36px 30px 30px;
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.3s, box-shadow 0.3s;
  animation: rise 0.55s ease both;
  animation-delay: calc(var(--i) * 70ms);
}

.feature-card:hover {
  transform: translateY(-6px);
  border-color: var(--c-accent);
  box-shadow: 0 20px 50px rgba(124, 92, 78, 0.12);
}

.card-icon {
  font-size: 1.8rem;
  margin-bottom: 18px;
  width: 58px;
  height: 58px;
  background: var(--c-accent-subtle);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-card h3 {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--c-text-primary);
  margin: 0 0 10px;
  letter-spacing: -0.3px;
}

.feature-card p {
  font-size: 0.93rem;
  color: var(--c-text-secondary);
  line-height: 1.8;
  margin: 0;
  font-weight: 400;
}

@keyframes rise {
  from {
    opacity: 0;
    transform: translateY(24px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ═══════════════════════════════════════════════════════
   CTA STRIP
═══════════════════════════════════════════════════════ */
.cta-strip {
  padding: 0 48px 100px;
}

.cta-inner {
  max-width: 1380px;
  margin: 0 auto;
  background: linear-gradient(135deg, var(--c-accent-hover) 0%, var(--c-accent) 40%, var(--c-accent-2) 100%);
  border-radius: 20px;
  padding: 56px 56px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
  flex-wrap: wrap;
  position: relative;
  overflow: hidden;
}

.cta-inner::before {
  content: '';
  position: absolute;
  inset: 0;
  background-image: linear-gradient(rgba(255, 255, 255, 0.04) 1px, transparent 1px),
  linear-gradient(90deg, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
  background-size: 48px 48px;
  pointer-events: none;
}

.cta-copy {
  position: relative;
  z-index: 1;
}

.cta-copy h2 {
  font-size: 1.8rem;
  font-weight: 800;
  color: white;
  letter-spacing: -0.5px;
  margin: 0 0 8px;
}

.cta-copy p {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.85);
  margin: 0;
}

.cta-btn {
  position: relative;
  z-index: 1;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 28px;
  background: white;
  color: var(--c-accent);
  font-weight: 700;
  font-size: 14px;
  border-radius: 10px;
  text-decoration: none;
  white-space: nowrap;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.18);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.cta-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25);
}

.cta-btn svg {
  transition: transform 0.2s;
}

.cta-btn:hover svg {
  transform: translateX(3px);
}

/* ═══════════════════════════════════════════════════════
   WALLET SHOWCASE SECTION
═══════════════════════════════════════════════════════ */
.wallet-showcase {
  padding: 0 48px 100px;
}

.wallet-showcase__inner {
  max-width: 1380px;
  margin: 0 auto;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: 24px;
  padding: 72px 80px;
  display: flex;
  align-items: center;
  gap: 80px;
  overflow: hidden;
  position: relative;
}

.wallet-showcase__inner::before {
  content: '';
  position: absolute;
  top: -120px;
  right: -80px;
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(160, 112, 96, 0.10), transparent 70%);
  pointer-events: none;
}

.wallet-header {
  flex: 1;
  min-width: 280px;
  order: 1;  /* ADD THIS — pushes copy to right */
}

.wallet-title {
  font-size: clamp(1.8rem, 3vw, 2.8rem);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.8px;
  color: var(--c-text-primary);
  margin: 0 0 20px;
}

.wallet-subtitle {
  font-size: 1rem;
  line-height: 1.8;
  color: var(--c-text-secondary);
  margin: 0;
  max-width: 420px;
}

/* Replace the wallet-phones, wallet-phone, and wallet-phone__img styles */

.wallet-phones {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  flex-shrink: 0;
  order: 0;  /* ADD THIS — pulls phones to left */
}

.wallet-phone {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  position: relative;
}

.wallet-phone--apple {
  transform: rotate(-6deg) translateY(-20px);
  animation: floatWallet1 6s ease-in-out infinite;
  z-index: 2;
}

.wallet-phone--google {
  transform: rotate(6deg) translateY(20px);
  animation: floatWallet2 6.5s ease-in-out 0.4s infinite;
  z-index: 1;
}

@keyframes floatWallet1 {
  0%, 100% { transform: rotate(-6deg) translateY(-20px); }
  50%       { transform: rotate(-6deg) translateY(-32px); }
}

@keyframes floatWallet2 {
  0%, 100% { transform: rotate(6deg) translateY(20px); }
  50%       { transform: rotate(6deg) translateY(8px); }
}

.wallet-phone__label {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: 100px;
  font-size: 12px;
  font-weight: 700;
  color: var(--c-text-secondary);
  letter-spacing: 0.3px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  /* Keep label upright even when phone is tilted */
  transform: rotate(6deg);
}

.wallet-phone--google .wallet-phone__label {
  transform: rotate(-6deg);
}

.wallet-phone__label svg {
  color: var(--c-accent);
  flex-shrink: 0;
}

.wallet-phone__img {
  width: 260px;          /* was 240px — bigger */
  height: auto;
  display: block;
  filter: drop-shadow(0 32px 60px rgba(0, 0, 0, 0.35));
}

.google {
  width: 320px;
}

/* Divider between phones */
.wallet-divider {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--c-accent-subtle);
  border: 1px solid var(--c-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  font-weight: 700;
  color: var(--c-text-muted);
  flex-shrink: 0;
  align-self: center;
  margin-bottom: 0;
}

/* ═══════════════════════════════════════════════════════
   ANALYTICS SHOWCASE SECTION
═══════════════════════════════════════════════════════ */
.analytics-showcase {
  padding: 0 48px 100px;
}

.analytics-showcase__inner {
  max-width: 1380px;
  margin: 0 auto;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: 24px;
  padding: 80px 80px 80px 80px;
  display: flex;
  align-items: center;
  gap: 64px;
  position: relative;
  overflow: hidden;
}

.analytics-showcase__inner::before {
  content: '';
  position: absolute;
  top: -100px;
  left: -80px;
  width: 480px;
  height: 480px;
  background: radial-gradient(circle, rgba(160, 112, 96, 0.09), transparent 70%);
  pointer-events: none;
}

/* LEFT COPY */
.analytics-copy {
  flex: 1;
  min-width: 280px;
  position: relative;
  z-index: 1;
}

.analytics-title {
  font-size: clamp(1.8rem, 3vw, 2.8rem);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.8px;
  color: var(--c-text-primary);
  margin: 0 0 20px;
}

.analytics-subtitle {
  font-size: 1rem;
  line-height: 1.8;
  color: var(--c-text-secondary);
  margin: 0 0 36px;
  max-width: 440px;
}

/* Stats row */
.analytics-stats {
  display: flex;
  align-items: center;
  gap: 0;
  margin-bottom: 36px;
  background: var(--c-accent-subtle);
  border: 1px solid var(--c-border);
  border-radius: 14px;
  padding: 24px 28px;
  width: fit-content;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 0 28px;
}

.stat-item:first-child {
  padding-left: 0;
}

.stat-item:last-child {
  padding-right: 0;
}

.stat-number {
  font-size: 1.8rem;
  font-weight: 800;
  letter-spacing: -1px;
  color: var(--c-accent);
  line-height: 1;
}

.stat-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: var(--c-text-muted);
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: var(--c-border);
  flex-shrink: 0;
}

/* Feature list */
.analytics-features {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.analytics-features li {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.93rem;
  color: var(--c-text-secondary);
  font-weight: 500;
  line-height: 1.5;
}

.af-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--c-accent);
  flex-shrink: 0;
}

/* RIGHT VISUAL */
.analytics-visual {
  flex: 1.3;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.analytics-glow {
  position: absolute;
  width: 380px;
  height: 280px;
  background: radial-gradient(ellipse, rgba(196, 144, 110, 0.18), transparent 70%);
  filter: blur(48px);
  pointer-events: none;
  z-index: 0;
}

.analytics-laptop {
  width: 100%;
  max-width: 680px;
  height: auto;
  display: block;
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 32px 64px rgba(0, 0, 0, 0.22));
  animation: floatLaptop 8s ease-in-out infinite;
  transition: opacity 0.4s ease;
}

@keyframes floatLaptop {
  0%, 100% { transform: translateY(0px); }
  50%       { transform: translateY(-10px); }
}


/* ═══════════════════════════════════════════════════════
   TEAM MANAGEMENT SHOWCASE
═══════════════════════════════════════════════════════ */
.team-showcase {
  padding: 0 48px 100px;
}

.team-showcase__inner {
  max-width: 1380px;
  margin: 0 auto;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: 24px;
  padding: 80px;
  display: flex;
  align-items: center;
  gap: 45px;
  position: relative;
  overflow: hidden;
}

.team-showcase__inner::before {
  content: '';
  position: absolute;
  top: -100px;
  right: -80px;
  width: 480px;
  height: 480px;
  background: radial-gradient(circle, rgba(160, 112, 96, 0.09), transparent 70%);
  pointer-events: none;
}

/* LEFT COPY */
.team-copy {
  flex: 1.1;
  min-width: 280px;
  position: relative;
  z-index: 1;
  order: 1;
}

.team-title {
  font-size: clamp(1.8rem, 3vw, 2.8rem);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.8px;
  color: var(--c-text-primary);
  margin: 0 0 20px;
}

.team-subtitle {
  font-size: 1rem;
  line-height: 1.8;
  color: var(--c-text-secondary);
  margin: 0 0 36px;
  max-width: 540px;
}

.team-feature-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.team-feature-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.team-feature-icon {
  width: 42px;
  height: 42px;
  background: var(--c-accent-subtle);
  border: 1px solid var(--c-border);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.team-feature-text {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.team-feature-text strong {
  font-size: 0.93rem;
  font-weight: 700;
  color: var(--c-text-primary);
}

.team-feature-text span {
  font-size: 0.88rem;
  color: var(--c-text-secondary);
  line-height: 1.6;
}

/* RIGHT VISUAL */
.team-visual {
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  flex-shrink: 0;
  order: 0;
}

.team-glow {
  position: absolute;
  width: 400px;
  height: 300px;
  background: radial-gradient(ellipse, rgba(196, 144, 110, 0.15), transparent 70%);
  filter: blur(48px);
  pointer-events: none;
  z-index: 0;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* Slideshow */
.team-slides {
  position: relative;
  width: 100%;
  z-index: 1;
}

.team-slide {
  width: 100%;
  height: auto;
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  filter: drop-shadow(0 32px 64px rgba(0, 0, 0, 0.18));
  border-radius: 8px;
  opacity: 0;
  transform: translateY(12px) scale(0.98);
  transition: opacity 0.6s ease, transform 0.6s ease;
  pointer-events: none;
}

.team-slide.active {
  opacity: 1;
  transform: translateY(0) scale(1);
  position: relative;   /* active slide takes up space */
  pointer-events: auto;
}

/* Dot indicators */
.team-indicators {
  display: flex;
  gap: 8px;
  z-index: 2;
  order: 1; /* sits below the image */
}

.team-indicator {
  width: 28px;
  height: 4px;
  border-radius: 2px;
  border: none;
  background: var(--c-border);
  cursor: pointer;
  padding: 0;
  transition: background 0.3s ease, width 0.3s ease;
}

.team-indicator.active {
  background: var(--c-accent);
  width: 48px;
}

/* ═══════════════════════════════════════════════════════
   QR CODE SHOWCASE SECTION
═══════════════════════════════════════════════════════ */
.qr-showcase {
  padding: 0 48px 100px;
}

.qr-showcase__inner {
  max-width: 1380px;
  margin: 0 auto;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: 24px;
  padding: 80px;
  display: flex;
  align-items: center;
  gap: 32px;
  position: relative;
  overflow: hidden;
}

.qr-showcase__inner::before {
  content: '';
  position: absolute;
  top: -100px;
  left: -80px;
  width: 480px;
  height: 480px;
  background: radial-gradient(circle, rgba(160, 112, 96, 0.09), transparent 70%);
  pointer-events: none;
}

/* LEFT COPY */
.qr-copy {
  flex: 1.2;
  min-width: 280px;
  position: relative;
  z-index: 1;
  order: 0;
}

.qr-title {
  font-size: clamp(1.8rem, 3vw, 2.8rem);
  font-weight: 800;
  line-height: 1.15;
  letter-spacing: -0.8px;
  color: var(--c-text-primary);
  margin: 0 0 20px;
}

.qr-subtitle {
  font-size: 1rem;
  line-height: 1.8;
  color: var(--c-text-secondary);
  margin: 0 0 36px;
  max-width: 480px;
}

.qr-feature-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.qr-feature-item {
  display: flex;
  align-items: flex-start;
  gap: 14px;
}

.qr-feature-icon {
  width: 42px;
  height: 42px;
  background: var(--c-accent-subtle);
  border: 1px solid var(--c-border);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.qr-feature-text {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.qr-feature-text strong {
  font-size: 0.93rem;
  font-weight: 700;
  color: var(--c-text-primary);
}

.qr-feature-text span {
  font-size: 0.88rem;
  color: var(--c-text-secondary);
  line-height: 1.6;
}

/* RIGHT VISUAL */
.qr-visual {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  min-width: 0;
  order: 1;
}

.qr-glow {
  position: absolute;
  width: 400px;
  height: 320px;
  background: radial-gradient(ellipse, rgba(196, 144, 110, 0.16), transparent 70%);
  filter: blur(52px);
  pointer-events: none;
  z-index: 0;
}

.qr-image {
  width: 130%;
  max-width: 920px;        /* ← bigger, up from 600px */
  height: auto;
  display: block;
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 32px 64px rgba(0, 0, 0, 0.28));
  animation: floatQR 7s ease-in-out infinite;
  transition: opacity 0.4s ease;
  transform-origin: center center;
}

@keyframes floatQR {
  0%, 100% { transform: translateY(0px) rotate(-26deg); }
  50%       { transform: translateY(-22px) rotate(-26deg); }
}

/* Responsive */
@media (max-width: 1100px) {
  .qr-showcase__inner {
    flex-direction: column;
    padding: 56px 40px;
    gap: 48px;
  }

  .qr-copy {
    text-align: center;
    order: 0;
  }

  .qr-visual {
    order: 1;
    width: 100%;
  }

  .qr-subtitle {
    max-width: 100%;
  }

  .qr-feature-item {
    justify-content: flex-start;
    text-align: left;
  }
}

@media (max-width: 600px) {
  .qr-showcase {
    padding: 0 24px 80px;
  }

  .qr-showcase__inner {
    padding: 40px 24px;
  }
}

/* Responsive */
@media (max-width: 1100px) {
  .team-showcase__inner {
    flex-direction: column;
    padding: 56px 40px;
    gap: 48px;
  }

  .team-copy {
    text-align: center;
  }

  .team-subtitle {
    max-width: 100%;
  }

  .team-feature-item {
    justify-content: center;
    text-align: left;
  }

  .team-copy {
    order: 0;
  }

  .team-visual {
    order: 1;
  }
}

@media (max-width: 600px) {
  .team-showcase {
    padding: 0 24px 80px;
  }

  .team-showcase__inner {
    padding: 40px 24px;
  }
}

/* Responsive */
@media (max-width: 1100px) {
  .analytics-showcase__inner {
    flex-direction: column;
    padding: 56px 40px;
    gap: 48px;
  }

  .analytics-copy {
    text-align: center;
  }

  .analytics-stats {
    margin: 0 auto 36px;
  }

  .analytics-features {
    align-items: center;
  }

  .analytics-subtitle {
    max-width: 100%;
  }
}

@media (max-width: 600px) {
  .analytics-showcase {
    padding: 0 24px 80px;
  }

  .analytics-showcase__inner {
    padding: 40px 24px;
  }

  .analytics-stats {
    flex-wrap: wrap;
    width: 100%;
    justify-content: center;
    gap: 16px;
  }

  .stat-divider {
    display: none;
  }

  .stat-item {
    padding: 0 16px;
    align-items: center;
  }
}

@media (max-width: 1100px) {
  .wallet-showcase__inner {
    flex-direction: column;
    padding: 56px 40px;
    gap: 48px;
  }

  .wallet-header {
    text-align: center;
  }

  .wallet-subtitle {
    max-width: 100%;
  }
}

@media (max-width: 600px) {
  .wallet-showcase {
    padding: 0 24px 80px;
  }

  .wallet-showcase__inner {
    padding: 40px 24px;
  }

  /* KEEP phones side by side, don't stack */
  .wallet-phones {
    flex-direction: row;
    align-items: flex-end;
    gap: 8px;
    width: 100%;
    justify-content: center;
  }

  .wallet-divider {
    margin-bottom: 40px; /* push divider to vertical center between the two phones */
    transform: none;
  }

  /* Shrink images to fit side by side on small screens */
  .wallet-phone__img {
    width: 110px;
  }

  .google {
    width: 135px;
  }

  /* Shrink labels too */
  .wallet-phone__label {
    font-size: 10px;
    padding: 6px 10px;
  }

  .wallet-phone__label svg {
    width: 13px;
    height: 13px;
  }
}

/* ═══════════════════════════════════════════════════════
   RESPONSIVE
═══════════════════════════════════════════════════════ */
@media (max-width: 1100px) {
  .phone-showcase__inner {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .phone-copy {
    max-width: 100%;
    order: -1;
  }

  .phone-mockup-wrap {
    order: 0;
  }

  .phone-mockup {
    width: 420px;
  }

  .badge-views {
    display: none;
  }

  .badge-engagement {
    display: none;
  }
}

@media (max-width: 768px) {
  .phone-showcase {
    padding: 240px 24px 60px;
  }

  .features-grid-section {
    padding: 60px 24px 80px;
  }

  .cta-strip {
    padding: 0 24px 80px;
  }

  .cta-inner {
    padding: 40px 28px;
  }

  .phone-mockup {
    width: 300px;
  }

  .showcase-headline {
    font-size: 1.8rem;
  }
}

@media (max-width: 480px) {
  .phone-mockup {
    margin-top: -40px;
    margin-bottom: -140px;
    width: 320px;
  }

  .phone-mockup-wrap {
    padding: 20px 20px;
  }

  .highlights-row {
    gap: 10px;
  }

  .cta-group {
    flex-direction: column;
    width: 100%;
  }

  .btn {
    width: 100%;
    justify-content: center;
  }
}

@media (prefers-reduced-motion: reduce) {
  .phone-mockup, .feature-badge, .eyebrow-dot {
    animation: none !important;
  }
}
</style>
