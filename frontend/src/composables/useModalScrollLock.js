// frontend/src/composables/useModalScrollLock.js
import { watch, onUnmounted } from 'vue'

let activeModals = 0
let scrollPosition = 0

export function useModalScrollLock(isOpen) {
    const lockScroll = () => {
        activeModals++
        if (activeModals === 1) {
            scrollPosition = window.pageYOffset || document.documentElement.scrollTop

            document.body.style.overflow = 'hidden'
            document.body.style.position = 'fixed'
            document.body.style.top = `-${scrollPosition}px`
            document.body.style.width = '100%'
            document.body.style.left = '0'
            document.body.style.right = '0'
            document.body.classList.add('modal-open')

            // REMOVED: Don't hide any navigation elements
            // This was causing the flash issue
        }
    }

    const unlockScroll = () => {
        activeModals = Math.max(0, activeModals - 1)
        if (activeModals === 0) {
            document.body.style.overflow = ''
            document.body.style.position = ''
            document.body.style.top = ''
            document.body.style.width = ''
            document.body.style.left = ''
            document.body.style.right = ''
            document.body.classList.remove('modal-open')

            window.scrollTo(0, scrollPosition)
        }
    }

    watch(
        isOpen,
        (newValue) => {
            if (newValue) {
                setTimeout(lockScroll, 0)
            } else {
                unlockScroll()
            }
        },
        { immediate: true }
    )

    onUnmounted(() => {
        if (activeModals > 0) {
            unlockScroll()
        }
    })

    return { lockScroll, unlockScroll }
}
