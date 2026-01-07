import ContactCardView from '../models/ContactCardView.js';
import ContactCardClick from '../models/ContactCardClick.js';
import AnalyticsSummary from '../models/AnalyticsSummary.js';
import Contact from '../models/Contact.js';
import { getLocationFromIP, anonymizeIP, getClientIP } from '../utils/geolocation.js';
import { parseBrowser, parseOS, getDeviceType } from '../utils/userAgentParser.js';
import { Op, fn, col, literal } from 'sequelize';
import sequelize from '../config/database.js';

/**
 * Helper function to format click types
 */
function formatClickType(clickType) {
    const typeMap = {
        'phone': 'Mobile Call',
        'office_phone': 'Office Call',
        'email': 'Email',
        'whatsapp': 'WhatsApp Message',
        'whatsapp_channel': 'WhatsApp Channel',
        'website': 'Website',
        'location': 'Location/Maps',
        '360_view': '360° View',
        'review': 'Reviews',
        'google_review': 'Google Review',
        'google_wallet': 'Google Wallet',
        'tripadvisor_review': 'TripAdvisor Review',
        'save_contact': 'Save Contact (VCF)', // ✅ Added
        'brochure': 'Brochure',
        'menu': 'Menu',
        'shop_now': 'Shop Now',
        'order_now': 'Order Now',
        'social_facebook': 'Facebook',
        'social_twitter': 'Twitter',
        'social_linkedin': 'LinkedIn',
        'social_instagram': 'Instagram',
        'social_youtube': 'YouTube',
        'social_tiktok': 'TikTok',
        'social_whatsapp': 'WhatsApp Social',
        'social_telegram': 'Telegram',
        'social_snapchat': 'Snapchat',
        'social_pinterest': 'Pinterest',
        'social_reddit': 'Reddit'
    };

    return typeMap[clickType] || clickType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

/**
 * Track page view
 * POST /api/analytics/view/:phone
 */
export const trackView = async (req, res) => {
    try {
        const phone = req.params.phone;
        const { referrer, userAgent, screenResolution, language, gaClientId } = req.body;

        const rawIP = getClientIP(req);
        const ip = anonymizeIP(rawIP);
        const location = await getLocationFromIP(rawIP);

        const deviceType = getDeviceType(userAgent);
        const browser = parseBrowser(userAgent);
        const os = parseOS(userAgent);

        let formattedMobile = phone.startsWith('+') ? phone : '+' + phone.replace(/[^0-9]/g, '');

        const contact = await Contact.findOne({
            where: { mobile: formattedMobile }
        });

        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        await ContactCardView.create({
            contactId: contact.id,
            ipAddress: ip,
            userAgent,
            country: location?.country,
            countryCode: location?.countryCode,
            city: location?.city,
            region: location?.region,
            latitude: location?.latitude,
            longitude: location?.longitude,
            referrer,
            deviceType,
            browser,
            os,
            screenResolution,
            language,
            gaClientId
        });

        await updateDailySummary(contact.id, 'view', ip);

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('❌ Track view error:', error);
        res.status(500).json({ message: 'Failed to track view' });
    }
};

/**
 * Track link click
 * POST /api/analytics/click/:phone
 */
export const trackClick = async (req, res) => {
    try {
        const phone = req.params.phone;
        const { clickType, linkUrl, userAgent, gaClientId } = req.body;

        const rawIP = getClientIP(req);
        const ip = anonymizeIP(rawIP);
        const location = await getLocationFromIP(rawIP);

        const deviceType = getDeviceType(userAgent || req.headers['user-agent']);
        const browser = parseBrowser(userAgent || req.headers['user-agent']);
        const os = parseOS(userAgent || req.headers['user-agent']);

        let formattedMobile = phone.startsWith('+') ? phone : '+' + phone.replace(/[^0-9]/g, '');

        const contact = await Contact.findOne({
            where: { mobile: formattedMobile }
        });

        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        await ContactCardClick.create({
            contactId: contact.id,
            clickType,
            linkUrl,
            ipAddress: ip,
            country: location?.country,
            countryCode: location?.countryCode,
            city: location?.city,
            deviceType,
            browser,
            os,
            gaClientId
        });

        await updateDailySummary(contact.id, 'click', ip);

        res.status(200).json({ success: true });
    } catch (error) {
        console.error('❌ Track click error:', error);
        res.status(500).json({ message: 'Failed to track click' });
    }
};

/**
 * Get analytics dashboard with enhanced metrics
 * GET /api/analytics/dashboard
 */
export const getDashboard = async (req, res) => {
    try {
        const userId = req.user.id;
        console.log('📊 Dashboard request from user:', userId);

        let { startDate, endDate, contactId } = req.query;

        if (!startDate || !endDate) {
            endDate = new Date();
            startDate = new Date();
            startDate.setDate(startDate.getDate() - 30);
        } else {
            startDate = new Date(startDate);
            endDate = new Date(endDate);
        }

        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);

        const userContacts = await Contact.findAll({
            where: { userId },
            attributes: ['id', 'firstName', 'lastName', 'mobile']
        });

        const contactIds = userContacts.map(c => c.id);

        if (contactIds.length === 0) {
            return res.json({
                totalViews: 0,
                totalClicks: 0,
                uniqueVisitors: 0,
                vcfDownloads: 0, // ✅ Added
                clickBreakdown: [],
                clickSummary: {
                    communication: 0,
                    social: 0,
                    content: 0,
                    navigation: 0,
                    conversion: 0, // ✅ Added
                    other: 0
                },
                geoDistribution: [],
                timeline: [],
                deviceBreakdown: [],
                browserBreakdown: [], // ✅ Added
                topReferrers: [], // ✅ Added
                peakHours: [] // ✅ Added
            });
        }

        let whereContact;
        if (contactId && contactId !== 'all') {
            const requestedContactId = parseInt(contactId);
            if (!contactIds.includes(requestedContactId)) {
                return res.status(403).json({
                    message: 'You do not have access to this contact'
                });
            }
            whereContact = { contactId: requestedContactId };
        } else {
            whereContact = { contactId: { [Op.in]: contactIds } };
        }

        const dateWhereViews = {
            [Op.and]: [
                { viewedAt: { [Op.gte]: startDate } },
                { viewedAt: { [Op.lte]: endDate } }
            ]
        };

        const dateWhereClicks = {
            [Op.and]: [
                { clickedAt: { [Op.gte]: startDate } },
                { clickedAt: { [Op.lte]: endDate } }
            ]
        };

        // Basic metrics
        const totalViews = await ContactCardView.count({
            where: { ...whereContact, ...dateWhereViews }
        });

        const totalClicks = await ContactCardClick.count({
            where: { ...whereContact, ...dateWhereClicks }
        });

        const uniqueVisitors = await ContactCardView.count({
            where: { ...whereContact, ...dateWhereViews },
            distinct: true,
            col: 'ipAddress'
        });

        // ✅ VCF Downloads
        const vcfDownloads = await ContactCardClick.count({
            where: {
                ...whereContact,
                ...dateWhereClicks,
                clickType: 'save_contact'
            }
        });

        // Click breakdown
        const clickBreakdownRaw = await ContactCardClick.findAll({
            where: { ...whereContact, ...dateWhereClicks },
            attributes: [
                'clickType',
                [fn('COUNT', col('id')), 'count']
            ],
            group: ['clickType'],
            order: [[literal('count'), 'DESC']]
        });

        const clickBreakdown = clickBreakdownRaw.map(item => ({
            clickType: item.clickType,
            label: formatClickType(item.clickType),
            count: parseInt(item.dataValues.count)
        }));

        // Enhanced click summary
        const socialClicks = clickBreakdown
            .filter(c => c.clickType.startsWith('social_'))
            .reduce((sum, c) => sum + c.count, 0);

        const clickSummary = {
            communication: clickBreakdown
                .filter(c => ['phone', 'office_phone', 'email', 'whatsapp', 'whatsapp_channel'].includes(c.clickType))
                .reduce((sum, c) => sum + c.count, 0),
            social: socialClicks,
            content: clickBreakdown
                .filter(c => ['brochure', 'menu', 'shop_now', 'order_now', '360_view'].includes(c.clickType))
                .reduce((sum, c) => sum + c.count, 0),
            navigation: clickBreakdown
                .filter(c => ['website', 'location', 'review', 'google_review', 'tripadvisor_review'].includes(c.clickType))
                .reduce((sum, c) => sum + c.count, 0),
            conversion: vcfDownloads, // ✅ Added - VCF downloads as conversions
            other: clickBreakdown
                .filter(c => !['phone', 'office_phone', 'email', 'whatsapp', 'whatsapp_channel', 'brochure', 'menu', 'shop_now', 'order_now', '360_view', 'website', 'location', 'review', 'google_review', 'tripadvisor_review', 'save_contact'].includes(c.clickType) && !c.clickType.startsWith('social_'))
                .reduce((sum, c) => sum + c.count, 0)
        };

        // Geographic distribution
        const geoDistribution = await ContactCardView.findAll({
            where: {
                ...whereContact,
                ...dateWhereViews,
                country: { [Op.ne]: null, [Op.ne]: 'Unknown' }
            },
            attributes: [
                'country',
                'countryCode',
                [fn('COUNT', col('id')), 'count']
            ],
            group: ['country', 'countryCode'],
            order: [[literal('count'), 'DESC']],
            limit: 10
        });

        // Device breakdown
        const deviceBreakdown = await ContactCardView.findAll({
            where: { ...whereContact, ...dateWhereViews },
            attributes: [
                'deviceType',
                [fn('COUNT', col('id')), 'count']
            ],
            group: ['deviceType'],
            order: [[literal('count'), 'DESC']]
        });

        // ✅ Browser breakdown
        const browserBreakdown = await ContactCardView.findAll({
            where: { ...whereContact, ...dateWhereViews },
            attributes: [
                'browser',
                [fn('COUNT', col('id')), 'count']
            ],
            group: ['browser'],
            order: [[literal('count'), 'DESC']],
            limit: 5
        });

        // ✅ Top referrers
        const topReferrers = await ContactCardView.findAll({
            where: {
                ...whereContact,
                ...dateWhereViews,
                referrer: { [Op.ne]: null, [Op.ne]: '', [Op.ne]: 'direct' }
            },
            attributes: [
                'referrer',
                [fn('COUNT', col('id')), 'count']
            ],
            group: ['referrer'],
            order: [[literal('count'), 'DESC']],
            limit: 5
        });

        // ✅ Peak hours analysis
        const peakHoursQuery = contactId && contactId !== 'all'
            ? `SELECT HOUR(viewedAt) as hour, COUNT(*) as count
               FROM contact_card_views
               WHERE contactId = :contactId
                 AND viewedAt >= :startDate AND viewedAt <= :endDate
               GROUP BY HOUR(viewedAt)
               ORDER BY hour ASC`
            : `SELECT HOUR(viewedAt) as hour, COUNT(*) as count
               FROM contact_card_views
               WHERE contactId IN (${contactIds.join(',')})
                 AND viewedAt >= :startDate AND viewedAt <= :endDate
               GROUP BY HOUR(viewedAt)
               ORDER BY hour ASC`;

        const peakHours = await sequelize.query(peakHoursQuery, {
            replacements: contactId && contactId !== 'all'
                ? { contactId: parseInt(contactId), startDate, endDate }
                : { startDate, endDate },
            type: sequelize.QueryTypes.SELECT
        });

        // Timeline
        let timeline;
        if (contactId && contactId !== 'all') {
            timeline = await sequelize.query(`
                SELECT 
                    DATE(viewedAt) as date,
                    COUNT(*) as views
                FROM contact_card_views
                WHERE contactId = :contactId
                    AND viewedAt >= :startDate 
                    AND viewedAt <= :endDate
                GROUP BY DATE(viewedAt)
                ORDER BY date ASC
            `, {
                replacements: { contactId: parseInt(contactId), startDate, endDate },
                type: sequelize.QueryTypes.SELECT
            });
        } else {
            timeline = await sequelize.query(`
                SELECT 
                    DATE(viewedAt) as date,
                    COUNT(*) as views
                FROM contact_card_views
                WHERE contactId IN (${contactIds.join(',')})
                    AND viewedAt >= :startDate 
                    AND viewedAt <= :endDate
                GROUP BY DATE(viewedAt)
                ORDER BY date ASC
            `, {
                replacements: { startDate, endDate },
                type: sequelize.QueryTypes.SELECT
            });
        }

        const result = {
            totalViews,
            totalClicks,
            uniqueVisitors,
            vcfDownloads, // ✅ Added
            clickBreakdown,
            clickSummary,
            geoDistribution: geoDistribution.map(g => ({
                country: g.country,
                countryCode: g.countryCode,
                count: parseInt(g.dataValues.count)
            })),
            deviceBreakdown: deviceBreakdown.map(d => ({
                deviceType: d.deviceType,
                count: parseInt(d.dataValues.count)
            })),
            browserBreakdown: browserBreakdown.map(b => ({ // ✅ Added
                browser: b.browser,
                count: parseInt(b.dataValues.count)
            })),
            topReferrers: topReferrers.map(r => ({ // ✅ Added
                referrer: r.referrer,
                count: parseInt(r.dataValues.count)
            })),
            peakHours, // ✅ Added
            timeline
        };

        res.json(result);
    } catch (error) {
        console.error('❌ Get dashboard error:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            message: 'Failed to fetch analytics',
            error: error.message
        });
    }
};

/**
 * Get contact-specific analytics
 * GET /api/analytics/contact/:contactId
 */
export const getContactAnalytics = async (req, res) => {
    try {
        const userId = req.user.id;
        const contactId = req.params.contactId;
        let { startDate, endDate } = req.query;

        const contact = await Contact.findOne({
            where: { id: contactId, userId }
        });

        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        if (!startDate || !endDate) {
            endDate = new Date();
            startDate = new Date();
            startDate.setDate(startDate.getDate() - 30);
        }

        const analytics = await getAnalyticsForContact(contactId, startDate, endDate);

        res.json(analytics);
    } catch (error) {
        console.error('❌ Get contact analytics error:', error);
        res.status(500).json({ message: 'Failed to fetch contact analytics' });
    }
};

/**
 * Helper: Update daily summary
 */
async function updateDailySummary(contactId, type, ipAddress) {
    try {
        const today = new Date().toISOString().split('T')[0];

        const [summary, created] = await AnalyticsSummary.findOrCreate({
            where: { contactId, date: today },
            defaults: {
                contactId,
                date: today,
                totalViews: 0,
                totalClicks: 0,
                uniqueVisitors: 0
            }
        });

        if (type === 'view') {
            await summary.increment('totalViews');

            const uniqueToday = await ContactCardView.count({
                where: {
                    contactId,
                    viewedAt: { [Op.gte]: new Date(today) }
                },
                distinct: true,
                col: 'ipAddress'
            });

            await summary.update({ uniqueVisitors: uniqueToday });
        } else if (type === 'click') {
            await summary.increment('totalClicks');
        }
    } catch (error) {
        console.error('❌ Update summary error:', error);
    }
}

/**
 * Helper: Get analytics for specific contact
 */
async function getAnalyticsForContact(contactId, startDate, endDate) {
    return {};
}
