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
 * Product interface
 */
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image?: string;
  sku: string;
  status: 'active' | 'inactive' | 'out_of_stock';
  createdAt: string;
  updatedAt: string;
}

/**
 * Products store state
 */
export interface ProductsState {
  products: Product[];
  selectedProduct: Product | null;
  searchQuery: string;
  filterCategory: string;
  filterStatus: string;
  sortBy: 'name' | 'price' | 'stock' | 'createdAt';
  sortOrder: 'asc' | 'desc';
}

/**
 * Products store actions
 */
export interface ProductsActions {
  // CRUD operations
  getAllProducts: () => Product[];
  getProductById: (id: string) => Product | undefined;
  createProduct: (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => Promise<Product>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;
  
  // UI state management
  setSelectedProduct: (product: Product | null) => void;
  setSearchQuery: (query: string) => void;
  setFilterCategory: (category: string) => void;
  setFilterStatus: (status: string) => void;
  setSortBy: (sortBy: ProductsState['sortBy']) => void;
  setSortOrder: (order: ProductsState['sortOrder']) => void;
  clearFilters: () => void;
  
  // Bulk operations
  deleteMultipleProducts: (ids: string[]) => Promise<void>;
  updateMultipleProducts: (ids: string[], updates: Partial<Product>) => Promise<void>;
  updateStock: (id: string, quantity: number) => Promise<void>;
}

/**
 * Combined products store interface
 */
export interface ProductsStore extends BaseStore, ProductsState, ProductsActions {}

/**
 * Demo products data
 */
const demoProducts: Product[] = [
  {
    id: generateId(),
    name: 'Laptop Dell XPS 13',
    description: 'Laptop cao cấp với thiết kế mỏng nhẹ và hiệu năng mạnh mẽ',
    price: 25000000,
    category: 'Electronics',
    stock: 15,
    sku: 'DELL-XPS13-001',
    status: 'active',
    createdAt: new Date('2024-01-10').toISOString(),
    updatedAt: new Date('2024-01-10').toISOString(),
  },
  {
    id: generateId(),
    name: 'iPhone 15 Pro',
    description: 'Điện thoại thông minh cao cấp với camera chuyên nghiệp',
    price: 30000000,
    category: 'Electronics',
    stock: 8,
    sku: 'APPLE-IP15P-001',
    status: 'active',
    createdAt: new Date('2024-02-05').toISOString(),
    updatedAt: new Date('2024-02-05').toISOString(),
  },
  {
    id: generateId(),
    name: 'Áo thun cotton',
    description: 'Áo thun cotton 100% thoáng mát, phù hợp cho mùa hè',
    price: 250000,
    category: 'Fashion',
    stock: 0,
    sku: 'FASHION-TS-001',
    status: 'out_of_stock',
    createdAt: new Date('2024-03-01').toISOString(),
    updatedAt: new Date('2024-03-01').toISOString(),
  },
  {
    id: generateId(),
    name: 'Sách lập trình React',
    description: 'Hướng dẫn chi tiết về React và các công nghệ liên quan',
    price: 450000,
    category: 'Books',
    stock: 25,
    sku: 'BOOK-REACT-001',
    status: 'active',
    createdAt: new Date('2024-03-15').toISOString(),
    updatedAt: new Date('2024-03-15').toISOString(),
  },
];

/**
 * Products store creator
 */
const createProductsStore: StateCreator<
  ProductsStore,
  [['zustand/immer', never]],
  [],
  ProductsStore
> = (set, get) => {
  const crudOps = createCrudOperations<Product>();
  
  return {
    // Base store
    ...createBaseStoreSlice(set, get, {} as any),
    
    // Products state
    products: demoProducts,
    selectedProduct: null,
    searchQuery: '',
    filterCategory: '',
    filterStatus: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    
    // CRUD operations
    getAllProducts: () => get().products,
    
    getProductById: (id: string) => 
      crudOps.getById(get().products, id),
    
    createProduct: async (productData) => {
      const state = get();
      state.setLoading(true);
      state.clearError();
      
      try {
        const newProduct = await crudOps.create(state.products, {
          ...productData,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
        
        set((draft) => {
          draft.products.push(newProduct);
          draft.isLoading = false;
        });
        
        return newProduct;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to create product';
        state.setError(errorMessage);
        throw error;
      }
    },
    
    updateProduct: async (id: string, updates) => {
      const state = get();
      state.setLoading(true);
      state.clearError();
      
      try {
        const updatedProduct = await crudOps.update(state.products, id, {
          ...updates,
          updatedAt: new Date().toISOString(),
        });
        
        set((draft) => {
          const index = draft.products.findIndex(product => product.id === id);
          if (index !== -1) {
            draft.products[index] = updatedProduct;
          }
          draft.isLoading = false;
        });
        
        return updatedProduct;
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update product';
        state.setError(errorMessage);
        throw error;
      }
    },
    
    deleteProduct: async (id: string) => {
      const state = get();
      state.setLoading(true);
      state.clearError();
      
      try {
        await crudOps.delete(state.products, id);
        
        set((draft) => {
          draft.products = draft.products.filter(product => product.id !== id);
          if (draft.selectedProduct?.id === id) {
            draft.selectedProduct = null;
          }
          draft.isLoading = false;
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete product';
        state.setError(errorMessage);
        throw error;
      }
    },
    
    // UI state management
    setSelectedProduct: (product) =>
      set((state) => {
        state.selectedProduct = product;
      }),
      
    setSearchQuery: (query) =>
      set((state) => {
        state.searchQuery = query;
      }),
      
    setFilterCategory: (category) =>
      set((state) => {
        state.filterCategory = category;
      }),
      
    setFilterStatus: (status) =>
      set((state) => {
        state.filterStatus = status;
      }),
      
    setSortBy: (sortBy) =>
      set((state) => {
        state.sortBy = sortBy;
      }),
      
    setSortOrder: (order) =>
      set((state) => {
        state.sortOrder = order;
      }),
      
    clearFilters: () =>
      set((state) => {
        state.searchQuery = '';
        state.filterCategory = '';
        state.filterStatus = '';
        state.sortBy = 'createdAt';
        state.sortOrder = 'desc';
      }),
    
    // Bulk operations
    deleteMultipleProducts: async (ids) => {
      const state = get();
      state.setLoading(true);
      state.clearError();
      
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        set((draft) => {
          draft.products = draft.products.filter(product => !ids.includes(product.id));
          if (draft.selectedProduct && ids.includes(draft.selectedProduct.id)) {
            draft.selectedProduct = null;
          }
          draft.isLoading = false;
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete products';
        state.setError(errorMessage);
        throw error;
      }
    },
    
    updateMultipleProducts: async (ids, updates) => {
      const state = get();
      state.setLoading(true);
      state.clearError();
      
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));
        
        set((draft) => {
          draft.products = draft.products.map(product => 
            ids.includes(product.id) 
              ? { ...product, ...updates, updatedAt: new Date().toISOString() }
              : product
          );
          draft.isLoading = false;
        });
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to update products';
        state.setError(errorMessage);
        throw error;
      }
    },
    
    updateStock: async (id: string, quantity: number) => {
      const state = get();
      const product = state.getProductById(id);
      
      if (!product) {
        throw new Error('Product not found');
      }
      
      const newStock = Math.max(0, product.stock + quantity);
      const status = newStock === 0 ? 'out_of_stock' : 'active';
      
      await state.updateProduct(id, { stock: newStock, status });
    },
  };
};

/**
 * Create the persisted products store
 */
export const useProductsStore = create<ProductsStore>()(
  createPersistedStore(createProductsStore, {
    name: 'products-store',
    partialize: (state) => ({
      products: state.products,
    }),
  })
);

/**
 * Products store selectors for optimized re-renders
 */
export const productsSelectors = {
  products: (state: ProductsStore) => state.products,
  selectedProduct: (state: ProductsStore) => state.selectedProduct,
  searchQuery: (state: ProductsStore) => state.searchQuery,
  filterCategory: (state: ProductsStore) => state.filterCategory,
  filterStatus: (state: ProductsStore) => state.filterStatus,
  sortBy: (state: ProductsStore) => state.sortBy,
  sortOrder: (state: ProductsStore) => state.sortOrder,
  isLoading: (state: ProductsStore) => state.isLoading,
  error: (state: ProductsStore) => state.error,
};
