// frontend/src/composables/useSidebar.js
import { ref, computed, watch } from 'vue'

// Shared reactive state
const isCollapsed = ref(false)
const isMobile = ref(false)

export function useSidebar() {
    // Check if viewport is mobile
    const checkMobile = () => {
        const width = window.innerWidth
        isMobile.value = width <= 768

        // Auto-collapse on tablets
        if (width > 768 && width <= 1024) {
            isCollapsed.value = true
        } else if (width > 1024) {
            // Load saved preference for desktop
            const savedState = localStorage.getItem('sidebarCollapsed')
            if (savedState !== null) {
                isCollapsed.value = savedState === 'true'
            }
        } else {
            // Mobile - always expanded when shown
            isCollapsed.value = false
        }
    }

    // Toggle sidebar collapse state
    const toggleSidebar = () => {
        isCollapsed.value = !isCollapsed.value
        localStorage.setItem('sidebarCollapsed', isCollapsed.value.toString())
    }

    // Get sidebar width for layout calculations
    const sidebarWidth = computed(() => {
        if (isMobile.value) return 0
        return isCollapsed.value ? 80 : 260
    })

    // Initialize
    const initialize = () => {
        checkMobile()
        window.addEventListener('resize', checkMobile)
    }

    // Cleanup
    const cleanup = () => {
        window.removeEventListener('resize', checkMobile)
    }

    // Watch for changes to persist
    watch(isCollapsed, (newVal) => {
        if (!isMobile.value) {
            localStorage.setItem('sidebarCollapsed', newVal.toString())
        }
    })

    return {
        isCollapsed,
        isMobile,
        sidebarWidth,
        toggleSidebar,
        checkMobile,
        initialize,
        cleanup
    }
}
