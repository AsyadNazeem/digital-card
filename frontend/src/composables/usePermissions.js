import { computed } from 'vue'
import { useAdminStore } from '../store/adminStore'

export function usePermissions() {
    const adminStore = useAdminStore()

    const role = computed(() => adminStore.adminRole)
    const isSuperAdmin = computed(() => adminStore.isSuperAdmin)

    const can = (permission) => {
        // Super admin always has all permissions
        if (isSuperAdmin.value) {
            return true
        }

        // Check from loaded permissions
        return adminStore.myPermissions.includes(permission)
    }

    const canAll = (permissions) => {
        if (isSuperAdmin.value) {
            return true
        }
        return permissions.every(permission => adminStore.myPermissions.includes(permission))
    }

    const canAny = (permissions) => {
        if (isSuperAdmin.value) {
            return true
        }
        return permissions.some(permission => adminStore.myPermissions.includes(permission))
    }

    return {
        can,
        canAll,
        canAny,
        isSuperAdmin,
        role
    }
}
