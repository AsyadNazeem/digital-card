// ============================================
// FILE: frontend/src/i18n/index.js (CREATE THIS FILE)
// ============================================

import { createI18n } from 'vue-i18n';

const messages = {
    en: {
        selectLanguage: 'Select Language',
        share: 'Share',
        mobile: 'Mobile',
        whatsapp: 'WhatsApp',
        email: 'Email',
        office: 'Office',
        website: 'Website',
        location: 'Location',
        saveContact: 'Save Contact',
        view360: '360° View',
        reviews: 'Reviews',
        poweredBy: 'Powered by',
        reviewUs: 'Review Us',
        contactUs: 'Contact Us',
        sendMessageTo: 'Send a message to',
        yourName: 'Your Name',
        yourEmail: 'Your Email',
        enterYourName: 'Enter your full name',
        enterYourEmail: 'Enter your email address',
        messageSubject: 'Brief subject of your message',
        enterYourMessage: 'Tell us how we can help you...',
        sending: 'Sending...',
        sendMessage: 'Send Message'
    },
    ar: {
        selectLanguage: 'اختر اللغة',
        share: 'مشاركة',
        mobile: 'موبايل',
        whatsapp: 'واتساب',
        email: 'البريد الإلكتروني',
        office: 'مكتب',
        website: 'موقع الكتروني',
        location: 'موقع',
        saveContact: 'حفظ جهة الاتصال',
        view360: 'عرض 360°',
        reviews: 'التقييمات',
        poweredBy: 'مشغل بواسطة',
        reviewUs: 'قيمنا',
        contactUs: 'اتصل بنا',
        sendMessageTo: 'أرسل رسالة إلى',
        yourName: 'اسمك',
        yourEmail: 'بريدك الإلكتروني',
        enterYourName: 'أدخل اسمك الكامل',
        enterYourEmail: 'أدخل عنوان بريدك الإلكتروني',
        messageSubject: 'موضوع مختصر لرسالتك',
        enterYourMessage: 'أخبرنا كيف يمكننا مساعدتك...',
        sending: 'جاري الإرسال...',
        sendMessage: 'إرسال رسالة',
    }
};

const i18n = createI18n({
    legacy: false,
    locale: 'en',
    fallbackLocale: 'en',
    messages
});

export default i18n;
