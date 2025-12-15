// frontend/src/composables/useModalScrollLock.js
import { watch, onUnmounted } from 'vue'

let activeModals = 0
let scrollPosition = 0

export function useModalScrollLock(isOpen) {
    const lockScroll = () => {
        activeModals++
        if (activeModals === 1) {
            // Store current scroll position
            scrollPosition = window.pageYOffset || document.documentElement.scrollTop

            // Lock body
            document.body.style.overflow = 'hidden'
            document.body.style.position = 'fixed'
            document.body.style.top = `-${scrollPosition}px`
            document.body.style.width = '100%'
            document.body.style.left = '0'
            document.body.style.right = '0'
            document.body.classList.add('modal-open')

            // Hide ONLY the admin sidebar (not any headers or dropdown content)
            const selectors = [
                '.admin-sidebar',
                '.admin-nav',
            ]

            selectors.forEach(selector => {
                const elements = document.querySelectorAll(selector)
                elements.forEach(el => {
                    // Skip if element is inside a modal or dropdown
                    if (el.closest('.modal-container, .modal-overlay, .notifications-dropdown, .notification-wrapper')) {
                        return
                    }

                    el.style.setProperty('display', 'none', 'important')
                    el.setAttribute('data-modal-hidden', 'true')
                })
            })

            // Lock scrollable containers on mobile only
            if (window.innerWidth <= 480) {
                const adminMain = document.querySelector('.admin-main')
                const adminContent = document.querySelector('.admin-content')

                if (adminMain) {
                    adminMain.style.overflow = 'hidden'
                }

                if (adminContent) {
                    adminContent.style.overflow = 'hidden'
                }
            }
        }
    }

    const unlockScroll = () => {
        activeModals = Math.max(0, activeModals - 1)
        if (activeModals === 0) {
            // Restore body
            document.body.style.overflow = ''
            document.body.style.position = ''
            document.body.style.top = ''
            document.body.style.width = ''
            document.body.style.left = ''
            document.body.style.right = ''
            document.body.classList.remove('modal-open')

            // Show hidden elements again
            const hiddenElements = document.querySelectorAll('[data-modal-hidden="true"]')
            hiddenElements.forEach(el => {
                el.style.display = ''
                el.removeAttribute('data-modal-hidden')
            })

            // Restore scrollable containers
            const adminMain = document.querySelector('.admin-main')
            const adminContent = document.querySelector('.admin-content')

            if (adminMain) {
                adminMain.style.overflow = ''
            }

            if (adminContent) {
                adminContent.style.overflow = ''
            }

            // Restore scroll position
            window.scrollTo(0, scrollPosition)
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

    return {
        lockScroll,
        unlockScroll
    }
}




