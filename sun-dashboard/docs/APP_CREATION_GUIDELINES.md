# App Creation Guidelines

This document provides comprehensive guidelines for creating new applications in the Sun Dashboard system. Follow these steps to ensure consistency and proper integration.

## 📋 Overview

When creating a new app, you need to update multiple components to ensure the app appears in both the app switcher and app shortcuts sections.

## 🎯 Required Updates

### 1. Translation Files

Add translations for both English and Vietnamese in the respective locale files.

#### File: `src/locales/en.json`
```json
{
  "apps": {
    "yourAppId": {
      "name": "Full App Name",
      "shortName": "Short",
      "description": "Brief description of the app functionality"
    }
  }
}
```

#### File: `src/locales/vi.json`
```json
{
  "apps": {
    "yourAppId": {
      "name": "Tên đầy đủ ứng dụng",
      "shortName": "Ngắn",
      "description": "Mô tả ngắn gọn về chức năng ứng dụng"
    }
  }
}
```

#### Naming Guidelines:
- **Full Name**: Complete, descriptive name (e.g., "Task Management", "Time Management")
- **Short Name**: 1-2 words maximum for shortcuts (e.g., "Tasks", "Time")
- **Description**: Brief explanation of app functionality

### 2. Type Definitions

#### File: `src/layouts/dashboard/types.ts`
```typescript
export type AppType = 'myDashboard' | 'news' | 'taskManagement' | 'timeManagement' | 'yourAppId';
```

### 3. App Switcher Component

#### File: `src/layouts/dashboard/components/app-switcher.tsx`

Add your app to the `apps` array:
```typescript
const apps: App[] = [
  // ... existing apps
  {
    id: "yourAppId",
    name: "apps.yourAppId.name",
    description: "apps.yourAppId.description",
    icon: "solar:your-icon-name",
    iconColor: "text-your-color-500",
    route: "/your-app/dashboard",
  },
];
```

Update the background color function:
```typescript
const getBackgroundColor = (iconColor: string) => {
  switch (iconColor) {
    // ... existing cases
    case "text-your-color-500":
      return "bg-your-color-100 hover:bg-your-color-200 dark:bg-your-color-900/30 dark:hover:bg-your-color-800/40";
    default:
      return "bg-default-100 hover:bg-default-200 dark:bg-default-800/30 dark:hover:bg-default-700/40";
  }
};
```

### 4. App Shortcuts Component

#### File: `src/components/app-shortcuts.tsx`

Add your app to the `apps` array:
```typescript
const apps: AppShortcut[] = [
  // ... existing apps
  {
    id: "yourAppId",
    name: t("apps.yourAppId.shortName"),
    fullName: t("apps.yourAppId.name"),
    icon: "solar:your-icon-name",
    iconColor: "text-your-color-500",
    route: "/your-app/dashboard",
    bgColor: "bg-your-color-100",
    darkBgColor: "dark:bg-your-color-900/40",
  },
];
```

### 5. Dashboard Layout

#### File: `src/layouts/dashboard/dashboard-layout.tsx`

Update the `getCurrentApp` function:
```typescript
const getCurrentApp = (): AppType => {
  const path = location.pathname;
  if (path === '/dashboard') return 'myDashboard';
  if (path.startsWith('/news')) return 'news';
  if (path.startsWith('/task-management')) return 'taskManagement';
  if (path.startsWith('/time-management')) return 'timeManagement';
  if (path.startsWith('/your-app')) return 'yourAppId';
  return 'myDashboard';
};
```

Update the `handleAppChange` function:
```typescript
const handleAppChange = (appId: AppType) => {
  const routes = {
    myDashboard: '/dashboard',
    news: '/news/dashboard',
    taskManagement: '/task-management/dashboard',
    timeManagement: '/time-management/dashboard',
    yourAppId: '/your-app/dashboard',
  };
  navigate(routes[appId]);
};
```

### 6. Sidebar Components

#### File: `src/layouts/dashboard/components/dashboard-sidebar.tsx`

Update the `getCurrentApp` function to match the dashboard layout.

#### File: `src/layouts/dashboard/components/sidebar-list-items.tsx`

Add navigation items for your app:
```typescript
const getAppNavigationItems = (t: (key: any) => string): AppNavigationItems => ({
  // ... existing apps
  yourAppId: [
    {
      key: "your-app-dashboard",
      href: "/your-app/dashboard",
      icon: "solar:home-2-linear",
      title: t('navigation.yourAppId.dashboard'),
    },
    {
      key: "your-feature",
      href: "/your-app/feature",
      icon: "solar:feature-icon",
      title: t('navigation.yourAppId.feature'),
    },
    // ... more navigation items
  ],
});
```

### 7. Route Configuration

#### File: `src/App.tsx`

Add routes for your app:
```typescript
{/* Your App Routes */}
<Route
  element={
    <ProtectedRoute>
      <YourAppDashboardPage />
    </ProtectedRoute>
  }
  path="/your-app/dashboard"
/>
```

## 🎨 Design Guidelines

### Color Scheme
Choose a unique color for your app from Tailwind's color palette:
- `text-red-500` / `bg-red-100` / `dark:bg-red-900/40`
- `text-yellow-500` / `bg-yellow-100` / `dark:bg-yellow-900/40`
- `text-indigo-500` / `bg-indigo-100` / `dark:bg-indigo-900/40`
- `text-pink-500` / `bg-pink-100` / `dark:bg-pink-900/40`

### Icon Selection
Use Solar Icons from Iconify:
- Choose bold variants for consistency: `solar:icon-name-bold`
- Ensure the icon represents your app's functionality
- Test the icon at 16px and 24px sizes

### Short Name Guidelines
- Maximum 8 characters recommended
- 1-2 words preferred
- Must be understandable in both languages
- Examples:
  - "Task Management" → "Tasks"
  - "Time Management" → "Time"
  - "User Management" → "Users"
  - "File Manager" → "Files"

## ✅ Checklist

Before submitting your new app, ensure:

- [ ] Translations added to both `en.json` and `vi.json`
- [ ] App type added to `types.ts`
- [ ] App added to app switcher component
- [ ] App added to app shortcuts component
- [ ] Background color function updated
- [ ] Dashboard layout functions updated
- [ ] Sidebar navigation items added
- [ ] Routes configured in `App.tsx`
- [ ] App page components created
- [ ] Icon displays correctly at all sizes
- [ ] Short name fits within button constraints
- [ ] Tooltips show full app name
- [ ] Navigation works in both directions
- [ ] Translations work in both languages
- [ ] Dark mode colors are appropriate

## 🔄 Testing

Test your new app by:
1. Switching to the app via app switcher
2. Switching to the app via app shortcuts
3. Navigating back to main dashboard
4. Testing in both English and Vietnamese
5. Testing in both light and dark modes
6. Verifying tooltips show full names
7. Checking responsive behavior on mobile

## 📝 Notes

- Always maintain alphabetical order in arrays where possible
- Use consistent naming conventions across all files
- Test thoroughly before committing changes
- Update this document if new requirements are discovered
