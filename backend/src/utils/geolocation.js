import axios from 'axios';
import NodeCache from 'node-cache'; // npm install node-cache

// Cache location data for 24 hours (86400 seconds)
const locationCache = new NodeCache({ stdTTL: 86400 });

/**
 * Get location data from IP address with caching
 */
export async function getLocationFromIP(ip) {
    // Skip localhost/private IPs
    if (!ip || ip === '::1' || ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.')) {
        console.log('⚠️ Local IP detected, using fallback location');
        return getFallbackLocation();
    }

    // Check cache first
    const cached = locationCache.get(ip);
    if (cached) {
        console.log('✅ Using cached location for', ip);
        return cached;
    }

    try {
        console.log('🌍 Fetching location for IP:', ip);

        // Method 1: ip-api.com (45 requests/minute free, no key needed)
        const response = await axios.get(`http://ip-api.com/json/${ip}?fields=status,country,countryCode,city,regionName,lat,lon`, {
            timeout: 5000
        });

        if (response.data.status === 'success') {
            const location = {
                country: response.data.country || 'Unknown',
                countryCode: response.data.countryCode || 'XX',
                city: response.data.city || 'Unknown',
                region: response.data.regionName || 'Unknown',
                latitude: response.data.lat || null,
                longitude: response.data.lon || null
            };

            // Cache the result
            locationCache.set(ip, location);
            console.log('✅ Location found:', location);
            return location;
        }
    } catch (error) {
        console.warn('⚠️ ip-api.com failed:', error.message);
    }

    // Fallback: ipapi.co
    try {
        const response = await axios.get(`https://ipapi.co/${ip}/json/`, {
            timeout: 5000
        });

        if (response.data.error) {
            throw new Error(response.data.reason || 'API error');
        }

        const location = {
            country: response.data.country_name || 'Unknown',
            countryCode: response.data.country_code || 'XX',
            city: response.data.city || 'Unknown',
            region: response.data.region || 'Unknown',
            latitude: response.data.latitude || null,
            longitude: response.data.longitude || null
        };

        locationCache.set(ip, location);
        return location;
    } catch (error) {
        console.error('❌ All geolocation services failed:', error.message);
    }

    return getFallbackLocation();
}

/**
 * Get fallback location for development/local testing
 */
function getFallbackLocation() {
    return {
        country: 'Development',
        countryCode: 'DEV',
        city: 'Local',
        region: 'Local',
        latitude: null,
        longitude: null
    };
}

/**
 * Anonymize IP address for privacy (GDPR compliance)
 */
export function anonymizeIP(ip) {
    if (!ip) return null;

    // IPv6
    if (ip.includes(':')) {
        return ip.split(':').slice(0, 4).join(':') + '::';
    }

    // IPv4
    return ip.split('.').slice(0, 3).join('.') + '.0';
}

/**
 * Extract real IP from request (handles proxies)
 */
export function getClientIP(req) {
    const ip = (
        req.headers['x-forwarded-for']?.split(',')[0].trim() ||
        req.headers['x-real-ip'] ||
        req.headers['cf-connecting-ip'] || // Cloudflare
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.ip
    );

    // Clean up IPv6 localhost
    if (ip === '::1') return '127.0.0.1';
    if (ip?.startsWith('::ffff:')) return ip.substring(7);

    return ip;
}
