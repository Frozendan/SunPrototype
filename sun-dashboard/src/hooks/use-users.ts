import { useCallback, useMemo } from 'react';
import { useUsersStore, usersSelectors } from '@/stores/users-store';
import type { User } from '@/stores/users-store';

/**
 * Hook for managing users with full CRUD operations
 */
export function useUsers() {
  const users = useUsersStore(usersSelectors.users);
  const selectedUser = useUsersStore(usersSelectors.selectedUser);
  const searchQuery = useUsersStore(usersSelectors.searchQuery);
  const filterRole = useUsersStore(usersSelectors.filterRole);
  const filterStatus = useUsersStore(usersSelectors.filterStatus);
  const isLoading = useUsersStore(usersSelectors.isLoading);
  const error = useUsersStore(usersSelectors.error);
  
  const getAllUsers = useUsersStore((state) => state.getAllUsers);
  const getUserById = useUsersStore((state) => state.getUserById);
  const createUser = useUsersStore((state) => state.createUser);
  const updateUser = useUsersStore((state) => state.updateUser);
  const deleteUser = useUsersStore((state) => state.deleteUser);
  const setSelectedUser = useUsersStore((state) => state.setSelectedUser);
  const setSearchQuery = useUsersStore((state) => state.setSearchQuery);
  const setFilterRole = useUsersStore((state) => state.setFilterRole);
  const setFilterStatus = useUsersStore((state) => state.setFilterStatus);
  const clearFilters = useUsersStore((state) => state.clearFilters);
  const deleteMultipleUsers = useUsersStore((state) => state.deleteMultipleUsers);
  const updateMultipleUsers = useUsersStore((state) => state.updateMultipleUsers);
  const clearError = useUsersStore((state) => state.clearError);

  // Filtered and searched users
  const filteredUsers = useMemo(() => {
    let filtered = users;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(user => 
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query)
      );
    }

    // Apply role filter
    if (filterRole) {
      filtered = filtered.filter(user => user.role === filterRole);
    }

    // Apply status filter
    if (filterStatus) {
      filtered = filtered.filter(user => user.status === filterStatus);
    }

    return filtered;
  }, [users, searchQuery, filterRole, filterStatus]);

  // User statistics
  const userStats = useMemo(() => {
    const total = users.length;
    const active = users.filter(user => user.status === 'active').length;
    const inactive = users.filter(user => user.status === 'inactive').length;
    const pending = users.filter(user => user.status === 'pending').length;
    const admins = users.filter(user => user.role === 'admin').length;
    const moderators = users.filter(user => user.role === 'moderator').length;
    const regularUsers = users.filter(user => user.role === 'user').length;

    return {
      total,
      active,
      inactive,
      pending,
      admins,
      moderators,
      regularUsers,
    };
  }, [users]);

  return {
    // State
    users: filteredUsers,
    allUsers: users,
    selectedUser,
    searchQuery,
    filterRole,
    filterStatus,
    isLoading,
    error,
    userStats,
    
    // Actions
    getAllUsers,
    getUserById,
    createUser,
    updateUser,
    deleteUser,
    setSelectedUser,
    setSearchQuery,
    setFilterRole,
    setFilterStatus,
    clearFilters,
    deleteMultipleUsers,
    updateMultipleUsers,
    clearError,
  };
}

/**
 * Hook for managing a single user
 */
export function useUser(userId?: string) {
  const getUserById = useUsersStore((state) => state.getUserById);
  const updateUser = useUsersStore((state) => state.updateUser);
  const deleteUser = useUsersStore((state) => state.deleteUser);
  
  const user = useMemo(() => {
    return userId ? getUserById(userId) : undefined;
  }, [userId, getUserById]);

  const update = useCallback(async (updates: Partial<User>) => {
    if (!userId) throw new Error('User ID is required');
    return await updateUser(userId, updates);
  }, [userId, updateUser]);

  const remove = useCallback(async () => {
    if (!userId) throw new Error('User ID is required');
    return await deleteUser(userId);
  }, [userId, deleteUser]);

  return {
    user,
    update,
    remove,
  };
}

/**
 * Hook for user selection management
 */
export function useUserSelection() {
  const selectedUser = useUsersStore(usersSelectors.selectedUser);
  const setSelectedUser = useUsersStore((state) => state.setSelectedUser);

  const selectUser = useCallback((user: User) => {
    setSelectedUser(user);
  }, [setSelectedUser]);

  const clearSelection = useCallback(() => {
    setSelectedUser(null);
  }, [setSelectedUser]);

  return {
    selectedUser,
    selectUser,
    clearSelection,
  };
}
