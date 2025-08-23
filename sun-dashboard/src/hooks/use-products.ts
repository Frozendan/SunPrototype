import { useCallback, useMemo } from 'react';
import { useProductsStore, productsSelectors } from '@/stores/products-store';
import type { Product } from '@/stores/products-store';

/**
 * Hook for managing products with full CRUD operations
 */
export function useProducts() {
  const products = useProductsStore(productsSelectors.products);
  const selectedProduct = useProductsStore(productsSelectors.selectedProduct);
  const searchQuery = useProductsStore(productsSelectors.searchQuery);
  const filterCategory = useProductsStore(productsSelectors.filterCategory);
  const filterStatus = useProductsStore(productsSelectors.filterStatus);
  const sortBy = useProductsStore(productsSelectors.sortBy);
  const sortOrder = useProductsStore(productsSelectors.sortOrder);
  const isLoading = useProductsStore(productsSelectors.isLoading);
  const error = useProductsStore(productsSelectors.error);
  
  const getAllProducts = useProductsStore((state) => state.getAllProducts);
  const getProductById = useProductsStore((state) => state.getProductById);
  const createProduct = useProductsStore((state) => state.createProduct);
  const updateProduct = useProductsStore((state) => state.updateProduct);
  const deleteProduct = useProductsStore((state) => state.deleteProduct);
  const setSelectedProduct = useProductsStore((state) => state.setSelectedProduct);
  const setSearchQuery = useProductsStore((state) => state.setSearchQuery);
  const setFilterCategory = useProductsStore((state) => state.setFilterCategory);
  const setFilterStatus = useProductsStore((state) => state.setFilterStatus);
  const setSortBy = useProductsStore((state) => state.setSortBy);
  const setSortOrder = useProductsStore((state) => state.setSortOrder);
  const clearFilters = useProductsStore((state) => state.clearFilters);
  const deleteMultipleProducts = useProductsStore((state) => state.deleteMultipleProducts);
  const updateMultipleProducts = useProductsStore((state) => state.updateMultipleProducts);
  const updateStock = useProductsStore((state) => state.updateStock);
  const clearError = useProductsStore((state) => state.clearError);

  // Filtered, searched, and sorted products
  const filteredProducts = useMemo(() => {
    let filtered = products;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.sku.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (filterCategory) {
      filtered = filtered.filter(product => product.category === filterCategory);
    }

    // Apply status filter
    if (filterStatus) {
      filtered = filtered.filter(product => product.status === filterStatus);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'price':
          aValue = a.price;
          bValue = b.price;
          break;
        case 'stock':
          aValue = a.stock;
          bValue = b.stock;
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [products, searchQuery, filterCategory, filterStatus, sortBy, sortOrder]);

  // Product statistics
  const productStats = useMemo(() => {
    const total = products.length;
    const active = products.filter(product => product.status === 'active').length;
    const inactive = products.filter(product => product.status === 'inactive').length;
    const outOfStock = products.filter(product => product.status === 'out_of_stock').length;
    const totalValue = products.reduce((sum, product) => sum + (product.price * product.stock), 0);
    const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
    const categories = [...new Set(products.map(product => product.category))];
    const lowStockProducts = products.filter(product => product.stock < 5 && product.stock > 0);

    return {
      total,
      active,
      inactive,
      outOfStock,
      totalValue,
      totalStock,
      categories: categories.length,
      lowStock: lowStockProducts.length,
      lowStockProducts,
    };
  }, [products]);

  // Available categories
  const categories = useMemo(() => {
    return [...new Set(products.map(product => product.category))];
  }, [products]);

  return {
    // State
    products: filteredProducts,
    allProducts: products,
    selectedProduct,
    searchQuery,
    filterCategory,
    filterStatus,
    sortBy,
    sortOrder,
    isLoading,
    error,
    productStats,
    categories,
    
    // Actions
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    setSelectedProduct,
    setSearchQuery,
    setFilterCategory,
    setFilterStatus,
    setSortBy,
    setSortOrder,
    clearFilters,
    deleteMultipleProducts,
    updateMultipleProducts,
    updateStock,
    clearError,
  };
}

/**
 * Hook for managing a single product
 */
export function useProduct(productId?: string) {
  const getProductById = useProductsStore((state) => state.getProductById);
  const updateProduct = useProductsStore((state) => state.updateProduct);
  const deleteProduct = useProductsStore((state) => state.deleteProduct);
  const updateStock = useProductsStore((state) => state.updateStock);
  
  const product = useMemo(() => {
    return productId ? getProductById(productId) : undefined;
  }, [productId, getProductById]);

  const update = useCallback(async (updates: Partial<Product>) => {
    if (!productId) throw new Error('Product ID is required');
    return await updateProduct(productId, updates);
  }, [productId, updateProduct]);

  const remove = useCallback(async () => {
    if (!productId) throw new Error('Product ID is required');
    return await deleteProduct(productId);
  }, [productId, deleteProduct]);

  const adjustStock = useCallback(async (quantity: number) => {
    if (!productId) throw new Error('Product ID is required');
    return await updateStock(productId, quantity);
  }, [productId, updateStock]);

  return {
    product,
    update,
    remove,
    adjustStock,
  };
}

/**
 * Hook for product selection management
 */
export function useProductSelection() {
  const selectedProduct = useProductsStore(productsSelectors.selectedProduct);
  const setSelectedProduct = useProductsStore((state) => state.setSelectedProduct);

  const selectProduct = useCallback((product: Product) => {
    setSelectedProduct(product);
  }, [setSelectedProduct]);

  const clearSelection = useCallback(() => {
    setSelectedProduct(null);
  }, [setSelectedProduct]);

  return {
    selectedProduct,
    selectProduct,
    clearSelection,
  };
}
