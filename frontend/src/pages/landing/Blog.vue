<template>
  <div class="blog-page">

    <!-- HERO -->
    <section class="page-hero">
      <div class="hero-glow glow-1" />
      <div class="hero-glow glow-2" />
      <div class="hero-inner">
        <div class="pill-badge">BLOG</div>
        <h1 class="hero-title">
          Insights for the<br />
          <em>modern professional</em>
        </h1>
        <p class="hero-desc">
          Tips, trends, and stories about digital networking, personal branding,
          and building meaningful business connections.
        </p>
      </div>
    </section>

    <!-- CATEGORIES -->
    <section class="categories-bar">
      <div class="categories-inner">
        <button
            v-for="cat in categories"
            :key="cat"
            class="cat-btn"
            :class="{ active: activeCategory === cat }"
            @click="activeCategory = cat"
        >
          {{ cat }}
        </button>
      </div>
    </section>

    <!-- FEATURED POST -->
    <section class="featured-section">
      <div class="featured-inner">
        <div class="featured-card">
          <div class="featured-label">Featured</div>
          <div class="featured-meta">
            <span class="cat-tag">{{ featured.category }}</span>
            <span class="dot-sep">·</span>
            <span class="read-time">{{ featured.readTime }}</span>
            <span class="dot-sep">·</span>
            <span class="post-date">{{ featured.date }}</span>
          </div>
          <h2 class="featured-title">{{ featured.title }}</h2>
          <p class="featured-excerpt">{{ featured.excerpt }}</p>
          <div class="featured-footer">
            <div class="author">
              <div class="author-avatar">{{ featured.author.initials }}</div>
              <div>
                <p class="author-name">{{ featured.author.name }}</p>
                <p class="author-role">{{ featured.author.role }}</p>
              </div>
            </div>
            <a href="#" class="read-btn">Read article →</a>
          </div>
        </div>
      </div>
    </section>

    <!-- POSTS GRID -->
    <section class="posts-section">
      <div class="posts-inner">
        <div class="posts-grid">
          <div
              v-for="(post, i) in filteredPosts"
              :key="post.title"
              class="post-card"
              :style="{ '--i': i }"
          >
            <div class="post-image-placeholder">
              <span class="post-emoji">{{ post.emoji }}</span>
            </div>
            <div class="post-body">
              <div class="post-meta">
                <span class="cat-tag">{{ post.category }}</span>
                <span class="dot-sep">·</span>
                <span class="read-time">{{ post.readTime }}</span>
              </div>
              <h3 class="post-title">{{ post.title }}</h3>
              <p class="post-excerpt">{{ post.excerpt }}</p>
              <div class="post-footer">
                <div class="author-mini">
                  <div class="author-avatar-sm">{{ post.author.initials }}</div>
                  <span class="author-name-sm">{{ post.author.name }}</span>
                </div>
                <span class="post-date">{{ post.date }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="filteredPosts.length === 0" class="empty-state">
          <span>📭</span>
          <p>No posts in this category yet. Check back soon!</p>
        </div>

        <!-- Load more -->
        <div class="load-more-wrap" v-if="filteredPosts.length > 0">
          <button class="load-more-btn">Load more articles</button>
        </div>
      </div>
    </section>

    <!-- NEWSLETTER -->
    <section class="newsletter-section">
      <div class="newsletter-inner">
        <div class="newsletter-card">
          <div class="nl-glow" />
          <div class="nl-content">
            <div class="pill-badge" style="display:inline-flex;margin-bottom:16px">NEWSLETTER</div>
            <h2>Get the latest straight<br /><em>to your inbox</em></h2>
            <p>Weekly tips on digital networking, NFC tech, and personal branding. No spam, ever.</p>
            <div class="nl-form">
              <input v-model="email" type="email" placeholder="your@email.com" />
              <button @click="subscribe" :class="{ subscribed }">
                {{ subscribed ? '✓ Subscribed!' : 'Subscribe' }}
              </button>
            </div>
            <p class="nl-note">Join 3,200+ professionals. Unsubscribe any time.</p>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup>
import { computed, ref } from 'vue'

const activeCategory = ref('All')
const email          = ref('')
const subscribed     = ref(false)

const categories = ['All', 'Networking', 'NFC & Tech', 'Personal Branding', 'Business Tips', 'Product Updates']

const featured = {
  category: 'Networking',
  readTime: '6 min read',
  date: 'May 8, 2026',
  title: 'Why Paper Business Cards Are Costing You More Than You Think',
  excerpt: 'The average professional loses 27% of the cards they hand out within a week. We analysed data from 5,000 TapMyName users to uncover what happens after the handshake — and the numbers will surprise you.',
  author: { initials: 'AN', name: 'Asyad Nazeem', role: 'Co-Founder & CEO' },
}

const posts = [
  {
    emoji: '📱',
    category: 'NFC & Tech',
    readTime: '4 min read',
    date: 'May 3, 2026',
    title: 'How NFC Business Cards Actually Work (Plain English)',
    excerpt: 'No jargon, no fluff — just a clear breakdown of the tech that makes one tap share your entire professional identity.',
    author: { initials: 'RS', name: 'Rania Silva' },
  },
  {
    emoji: '🎨',
    category: 'Personal Branding',
    readTime: '5 min read',
    date: 'Apr 28, 2026',
    title: '7 Profile Mistakes That Kill First Impressions',
    excerpt: 'Your digital card is often the first thing a new contact sees. Here are the most common design and content mistakes — and how to fix them.',
    author: { initials: 'KP', name: 'Keanu Perera' },
  },
  {
    emoji: '📊',
    category: 'Business Tips',
    readTime: '7 min read',
    date: 'Apr 20, 2026',
    title: 'How to Turn Card Views into Booked Meetings',
    excerpt: 'Analytics without action is just numbers. We break down exactly how to use your TapMyName engagement data to convert profile views into real opportunities.',
    author: { initials: 'FM', name: 'Fatima Mohamed' },
  },
  {
    emoji: '🏢',
    category: 'Business Tips',
    readTime: '5 min read',
    date: 'Apr 14, 2026',
    title: 'Rolling Out Digital Cards Across a 200-Person Team',
    excerpt: 'A step-by-step playbook from one of our enterprise clients on how they migrated an entire sales team to TapMyName in under two weeks.',
    author: { initials: 'AN', name: 'Asyad Nazeem' },
  },
  {
    emoji: '🚀',
    category: 'Product Updates',
    readTime: '3 min read',
    date: 'Apr 7, 2026',
    title: 'Introducing Real-Time Analytics v2.0',
    excerpt: 'We\'ve rebuilt analytics from scratch. Location heatmaps, lead scoring, and CRM export are all live today for Pro and Business users.',
    author: { initials: 'RS', name: 'Rania Silva' },
  },
  {
    emoji: '🤝',
    category: 'Networking',
    readTime: '4 min read',
    date: 'Mar 31, 2026',
    title: 'The 60-Second Networking Formula That Actually Works',
    excerpt: 'Most networking advice is either obvious or impractical. Here\'s a dead-simple, research-backed framework for making connections that stick.',
    author: { initials: 'KP', name: 'Keanu Perera' },
  },
]

const filteredPosts = computed(() =>
    activeCategory.value === 'All'
        ? posts
        : posts.filter(p => p.category === activeCategory.value)
)

function subscribe() {
  if (!email.value) return
  subscribed.value = true
  email.value = ''
  setTimeout(() => (subscribed.value = false), 3500)
}
</script>

<style scoped>
.blog-page { padding-top: 80px; min-height: 100vh; color: var(--c-text-primary, #1c1410); }

/* ── Hero ── */
.page-hero { position: relative; text-align: center; padding: 100px 32px 70px; overflow: hidden; }
.hero-glow { position: absolute; border-radius: 50%; filter: blur(120px); pointer-events: none; }
.glow-1 { width: 300px; height: 300px; background: rgba(124,92,78,0.13); top: -60px; right: -60px; }
.glow-2 { width: 260px; height: 260px; background: rgba(200,148,114,0.09); bottom: -50px; left: -40px; }
.hero-inner { position: relative; z-index: 1; max-width: 660px; margin: 0 auto; }

.pill-badge {
  display: inline-flex;
  padding: 8px 18px;
  border-radius: 100px;
  background: var(--c-accent-subtle, #f8f3f0);
  border: 1px solid var(--c-border, #e8e3dc);
  color: var(--c-accent, #7c5c4e);
  font-size: 0.70rem;
  font-weight: 700;
  letter-spacing: 1.8px;
  margin-bottom: 24px;
}

.hero-title { font-size: clamp(2.4rem, 5vw, 4rem); font-weight: 900; line-height: 1.08; letter-spacing: -1.5px; color: var(--c-text-primary, #1c1410); margin: 0 0 20px; }
.hero-title em { font-style: italic; font-family: Georgia, serif; color: var(--c-accent, #7c5c4e); }
.hero-desc { color: var(--c-text-secondary, #5a4f46); line-height: 1.8; font-size: 1.05rem; margin: 0 auto; }

/* ── Categories bar ── */
.categories-bar { padding: 0 32px 32px; }
.categories-inner { max-width: 1200px; margin: 0 auto; display: flex; gap: 10px; flex-wrap: wrap; }

.cat-btn {
  padding: 9px 20px;
  border-radius: 100px;
  border: 1.5px solid var(--c-border, #e8e3dc);
  background: var(--c-surface, #fff);
  color: var(--c-text-secondary, #5a4f46);
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.25s;
  font-family: inherit;
}
.cat-btn:hover { border-color: var(--c-accent, #7c5c4e); color: var(--c-accent, #7c5c4e); }
.cat-btn.active {
  background: var(--c-accent, #7c5c4e);
  border-color: var(--c-accent, #7c5c4e);
  color: white;
}

/* ── Featured ── */
.featured-section { padding: 0 32px 48px; }
.featured-inner { max-width: 1200px; margin: 0 auto; }

.featured-card {
  position: relative;
  background: var(--c-surface, #fff);
  border: 1px solid var(--c-border, #e8e3dc);
  border-radius: 28px;
  padding: 48px;
  background: linear-gradient(135deg, var(--c-accent-subtle, #f8f3f0) 0%, var(--c-surface, #fff) 60%);
  overflow: hidden;
  animation: rise 0.55s ease both;
}

.featured-label {
  position: absolute;
  top: 28px; right: 28px;
  padding: 6px 14px;
  background: linear-gradient(135deg, var(--c-accent-2, #a07060), var(--c-accent, #7c5c4e));
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 1px;
  border-radius: 100px;
}

.featured-meta { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; flex-wrap: wrap; }
.cat-tag { font-size: 0.78rem; font-weight: 700; color: var(--c-accent, #7c5c4e); text-transform: uppercase; letter-spacing: 0.5px; }
.dot-sep, .read-time, .post-date { font-size: 0.82rem; color: var(--c-text-muted, #9e8e84); }

.featured-title { font-size: clamp(1.6rem, 3vw, 2.4rem); font-weight: 900; color: var(--c-text-primary, #1c1410); margin: 0 0 16px; letter-spacing: -0.8px; line-height: 1.2; max-width: 700px; }
.featured-excerpt { font-size: 1rem; color: var(--c-text-secondary, #5a4f46); line-height: 1.8; max-width: 680px; margin: 0 0 32px; }

.featured-footer { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 16px; }
.author { display: flex; align-items: center; gap: 12px; }
.author-avatar { width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, var(--c-accent-2, #a07060), var(--c-accent, #7c5c4e)); color: white; font-weight: 800; font-size: 0.85rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.author-name { margin: 0; font-size: 0.9rem; font-weight: 700; color: var(--c-text-primary, #1c1410); }
.author-role { margin: 3px 0 0; font-size: 0.78rem; color: var(--c-text-muted, #9e8e84); }

.read-btn {
  display: inline-flex; align-items: center;
  padding: 12px 24px;
  background: var(--c-accent, #7c5c4e);
  color: white;
  font-weight: 700; font-size: 0.92rem;
  border-radius: 14px;
  text-decoration: none;
  transition: opacity 0.3s, transform 0.3s;
}
.read-btn:hover { opacity: 0.88; transform: translateY(-2px); }

/* ── Posts grid ── */
.posts-section { padding: 0 32px 80px; }
.posts-inner { max-width: 1200px; margin: 0 auto; }

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.post-card {
  background: var(--c-surface, #fff);
  border: 1px solid var(--c-border, #e8e3dc);
  border-radius: 22px;
  overflow: hidden;
  animation: rise 0.55s ease both;
  animation-delay: calc(var(--i) * 70ms);
  transition: border-color 0.3s, transform 0.3s;
}
.post-card:hover { border-color: var(--c-accent, #7c5c4e); transform: translateY(-5px); }

.post-image-placeholder {
  height: 160px;
  background: var(--c-accent-subtle, #f8f3f0);
  display: flex; align-items: center; justify-content: center;
  border-bottom: 1px solid var(--c-border, #e8e3dc);
}
.post-emoji { font-size: 3rem; }

.post-body { padding: 24px; }
.post-meta { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.post-title { font-size: 1.05rem; font-weight: 800; color: var(--c-text-primary, #1c1410); margin: 0 0 10px; line-height: 1.35; }
.post-excerpt { font-size: 0.88rem; color: var(--c-text-secondary, #5a4f46); line-height: 1.7; margin: 0 0 20px; }

.post-footer { display: flex; align-items: center; justify-content: space-between; }
.author-mini { display: flex; align-items: center; gap: 8px; }
.author-avatar-sm { width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, var(--c-accent-2, #a07060), var(--c-accent, #7c5c4e)); color: white; font-size: 0.65rem; font-weight: 800; display: flex; align-items: center; justify-content: center; }
.author-name-sm { font-size: 0.82rem; font-weight: 600; color: var(--c-text-secondary, #5a4f46); }
.post-date { font-size: 0.78rem; color: var(--c-text-muted, #9e8e84); }

/* empty + load more */
.empty-state { text-align: center; padding: 60px 20px; }
.empty-state span { font-size: 3rem; display: block; margin-bottom: 12px; }
.empty-state p { color: var(--c-text-muted, #9e8e84); font-size: 1rem; }

.load-more-wrap { text-align: center; }
.load-more-btn {
  padding: 13px 32px;
  border-radius: 14px;
  border: 1.5px solid var(--c-border, #e8e3dc);
  background: var(--c-surface, #fff);
  color: var(--c-text-secondary, #5a4f46);
  font-weight: 700; font-size: 0.95rem;
  cursor: pointer; font-family: inherit;
  transition: all 0.3s;
}
.load-more-btn:hover { border-color: var(--c-accent, #7c5c4e); color: var(--c-accent, #7c5c4e); transform: translateY(-2px); }

/* ── Newsletter ── */
.newsletter-section { padding: 0 32px 100px; }
.newsletter-inner { max-width: 1200px; margin: 0 auto; }

.newsletter-card {
  position: relative;
  border-radius: 28px;
  background: linear-gradient(135deg, var(--c-accent, #7c5c4e), var(--c-accent-2, #a07060) 60%, #b87a5e);
  padding: 70px 48px;
  text-align: center;
  overflow: hidden;
}
.nl-glow {
  position: absolute;
  width: 400px; height: 400px;
  border-radius: 50%;
  background: rgba(255,255,255,0.08);
  filter: blur(60px);
  top: -100px; right: -80px;
  pointer-events: none;
}
.nl-content { position: relative; z-index: 1; max-width: 560px; margin: 0 auto; }

.newsletter-card h2 { font-size: clamp(1.8rem, 3.5vw, 2.8rem); font-weight: 900; color: white; letter-spacing: -1px; margin: 0 0 14px; line-height: 1.1; }
.newsletter-card h2 em { font-style: italic; font-family: Georgia, serif; opacity: 0.88; }
.newsletter-card > .nl-content > p { color: rgba(255,255,255,0.82); line-height: 1.7; font-size: 1rem; margin: 0 0 28px; }

.nl-form { display: flex; gap: 12px; max-width: 420px; margin: 0 auto 14px; }
.nl-form input {
  flex: 1;
  padding: 13px 18px;
  border-radius: 14px;
  border: none;
  background: rgba(255,255,255,0.18);
  color: white;
  font-size: 0.95rem;
  font-family: inherit;
  outline: none;
  backdrop-filter: blur(8px);
}
.nl-form input::placeholder { color: rgba(255,255,255,0.6); }
.nl-form input:focus { background: rgba(255,255,255,0.26); }

.nl-form button {
  padding: 13px 24px;
  border-radius: 14px;
  border: none;
  background: white;
  color: var(--c-accent, #7c5c4e);
  font-weight: 800; font-size: 0.92rem;
  cursor: pointer; font-family: inherit;
  transition: all 0.3s;
  white-space: nowrap;
}
.nl-form button:hover { opacity: 0.92; transform: translateY(-2px); }
.nl-form button.subscribed { background: rgba(255,255,255,0.9); }

.nl-note { font-size: 0.78rem; color: rgba(255,255,255,0.6); margin: 0; }

@keyframes rise { from { opacity: 0; transform: translateY(24px); } to { opacity: 1; transform: translateY(0); } }

@media (max-width: 768px) {
  .page-hero, .categories-bar, .featured-section, .posts-section, .newsletter-section { padding-left: 20px; padding-right: 20px; }
  .featured-card { padding: 30px 24px; }
  .posts-grid { grid-template-columns: 1fr; }
  .newsletter-card { padding: 48px 24px; }
  .nl-form { flex-direction: column; }
}
</style>
