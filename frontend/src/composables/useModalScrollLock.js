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

            // Hide ONLY the main page header (not elements inside modals)
            const selectors = [
                '.admin-header',
                'header:not(.modal-header)',
            ]

            selectors.forEach(selector => {
                const elements = document.querySelectorAll(selector)
                elements.forEach(el => {
                    // Skip if element is inside a modal
                    if (el.closest('.modal-container, .modal-overlay')) {
                        return
                    }

                    // Skip if it's a modal header or limit header
                    if (el.classList.contains('modal-header') ||
                        el.classList.contains('limit-header') ||
                        el.classList.contains('card-header')) {
                        return
                    }

                    el.style.setProperty('display', 'none', 'important')
                    el.setAttribute('data-modal-hidden', 'true')
                })
            })

            // Lock all scrollable containers (but not modal containers)
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

            // Show headers again
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
