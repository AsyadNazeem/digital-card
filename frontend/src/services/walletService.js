// frontend/src/services/walletService.js

import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || '/api';

// ─────────────────────────────────────────────
// Check if Apple Wallet feature is available
// ─────────────────────────────────────────────
export const checkWalletStatus = async () => {
    try {
        const { data } = await axios.get(`${API_BASE}/wallet/status`);
        return data;
    } catch (error) {
        console.error('Wallet status check failed:', error);
        return { appleWallet: { configured: false } };
    }
};

// ─────────────────────────────────────────────
// Download Apple Wallet pass (.pkpass file)
// This triggers iPhone to open it in Wallet app
// ─────────────────────────────────────────────
export const downloadApplePass = async (userId) => {
    try {
        const response = await axios.get(`${API_BASE}/wallet/apple/${userId}`, {
            responseType: 'blob', // important — we're downloading a file
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        });

        // Create a temporary download link
        const blob = new Blob([response.data], {
            type: 'application/vnd.apple.pkpass',
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'card.pkpass';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        return { success: true };
    } catch (error) {
        console.error('Apple Wallet download failed:', error);

        // If backend returned JSON error (not a file), parse it
        if (error.response?.data instanceof Blob) {
            const text = await error.response.data.text();
            try {
                const json = JSON.parse(text);
                return { success: false, message: json.message };
            } catch {
                return { success: false, message: 'Failed to generate pass' };
            }
        }

        return { success: false, message: 'Something went wrong. Please try again.' };
    }
};

// ─────────────────────────────────────────────
// Detect if user is on an Apple device
// Only show Apple Wallet button to Apple users
// ─────────────────────────────────────────────
export const isAppleDevice = () => {
    return /iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent);
};
