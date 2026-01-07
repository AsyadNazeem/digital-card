/**
 * Parse browser from user agent string
 */
export function parseBrowser(userAgent) {
    if (!userAgent) return 'Unknown';

    const ua = userAgent.toLowerCase();

    if (ua.includes('edg/')) return 'Edge';
    if (ua.includes('chrome')) return 'Chrome';
    if (ua.includes('safari') && !ua.includes('chrome')) return 'Safari';
    if (ua.includes('firefox')) return 'Firefox';
    if (ua.includes('opera') || ua.includes('opr/')) return 'Opera';
    if (ua.includes('msie') || ua.includes('trident/')) return 'Internet Explorer';

    return 'Other';
}

/**
 * Parse operating system from user agent string
 */
export function parseOS(userAgent) {
    if (!userAgent) return 'Unknown';

    const ua = userAgent.toLowerCase();

    if (ua.includes('windows')) return 'Windows';
    if (ua.includes('mac os') || ua.includes('macos')) return 'MacOS';
    if (ua.includes('iphone') || ua.includes('ipad')) return 'iOS';
    if (ua.includes('android')) return 'Android';
    if (ua.includes('linux')) return 'Linux';
    if (ua.includes('ubuntu')) return 'Ubuntu';

    return 'Other';
}

/**
 * Enhanced device type detection from user agent
 * ✅ FIXED: Now properly detects mobile and tablet devices
 */
export function getDeviceType(userAgent) {
    if (!userAgent) return 'unknown';

    const ua = userAgent.toLowerCase();

    // Windows Phone must come first (its UA also contains "Android")
    if (/windows phone/i.test(ua)) {
        return 'mobile';
    }

    // Android tablets (no "mobile" in UA)
    if (/android/i.test(ua) && !/mobile/i.test(ua)) {
        return 'tablet';
    }

    // iPad (including iPadOS 13+ which reports as desktop)
    // iPadOS 13+ Safari reports as: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15) ... Safari"
    // But has touch points
    if (/ipad/i.test(ua)) {
        return 'tablet';
    }

    // Other tablets
    if (/tablet|playbook|silk/i.test(ua)) {
        return 'tablet';
    }

    // Mobile devices (phones)
    if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini|webos|bb10/i.test(ua)) {
        return 'mobile';
    }

    // Default to desktop
    return 'desktop';
}
