// ============================================
// FILE: frontend/src/utils/translator.js
// ============================================

const translationCache = new Map();

/**
 * Translate text using MyMemory Translation API (Free, no API key needed)
 * Supports up to 1000 words per day for free
 */
export async function translateText(text, targetLang = 'ar', sourceLang = 'en') {
    if (!text || text.trim() === '') return text;

    // Strip HTML tags for translation, then re-add them
    const hasHtml = /<[^>]*>/g.test(text);
    let plainText = text;

    if (hasHtml) {
        plainText = text.replace(/<[^>]*>/g, '');
    }

    const cacheKey = `${plainText}_${sourceLang}_${targetLang}`;

    if (translationCache.has(cacheKey)) {
        const cached = translationCache.get(cacheKey);
        return hasHtml ? `<p>${cached}</p>` : cached;
    }

    try {
        const response = await fetch(
            `https://api.mymemory.translated.net/get?q=${encodeURIComponent(plainText)}&langpair=${sourceLang}|${targetLang}`
        );

        if (!response.ok) {
            throw new Error('Translation API failed');
        }

        const data = await response.json();

        if (data.responseStatus === 200 && data.responseData) {
            const translated = data.responseData.translatedText;
            translationCache.set(cacheKey, translated);
            return hasHtml ? `<p>${translated}</p>` : translated;
        }

        return text;

    } catch (error) {
        console.error('Translation failed:', error);
        return text;
    }
}

// Add this new function after translateText()
export async function translateWithGoogle(text, targetLang = 'ar', sourceLang = 'en') {
    if (!text || text.trim() === '') return text;

    const hasHtml = /<[^>]*>/g.test(text);
    let plainText = hasHtml ? text.replace(/<[^>]*>/g, '') : text;

    const cacheKey = `google_${plainText}_${sourceLang}_${targetLang}`;

    if (translationCache.has(cacheKey)) {
        const cached = translationCache.get(cacheKey);
        return hasHtml ? `<p>${cached}</p>` : cached;
    }

    try {
        const response = await fetch(
            `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(plainText)}`
        );

        const data = await response.json();
        const translated = data[0].map(item => item[0]).join('');

        translationCache.set(cacheKey, translated);
        return hasHtml ? `<p>${translated}</p>` : translated;

    } catch (error) {
        console.error('Google translation failed:', error);
        return text;
    }
}

/**
 * Translate multiple texts in batch
 */
// Replace the existing translateBatch function with this:
export async function translateBatch(texts, targetLang = 'ar', sourceLang = 'en', useGoogle = true) {
    const translateFunc = useGoogle ? translateWithGoogle : translateText;
    const promises = texts.map(text => translateFunc(text, targetLang, sourceLang));
    return await Promise.all(promises);
}
/**
 * Clear translation cache
 */
export function clearTranslationCache() {
    translationCache.clear();
}

/**
 * Alternative: LibreTranslate (requires self-hosted or API key)
 * Uncomment if you want to use LibreTranslate instead
 */
/*
export async function translateTextLibre(text, targetLang = 'ar', sourceLang = 'en') {
  if (!text || text.trim() === '') return text;

  const cacheKey = `${text}_${sourceLang}_${targetLang}`;

  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }

  try {
    const response = await fetch('https://libretranslate.de/translate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: text,
        source: sourceLang,
        target: targetLang,
        format: 'text'
      })
    });

    const data = await response.json();
    const translated = data.translatedText;

    translationCache.set(cacheKey, translated);
    return translated;

  } catch (error) {
    console.error('Translation failed:', error);
    return text;
  }
}
*/
