// frontend/src/composables/useModalScrollLock.js
import { watch, onUnmounted } from 'vue'

let activeModals = 0
let scrollPosition = 0

export function useModalScrollLock(isOpen) {
    const lockScroll = () => {
        activeModals++
        if (activeModals === 1) {
            scrollPosition = window.pageYOffset || document.documentElement.scrollTop

            // Store scroll position
            document.body.setAttribute('data-scroll-position', scrollPosition)

            // Prevent scrolling without changing positioning
            document.body.style.overflow = 'hidden'
            document.body.style.position = 'relative' // Keep in normal flow

            // Calculate and apply scrollbar width compensation
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
            if (scrollbarWidth > 0) {
                document.body.style.paddingRight = `${scrollbarWidth}px`
            }

            document.body.classList.add('modal-open')
        }
    }

    const unlockScroll = () => {
        activeModals = Math.max(0, activeModals - 1)
        if (activeModals === 0) {
            const savedPosition = parseInt(document.body.getAttribute('data-scroll-position') || '0')

            // Remove all styles
            document.body.style.overflow = ''
            document.body.style.position = ''
            document.body.style.paddingRight = ''
            document.body.classList.remove('modal-open')
            document.body.removeAttribute('data-scroll-position')

            // Restore scroll position
            window.scrollTo(0, savedPosition)
        }
    }

    watch(
        isOpen,
        (newValue) => {
            if (newValue) {
                // Use setTimeout to ensure DOM is ready
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
