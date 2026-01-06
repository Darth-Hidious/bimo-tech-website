/**
 * User Roles and Permissions System
 * 
 * Roles:
 * - admin: Full access to everything
 * - tech_manager: Manage products, services, settings
 * - writer: Manage news, careers content
 * - viewer: Read-only access
 */

export type UserRole = 'admin' | 'tech_manager' | 'writer' | 'viewer';

export type UserStatus = 'pending' | 'approved' | 'rejected';

export interface UserProfile {
    uid: string;
    email: string;
    displayName: string;
    role: UserRole;
    status: UserStatus;
    createdAt: number;
    lastLoginAt: number;
    createdBy?: string;
    approvedBy?: string;
    approvedAt?: number;
}

export interface ActivityLogEntry {
    id?: string;
    userId: string;
    userEmail: string;
    action: ActivityAction;
    resourceType: ResourceType;
    resourceId?: string;
    resourceName?: string;
    timestamp: number;
    metadata?: Record<string, unknown>;
}

export type ActivityAction =
    | 'create'
    | 'update'
    | 'delete'
    | 'view'
    | 'login'
    | 'logout';

export type ResourceType =
    | 'product'
    | 'service'
    | 'news'
    | 'career'
    | 'contact'
    | 'quote'
    | 'user'
    | 'settings'
    | 'session';

// Role permissions matrix
export const rolePermissions: Record<UserRole, {
    canManageProducts: boolean;
    canManageServices: boolean;
    canManageNews: boolean;
    canManageCareers: boolean;
    canViewContacts: boolean;
    canManageQuotes: boolean;
    canManageUsers: boolean;
    canViewActivityLog: boolean;
    canManageSettings: boolean;
}> = {
    admin: {
        canManageProducts: true,
        canManageServices: true,
        canManageNews: true,
        canManageCareers: true,
        canViewContacts: true,
        canManageQuotes: true,
        canManageUsers: true,
        canViewActivityLog: true,
        canManageSettings: true,
    },
    tech_manager: {
        canManageProducts: true,
        canManageServices: true,
        canManageNews: false,
        canManageCareers: false,
        canViewContacts: true,
        canManageQuotes: true,
        canManageUsers: false,
        canViewActivityLog: true,
        canManageSettings: true,
    },
    writer: {
        canManageProducts: false,
        canManageServices: false,
        canManageNews: true,
        canManageCareers: true,
        canViewContacts: false,
        canManageQuotes: false,
        canManageUsers: false,
        canViewActivityLog: false,
        canManageSettings: false,
    },
    viewer: {
        canManageProducts: false,
        canManageServices: false,
        canManageNews: false,
        canManageCareers: false,
        canViewContacts: false,
        canManageQuotes: false,
        canManageUsers: false,
        canViewActivityLog: false,
        canManageSettings: false,
    },
};

export function hasPermission(role: UserRole, permission: keyof typeof rolePermissions.admin): boolean {
    return rolePermissions[role]?.[permission] ?? false;
}

export function getRoleLabel(role: UserRole): string {
    const labels: Record<UserRole, string> = {
        admin: 'Administrator',
        tech_manager: 'Technology Manager',
        writer: 'Content Writer',
        viewer: 'Viewer',
    };
    return labels[role] || role;
}
