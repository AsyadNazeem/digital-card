// composables/useAlert.js
// Provides a simple programmatic API for AlertModal.
//
// Usage in any component:
//   import { useAlert } from '@/composables/useAlert.js'
//   const { alertState, showAlert, showConfirm } = useAlert()
//
// In template:
//   <AlertModal v-bind="alertState" @confirm="alertState.onConfirm" @cancel="alertState.onCancel" />

import { reactive } from 'vue'

export function useAlert() {
    const alertState = reactive({
        show:         false,
        type:         'info',        // 'success' | 'error' | 'danger' | 'warning' | 'confirm' | 'info'
        title:        '',
        message:      '',
        confirmLabel: 'OK',
        cancelLabel:  'Cancel',
        showCancel:   false,
        closeOnOverlay: true,
        onConfirm:    () => {},
        onCancel:     () => {}
    })

    /**
     * Simple notification (one button).
     * Returns a Promise that resolves when the user clicks OK.
     */
    function showAlert({ type = 'info', title, message, confirmLabel = 'OK' } = {}) {
        return new Promise((resolve) => {
            Object.assign(alertState, {
                show: true, type, title, message,
                confirmLabel, cancelLabel: 'Cancel',
                showCancel: false, closeOnOverlay: true,
                onConfirm: () => { alertState.show = false; resolve(true) },
                onCancel:  () => { alertState.show = false; resolve(false) }
            })
        })
    }

    /**
     * Confirmation dialog (two buttons).
     * Returns a Promise that resolves to true (confirm) or false (cancel).
     */
    function showConfirm({
                             type = 'warning',
                             title = 'Are you sure?',
                             message = '',
                             confirmLabel = 'Confirm',
                             cancelLabel = 'Cancel',
                             closeOnOverlay = false
                         } = {}) {
        return new Promise((resolve) => {
            Object.assign(alertState, {
                show: true, type, title, message,
                confirmLabel, cancelLabel,
                showCancel: true, closeOnOverlay,
                onConfirm: () => { alertState.show = false; resolve(true) },
                onCancel:  () => { alertState.show = false; resolve(false) }
            })
        })
    }

    return { alertState, showAlert, showConfirm }
}
