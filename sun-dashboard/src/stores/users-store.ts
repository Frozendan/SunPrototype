import { create } from 'zustand';
import { StateCreator } from 'zustand';
import { 
  createPersistedStore, 
  BaseStore, 
  createBaseStoreSlice, 
  createCrudOperations,
  generateId 
} from '@/lib/store-utils';

/**
 * User interface
 */
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  status: 'active' | 'inactive' | 'pending';
  avatar?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Users store state
 */
export interface UsersState {
  users: User[];
  selectedUser: User | null;
  searchQuery: string;
  filterRole: string;
  filterStatus: string;
}

/**
 * Users store actions
 */
export interface UsersActions {
  // CRUD operations
  getAllUsers: () => User[];
  getUserById: (id: string) => User | undefined;
  createUser: (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => Promise<User>;
  updateUser: (id: string, updates: Partial<User>) => Promise<User>;
  deleteUser: (id: string) => Promise<void>;
  
  // UI state management
  setSelectedUser: (user: User | null) => void;
  setSearchQuery: (query: string) => void;
  setFilterRole: (role: string) => void;
  setFilterStatus: (status: string) => void;
  clearFilters: () => void;
  
  // Bulk operations
  deleteMultipleUsers: (ids: string[]) => Promise<void>;
  updateMultipleUsers: (ids: string[], updates: Partial<User>) => Promise<void>;
}

/**
 * Combined users store interface
 */
export interface UsersStore extends BaseStore, UsersState, UsersActions {}

/**
 * Demo users data
 */
const demoUsers: User[] = [
  {
    id: generateId(),
    name: 'Nguyễn Văn An',
    email: 'nguyen.van.an@example.com',
    role: 'admin',
    status: 'active',
    createdAt: new Date('2024-01-15').toISOString(),
    updatedAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: generateId(),
    name: 'Trần Thị Bình',
    email: 'tran.thi.binh@example.com',
    role: 'user',
    status: 'active',
    createdAt: new Date('2024-02-10').toISOString(),
    updatedAt: new Date('2024-02-10').toISOString(),
  },
  {
    id: generateId(),
    name: 'Lê Minh Cường',
    email: 'le.minh.cuong@example.com',
    role: 'moderator',
    status: 'inactive',
    createdAt: new Date('2024-03-05').toISOString(),
    updatedAt: new Date('2024-03-05').toISOString(),
  },
  {
    id: generateId(),
    name: 'Phạm Thu Dung',
    email: 'pham.thu.dung@example.com',
    role: 'user',
    status: 'pending',
    createdAt: new Date('2024-03-20').toISOString(),
    updatedAt: new Date('2024-03-20').toISOString(),
  },
];

/**
 * Users store creator
 */
const createUsersStore: StateCreator<
  UsersStore,
  [['zustand/immer', never]],
  [],
  UsersStore
> = (set, get) => {
  const crudOps = createCrudOperations<User>();
  
  return {
    // Base store
    ...createBaseStoreSlice(set, get, {} as any),
    
    // Users state
    users: demoUsers,
    selectedUser: null,
    searchQuery: '',
    filterRole: '',
    filterStatus: '',
    
    // CRUD operations
    getAllUsers: () => get().users,
    
    getUserById: (id: string) => 
      crudOps.getById(get().users, id),
    
    createUser: async (userData) => {
      const state = get();
      state.setLoading(true);
      state.clearError();
      
      try {
        const newUser = await crudOps.create(state.users, {
          ...userData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        
        set((draft) => {
          draft.users.push(newUser);
          draft.isLoading = false;
        });
        
        return newUser;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to create user';
        state.setError(errorMessage);
        throw error;
      }
    },
    
    updateUser: async (id: string, updates) => {
      const state = get();
      state.setLoading(true);
      state.clearError();
      
      try {
        const updatedUser = await crudOps.update(state.users, id, {
          ...updates,
          updatedAt: new Date().toISOString(),
        });
        
        set((draft) => {
          const index = draft.users.findIndex(user => user.id === id);
          if (index !== -1) {
            draft.users[index] = updatedUser;
          }
          draft.isLoading = false;
        });
        
        return updatedUser;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update user';
        state.setError(errorMessage);
        throw error;
      }
    },
    
    deleteUser: async (id: string) => {
      const state = get();
      state.setLoading(true);
      state.clearError();
      
      try {
        await crudOps.delete(state.users, id);
        
        set((draft) => {
          draft.users = draft.users.filter(user => user.id !== id);
          if (draft.selectedUser?.id === id) {
            draft.selectedUser = null;
          }
          draft.isLoading = false;
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete user';
        state.setError(errorMessage);
        throw error;
      }
    },
    
    // UI state management
    setSelectedUser: (user) =>
      set((state) => {
        state.selectedUser = user;
      }),
      
    setSearchQuery: (query) =>
      set((state) => {
        state.searchQuery = query;
      }),
      
    setFilterRole: (role) =>
      set((state) => {
        state.filterRole = role;
      }),
      
    setFilterStatus: (status) =>
      set((state) => {
        state.filterStatus = status;
      }),
      
    clearFilters: () =>
      set((state) => {
        state.searchQuery = '';
        state.filterRole = '';
        state.filterStatus = '';
      }),
    
    // Bulk operations
    deleteMultipleUsers: async (ids) => {
      const state = get();
      state.setLoading(true);
      state.clearError();
      
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        set((draft) => {
          draft.users = draft.users.filter(user => !ids.includes(user.id));
          if (draft.selectedUser && ids.includes(draft.selectedUser.id)) {
            draft.selectedUser = null;
          }
          draft.isLoading = false;
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete users';
        state.setError(errorMessage);
        throw error;
      }
    },
    
    updateMultipleUsers: async (ids, updates) => {
      const state = get();
      state.setLoading(true);
      state.clearError();
      
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        set((draft) => {
          draft.users = draft.users.map(user => 
            ids.includes(user.id) 
              ? { ...user, ...updates, updatedAt: new Date().toISOString() }
              : user
          );
          draft.isLoading = false;
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update users';
        state.setError(errorMessage);
        throw error;
      }
    },
  };
};

/**
 * Create the persisted users store
 */
export const useUsersStore = create<UsersStore>()(
  createPersistedStore(createUsersStore, {
    name: 'users-store',
    partialize: (state) => ({
      users: state.users,
    }),
  })
);

/**
 * Users store selectors for optimized re-renders
 */
export const usersSelectors = {
  users: (state: UsersStore) => state.users,
  selectedUser: (state: UsersStore) => state.selectedUser,
  searchQuery: (state: UsersStore) => state.searchQuery,
  filterRole: (state: UsersStore) => state.filterRole,
  filterStatus: (state: UsersStore) => state.filterStatus,
  isLoading: (state: UsersStore) => state.isLoading,
  error: (state: UsersStore) => state.error,
};
