// Translation types for type-safe i18n
export type Language = 'vi' | 'en';

export interface TranslationKeys {
  common: {
    home: string;
    docs: string;
    pricing: string;
    blog: string;
    about: string;
    profile: string;
    dashboard: string;
    projects: string;
    team: string;
    calendar: string;
    settings: string;
    help: string;
    logout: string;
    search: string;
    sponsor: string;
    documentation: string;
    github: string;
    language: string;
    theme: string;
    loading: string;
    error: string;
    success: string;
    cancel: string;
    save: string;
    delete: string;
    edit: string;
    add: string;
    create: string;
    update: string;
    confirm: string;
    yes: string;
    no: string;
    active: string;
  };
  pages: {
    home: {
      title: string;
      subtitle: string;
      getStarted: string;
      poweredBy: string;
    };
    docs: {
      title: string;
      description: string;
    };
    pricing: {
      title: string;
      description: string;
    };
    blog: {
      title: string;
      description: string;
    };
    about: {
      title: string;
      description: string;
    };
  };
  components: {
    navbar: {
      searchPlaceholder: string;
      searchShortcut: string;
    };
    languageSwitcher: {
      selectLanguage: string;
      vietnamese: string;
      english: string;
    };
    themeSwitch: {
      light: string;
      dark: string;
      system: string;
    };
  };
  stores: {
    users: {
      title: string;
      name: string;
      email: string;
      role: string;
      status: string;
      createdAt: string;
      actions: string;
      addUser: string;
      editUser: string;
      deleteUser: string;
      confirmDelete: string;
      userCreated: string;
      userUpdated: string;
      userDeleted: string;
    };
    products: {
      title: string;
      name: string;
      price: string;
      category: string;
      stock: string;
      description: string;
      actions: string;
      addProduct: string;
      editProduct: string;
      deleteProduct: string;
      confirmDelete: string;
      productCreated: string;
      productUpdated: string;
      productDeleted: string;
    };
  };
}

// Helper type for nested key paths
export type TranslationKeyPath = 
  | `common.${keyof TranslationKeys['common']}`
  | `pages.home.${keyof TranslationKeys['pages']['home']}`
  | `pages.docs.${keyof TranslationKeys['pages']['docs']}`
  | `pages.pricing.${keyof TranslationKeys['pages']['pricing']}`
  | `pages.blog.${keyof TranslationKeys['pages']['blog']}`
  | `pages.about.${keyof TranslationKeys['pages']['about']}`
  | `components.navbar.${keyof TranslationKeys['components']['navbar']}`
  | `components.languageSwitcher.${keyof TranslationKeys['components']['languageSwitcher']}`
  | `components.themeSwitch.${keyof TranslationKeys['components']['themeSwitch']}`
  | `stores.users.${keyof TranslationKeys['stores']['users']}`
  | `stores.products.${keyof TranslationKeys['stores']['products']}`;

export interface I18nContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKeyPath) => string;
  translations: TranslationKeys;
}
