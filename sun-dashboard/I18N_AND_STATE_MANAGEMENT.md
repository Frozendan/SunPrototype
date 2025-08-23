# Internationalization (i18n) and State Management System

This document describes the comprehensive i18n and Zustand state management system implemented for the React project.

## 🌍 Internationalization (i18n) System

### Overview
A custom, lightweight i18n system with Vietnamese as the default language and English support.

### Features
- ✅ Type-safe translation keys
- ✅ Vietnamese as default language
- ✅ English language support
- ✅ Browser language detection
- ✅ localStorage persistence
- ✅ Fallback to default language
- ✅ Context-based translation provider

### File Structure
```
src/
├── locales/
│   ├── vi.json          # Vietnamese translations (default)
│   └── en.json          # English translations
├── lib/
│   ├── i18n.ts          # Core i18n utilities
│   └── i18n-context.tsx # React context provider
├── types/
│   └── i18n.ts          # TypeScript type definitions
└── hooks/
    └── use-settings.ts  # Language management hooks
```

### Usage Examples

#### Basic Translation
```tsx
import { useTranslation } from '@/lib/i18n-context';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('common.home')}</h1>
      <p>{t('pages.home.title')}</p>
    </div>
  );
}
```

#### Language Switching
```tsx
import { useLanguage } from '@/hooks/use-settings';

function LanguageToggle() {
  const { language, setLanguage } = useLanguage();
  
  return (
    <button onClick={() => setLanguage(language === 'vi' ? 'en' : 'vi')}>
      Current: {language}
    </button>
  );
}
```

#### Language Switcher Component
```tsx
import { LanguageSwitcher } from '@/components/language-switcher';

// Use the pre-built component
<LanguageSwitcher />
```

### Translation Key Structure
```typescript
// Type-safe translation paths
type TranslationKeyPath = 
  | `common.${keyof TranslationKeys['common']}`
  | `pages.home.${keyof TranslationKeys['pages']['home']}`
  | `components.navbar.${keyof TranslationKeys['components']['navbar']}`
  // ... more paths
```

## 🗄️ Zustand State Management System

### Overview
Comprehensive state management using Zustand with persistence, CRUD operations, and TypeScript support.

### Features
- ✅ Persistent state with localStorage
- ✅ CRUD operations for demo data
- ✅ Loading and error states
- ✅ Type-safe store definitions
- ✅ Custom hooks for clean component code
- ✅ Optimized selectors for performance

### Store Architecture
```
src/
├── stores/
│   ├── settings-store.ts  # App settings (language, theme)
│   ├── users-store.ts     # Users CRUD operations
│   └── products-store.ts  # Products CRUD operations
├── hooks/
│   ├── use-settings.ts    # Settings management
│   ├── use-users.ts       # Users management
│   └── use-products.ts    # Products management
└── lib/
    └── store-utils.ts     # Shared utilities
```

### Store Examples

#### Settings Store
```tsx
import { useSettings } from '@/hooks/use-settings';

function SettingsPanel() {
  const { language, theme, setLanguage, setTheme } = useSettings();
  
  return (
    <div>
      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="vi">Tiếng Việt</option>
        <option value="en">English</option>
      </select>
    </div>
  );
}
```

#### Users Store with CRUD
```tsx
import { useUsers } from '@/hooks/use-users';

function UsersList() {
  const { 
    users, 
    createUser, 
    updateUser, 
    deleteUser, 
    isLoading,
    error 
  } = useUsers();
  
  const handleCreateUser = async () => {
    await createUser({
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
      status: 'active'
    });
  };
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      {users.map(user => (
        <div key={user.id}>
          {user.name} - {user.email}
          <button onClick={() => deleteUser(user.id)}>Delete</button>
        </div>
      ))}
      <button onClick={handleCreateUser}>Add User</button>
    </div>
  );
}
```

#### Products Store with Filtering
```tsx
import { useProducts } from '@/hooks/use-products';

function ProductsList() {
  const { 
    products, 
    productStats,
    setSearchQuery,
    setFilterCategory,
    clearFilters 
  } = useProducts();
  
  return (
    <div>
      <input 
        placeholder="Search products..."
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <select onChange={(e) => setFilterCategory(e.target.value)}>
        <option value="">All Categories</option>
        <option value="Electronics">Electronics</option>
        <option value="Fashion">Fashion</option>
      </select>
      
      <div>Total Products: {productStats.total}</div>
      <div>Total Stock: {productStats.totalStock}</div>
      
      {products.map(product => (
        <div key={product.id}>
          {product.name} - {product.price.toLocaleString()} VND
        </div>
      ))}
    </div>
  );
}
```

## 🎯 Demo Dashboard

A comprehensive example showcasing both i18n and state management:

```tsx
import { DemoDashboard } from '@/components/demo-dashboard';

// Visit /demo route to see the full implementation
```

### Demo Features
- ✅ Real-time language switching
- ✅ User management with CRUD operations
- ✅ Product management with filtering
- ✅ Statistics and data visualization
- ✅ Error handling and loading states
- ✅ Responsive design with Tailwind CSS
- ✅ Smooth animations with Framer Motion

## 🚀 Getting Started

### 1. Setup Provider
```tsx
// src/main.tsx
import { I18nProvider } from '@/lib/i18n-context';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <I18nProvider>
    <App />
  </I18nProvider>
);
```

### 2. Use in Components
```tsx
import { useTranslation } from '@/lib/i18n-context';
import { useUsers } from '@/hooks/use-users';

function MyComponent() {
  const { t } = useTranslation();
  const { users, createUser } = useUsers();
  
  return (
    <div>
      <h1>{t('common.dashboard')}</h1>
      {/* Your component logic */}
    </div>
  );
}
```

## 📝 Adding New Translations

### 1. Update Translation Files
```json
// src/locales/vi.json
{
  "newSection": {
    "newKey": "Văn bản tiếng Việt"
  }
}

// src/locales/en.json
{
  "newSection": {
    "newKey": "English text"
  }
}
```

### 2. Update Type Definitions
```typescript
// src/types/i18n.ts
export interface TranslationKeys {
  // ... existing keys
  newSection: {
    newKey: string;
  };
}

// Update TranslationKeyPath type
export type TranslationKeyPath = 
  // ... existing paths
  | `newSection.${keyof TranslationKeys['newSection']}`;
```

## 🔧 Creating New Stores

### 1. Define Store Interface
```typescript
// src/stores/my-store.ts
export interface MyItem {
  id: string;
  name: string;
  // ... other properties
}

export interface MyStore {
  items: MyItem[];
  isLoading: boolean;
  error: string | null;
  // ... actions
}
```

### 2. Create Custom Hook
```typescript
// src/hooks/use-my-store.ts
export function useMyStore() {
  const items = useMyStoreZustand(state => state.items);
  const createItem = useMyStoreZustand(state => state.createItem);
  // ... other selectors
  
  return { items, createItem };
}
```

## 🎨 Best Practices

### Translation Keys
- Use descriptive, hierarchical keys: `pages.dashboard.title`
- Group related translations: `common.*`, `components.*`
- Keep keys consistent across languages
- Use TypeScript for type safety

### State Management
- Use custom hooks to encapsulate store logic
- Implement optimized selectors for performance
- Handle loading and error states consistently
- Persist only necessary data

### Performance
- Use selective subscriptions with custom hooks
- Implement proper memoization for computed values
- Lazy load translation files if needed
- Optimize re-renders with proper selectors

## 🔍 Troubleshooting

### Common Issues
1. **Translation key not found**: Check if key exists in both language files
2. **Store not persisting**: Verify localStorage permissions
3. **Type errors**: Ensure TypeScript definitions are updated
4. **Performance issues**: Use selective subscriptions

### Debug Mode
```typescript
// Enable debug logging
localStorage.setItem('i18n-debug', 'true');
```

This system provides a solid foundation for internationalization and state management that can be easily extended and maintained as the application grows.
