import { ref, computed } from 'vue';
import api from '@/services/api.js';

export function useWalletAccess() {
    // ═══════════════════════════════════════════════════════════
    // STATE
    // ═══════════════════════════════════════════════════════════

    const walletAccess = ref({
        currentPlan: 'free',
        hasWalletAccess: false,
        planName: 'Free',
        features: {
            googleWallet: false,
            appleWallet: false,
            googleWalletLink: false,
            appleWalletFile: false
        }
    });

    const loading = ref(false);
    const error = ref(null);
    const lastCheckedAt = ref(null);

    // ═══════════════════════════════════════════════════════════
    // METHODS
    // ═══════════════════════════════════════════════════════════

    /**
     * Check wallet access status from the server
     * Fetches user's plan and available features
     */
    const checkWalletAccess = async () => {
        try {
            loading.value = true;
            error.value = null;

            const response = await api.get('/wallet/access-check', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            walletAccess.value = response.data;
            lastCheckedAt.value = new Date();

            console.log('[WALLET ACCESS CHECK]', {
                plan: response.data.currentPlan,
                hasAccess: response.data.hasWalletAccess,
                timestamp: lastCheckedAt.value
            });

            return response.data;

        } catch (err) {
            error.value = err.message;
            console.error("❌ Error checking wallet access:", err);

            // Set default state on error
            walletAccess.value = {
                currentPlan: 'free',
                hasWalletAccess: false,
                planName: 'Free',
                features: {
                    googleWallet: false,
                    appleWallet: false,
                    googleWalletLink: false,
                    appleWalletFile: false
                }
            };

            return null;

        } finally {
            loading.value = false;
        }
    };

    /**
     * Refresh wallet access status
     * Useful after plan changes or upgrades
     */
    const refreshAccess = async () => {
        return await checkWalletAccess();
    };

    /**
     * Check if specific feature is available
     */
    const hasFeature = (featureName) => {
        return walletAccess.value.features[featureName] || false;
    };

    /**
     * Get upgrade message for feature
     */
    const getUpgradeMessage = (feature) => {
        const messages = {
            googleWallet: 'Google Wallet is available on paid plans only.',
            appleWallet: 'Apple Wallet is available on paid plans only.',
            googleWalletLink: 'Google Wallet links are available on paid plans only.',
            appleWalletFile: 'Apple Wallet downloads are available on paid plans only.'
        };
        return messages[feature] || 'This feature is available on paid plans only.';
    };

    // ═══════════════════════════════════════════════════════════
    // COMPUTED PROPERTIES
    // ═══════════════════════════════════════════════════════════

    /**
     * Whether user can use Google Wallet feature
     */
    const canUseGoogleWallet = computed(() => {
        return walletAccess.value.features.googleWallet === true;
    });

    /**
     * Whether user can use Apple Wallet feature
     */
    const canUseAppleWallet = computed(() => {
        return walletAccess.value.features.appleWallet === true;
    });

    /**
     * Whether user can copy Google Wallet link
     */
    const canCopyGoogleLink = computed(() => {
        return walletAccess.value.features.googleWalletLink === true;
    });

    /**
     * Whether user can download Apple Wallet file
     */
    const canDownloadAppleFile = computed(() => {
        return walletAccess.value.features.appleWalletFile === true;
    });

    /**
     * User's current plan
     */
    const currentPlan = computed(() => {
        return walletAccess.value.currentPlan || 'free';
    });

    /**
     * User's plan name (capitalized)
     */
    const planName = computed(() => {
        return walletAccess.value.planName || 'Free';
    });

    /**
     * Whether user has any wallet access
     */
    const hasAnyWalletAccess = computed(() => {
        return walletAccess.value.hasWalletAccess === true;
    });

    /**
     * Whether user is on free plan
     */
    const isFreePlan = computed(() => {
        return currentPlan.value === 'free';
    });

    /**
     * Whether user is on paid plan
     */
    const isPaidPlan = computed(() => {
        return !isFreePlan.value;
    });

    /**
     * All available features (for admin/debugging)
     */
    const availableFeatures = computed(() => {
        return walletAccess.value.features;
    });

    // ═══════════════════════════════════════════════════════════
    // RETURN
    // ═══════════════════════════════════════════════════════════

    return {
        // State
        walletAccess,
        loading,
        error,
        lastCheckedAt,

        // Methods
        checkWalletAccess,
        refreshAccess,
        hasFeature,
        getUpgradeMessage,

        // Computed - Feature access
        canUseGoogleWallet,
        canUseAppleWallet,
        canCopyGoogleLink,
        canDownloadAppleFile,

        // Computed - Plan info
        currentPlan,
        planName,
        hasAnyWalletAccess,
        isFreePlan,
        isPaidPlan,
        availableFeatures
    };
}
