import { useState } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Select,
  SelectItem,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip
} from '@heroui/react';
import { motion } from 'framer-motion';

import { useTranslation } from '@/lib/i18n-context';
import { useUsers } from '@/hooks/use-users';
import { useProducts } from '@/hooks/use-products';
import { useSettings } from '@/hooks/use-settings';
import type { User } from '@/stores/users-store';
import type { Product } from '@/stores/products-store';

/**
 * Demo dashboard component showcasing i18n and Zustand integration
 */
export function DemoDashboard() {
  const { t } = useTranslation();
  const { language, setLanguage } = useSettings();
  
  // Users management
  const {
    users,
    userStats,
    createUser,
    deleteUser,
    isLoading: usersLoading,
    error: usersError,
  } = useUsers();

  // Products management
  const {
    products,
    productStats,
    createProduct,
    deleteProduct,
    isLoading: productsLoading,
    error: productsError,
  } = useProducts();

  // Form states
  const [newUser, setNewUser] = useState<Partial<User>>({
    name: '',
    email: '',
    role: 'user',
    status: 'active',
  });

  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    category: '',
    stock: 0,
    sku: '',
    status: 'active',
  });

  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email) return;
    
    try {
      await createUser({
        name: newUser.name,
        email: newUser.email,
        role: newUser.role as User['role'],
        status: newUser.status as User['status'],
      });
      setNewUser({ name: '', email: '', role: 'user', status: 'active' });
    } catch (error) {
      console.error('Failed to create user:', error);
    }
  };

  const handleCreateProduct = async () => {
    if (!newProduct.name || !newProduct.price) return;
    
    try {
      await createProduct({
        name: newProduct.name!,
        description: newProduct.description || '',
        price: newProduct.price!,
        category: newProduct.category || 'General',
        stock: newProduct.stock || 0,
        sku: newProduct.sku || `SKU-${Date.now()}`,
        status: newProduct.status as Product['status'],
      });
      setNewProduct({
        name: '',
        description: '',
        price: 0,
        category: '',
        stock: 0,
        sku: '',
        status: 'active',
      });
    } catch (error) {
      console.error('Failed to create product:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'warning';
      case 'pending':
        return 'default';
      case 'out_of_stock':
        return 'danger';
      default:
        return 'default';
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center"
      >
        <h1 className="text-3xl font-bold">{t('common.dashboard')}</h1>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={language === 'vi' ? 'solid' : 'bordered'}
            onPress={() => setLanguage('vi')}
          >
            Tiếng Việt
          </Button>
          <Button
            size="sm"
            variant={language === 'en' ? 'solid' : 'bordered'}
            onPress={() => setLanguage('en')}
          >
            English
          </Button>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardBody>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-default-500">{t('stores.users.title')}</p>
                  <p className="text-2xl font-bold">{userStats.total}</p>
                </div>
                <div className="text-primary">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card>
            <CardBody>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-default-500">{t('stores.products.title')}</p>
                  <p className="text-2xl font-bold">{productStats.total}</p>
                </div>
                <div className="text-secondary">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <CardBody>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-default-500">{t('stores.users.status')} ({t('common.active' as any)})</p>
                  <p className="text-2xl font-bold">{userStats.active}</p>
                </div>
                <div className="text-success">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardBody>
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-default-500">{t('stores.products.stock')}</p>
                  <p className="text-2xl font-bold">{productStats.totalStock}</p>
                </div>
                <div className="text-warning">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M4 3a2 2 0 100 4h12a2 2 0 100-4H4z" />
                    <path fillRule="evenodd" d="M3 8h14v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8zm5 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </CardBody>
          </Card>
        </motion.div>
      </div>

      {/* Users Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">{t('stores.users.title')}</h2>
          </CardHeader>
          <CardBody>
            {/* Add User Form */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Input
                label={t('stores.users.name')}
                value={newUser.name || ''}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
              <Input
                label={t('stores.users.email')}
                type="email"
                value={newUser.email || ''}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
              <Select
                label={t('stores.users.role')}
                selectedKeys={[newUser.role || 'user']}
                onSelectionChange={(keys: any) => {
                  const role = Array.from(keys)[0] as User['role'];
                  setNewUser({ ...newUser, role });
                }}
              >
                <SelectItem key="user">User</SelectItem>
                <SelectItem key="admin">Admin</SelectItem>
                <SelectItem key="moderator">Moderator</SelectItem>
              </Select>
              <Button
                color="primary"
                onPress={handleCreateUser}
                isLoading={usersLoading}
                isDisabled={!newUser.name || !newUser.email}
              >
                {t('stores.users.addUser')}
              </Button>
            </div>

            {/* Users Table */}
            <Table aria-label={t('stores.users.title')}>
              <TableHeader>
                <TableColumn>{t('stores.users.name')}</TableColumn>
                <TableColumn>{t('stores.users.email')}</TableColumn>
                <TableColumn>{t('stores.users.role')}</TableColumn>
                <TableColumn>{t('stores.users.status')}</TableColumn>
                <TableColumn>{t('stores.users.actions')}</TableColumn>
              </TableHeader>
              <TableBody>
                {users.slice(0, 5).map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Chip size="sm" variant="flat">
                        {user.role}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <Chip size="sm" color={getStatusColor(user.status)}>
                        {user.status}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        color="danger"
                        variant="light"
                        onPress={() => deleteUser(user.id)}
                      >
                        {t('common.delete')}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </motion.div>

      {/* Products Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">{t('stores.products.title')}</h2>
          </CardHeader>
          <CardBody>
            {/* Add Product Form */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
              <Input
                label={t('stores.products.name')}
                value={newProduct.name || ''}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
              <Input
                label={t('stores.products.price')}
                type="number"
                value={newProduct.price?.toString() || ''}
                onChange={(e) => setNewProduct({ ...newProduct, price: Number(e.target.value) })}
              />
              <Input
                label={t('stores.products.category')}
                value={newProduct.category || ''}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
              />
              <Input
                label={t('stores.products.stock')}
                type="number"
                value={newProduct.stock?.toString() || ''}
                onChange={(e) => setNewProduct({ ...newProduct, stock: Number(e.target.value) })}
              />
              <Button
                color="primary"
                onPress={handleCreateProduct}
                isLoading={productsLoading}
                isDisabled={!newProduct.name || !newProduct.price}
              >
                {t('stores.products.addProduct')}
              </Button>
            </div>

            {/* Products Table */}
            <Table aria-label={t('stores.products.title')}>
              <TableHeader>
                <TableColumn>{t('stores.products.name')}</TableColumn>
                <TableColumn>{t('stores.products.price')}</TableColumn>
                <TableColumn>{t('stores.products.category')}</TableColumn>
                <TableColumn>{t('stores.products.stock')}</TableColumn>
                <TableColumn>{t('stores.products.actions')}</TableColumn>
              </TableHeader>
              <TableBody>
                {products.slice(0, 5).map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{product.price.toLocaleString()} VND</TableCell>
                    <TableCell>{product.category}</TableCell>
                    <TableCell>
                      <Chip size="sm" color={product.stock > 0 ? 'success' : 'danger'}>
                        {product.stock}
                      </Chip>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        color="danger"
                        variant="light"
                        onPress={() => deleteProduct(product.id)}
                      >
                        {t('common.delete')}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardBody>
        </Card>
      </motion.div>

      {/* Error Display */}
      {(usersError || productsError) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-danger-50 border border-danger-200 rounded-lg"
        >
          <p className="text-danger">{usersError || productsError}</p>
        </motion.div>
      )}
    </div>
  );
}
