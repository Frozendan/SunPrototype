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
    new: string;
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
  auth: {
    login: string;
    logout: string;
    email: string;
    password: string;
    rememberMe: string;
    forgotPassword: string;
    signUp: string;
    continueWithGoogle: string;
    continueWithGithub: string;
    needAccount: string;
    enterEmail: string;
    enterPassword: string;
    loggingIn: string;
    loginError: string;
    invalidCredentials: string;
    welcomeBack: string;
    loginSuccess: string;
    demoCredentials: string;
    adminAccount: string;
    employeeAccount: string;
    or: string;
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
  dashboard: {
    appShortcuts: string;
    timeOff: {
      title: string;
      annualLeave: string;
      sickLeave: string;
      remaining: string;
      total: string;
      days: string;
      requestTimeOff: string;
      calculateTimeOff: string;
      availableDays: string;
    };
    timeOffRequests: {
      title: string;
      noPendingRequests: string;
      status: {
        pending: string;
        approved: string;
        rejected: string;
      };
      type: {
        annual: string;
        sick: string;
        personal: string;
        maternity: string;
        paternity: string;
      };
      viewAll: string;
    };
    calendar: {
      title: string;
      today: string;
      upcoming: string;
      noEvents: string;
      viewFullCalendar: string;
      time: string;
      location: string;
      allDay: string;
    };
    tasks: {
      title: string;
      activeTasks: string;
      pendingTasks: string;
      noTasks: string;
      viewAllTasks: string;
      markComplete: string;
      viewDetails: string;
      priority: {
        high: string;
        medium: string;
        low: string;
      };
      status: {
        todo: string;
        inProgress: string;
        review: string;
        done: string;
      };
    };
    news: {
      title: string;
      latestNews: string;
      noNews: string;
      readMore: string;
      viewAllNews: string;
      publishedOn: string;
    };
    celebrations: {
      title: string;
      birthdays: string;
      workAnniversaries: string;
      achievements: string;
      noCelebrations: string;
      today: string;
      thisWeek: string;
      birthday: string;
      anniversary: string;
      achievement: string;
      years: string;
    };
    whosOut: {
      title: string;
      onLeave: string;
      noOneOut: string;
      today: string;
      tomorrow: string;
      returnsOn: string;
    };
    welcome: {
      title: string;
      newTeamMembers: string;
      joinedOn: string;
      department: string;
      position: string;
      noNewMembers: string;
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
  apps: {
    news: {
      name: string;
      shortName: string;
      description: string;
    };
    taskManagement: {
      name: string;
      shortName: string;
      description: string;
    };
    timeManagement: {
      name: string;
      shortName: string;
      description: string;
    };
  };
  navigation: {
    taskManagement: {
      createTask: string;
      actionBar: {
        invalidFileFormat: string;
        exampleFileName: string;
        importFromFile: string;
        downloadExample: string;
        saveToDraft: string;
        importTooltip: string;
        downloadTooltip: string;
        draftTooltip: string;
        actions: string;
      };
      columns: {
        title: string;
        status: string;
        taskType: string;
        assignmentDate: string;
        dueDate: string;
        executingUnit: string;
        priority: string;
        importanceLevel: string;
        assignee: string;
        actions: string;
      };
      filters: {
        statuses: {
          [key: string]: string;
        };
      };
    };
    timeManagement: {
      dashboard: string;
    };
  };
  commandMenu: {
    placeholder: string;
    noResults: string;
    tryDifferent: string;
    recent: string;
    categories: {
      title: string;
      dashboard: string;
      news: string;
      tasks: string;
      time: string;
    };
  };
  createButton: {
    buttonText: string;
    taskManagement: {
      sectionTitle: string;
      createTask: string;
      createTaskDesc: string;
      createDocument: string;
      createDocumentDesc: string;
    };
    timeManagement: {
      sectionTitle: string;
      requestTimeOff: string;
      requestTimeOffDesc: string;
      requestScheduleChange: string;
      requestScheduleChangeDesc: string;
      requestLateArrival: string;
      requestLateArrivalDesc: string;
      requestOvertime: string;
      requestOvertimeDesc: string;
    };
  };
  timeOff: {
    pageTitle: string;
    pageDescription: string;
    submitRequest: string;
    discardChanges: string;
    balances: {
      title: string;
      description: string;
      annual_leave: string;
      unpaid_leave: string;
      sick_leave: string;
      vacation: string;
      funeral_leave: string;
      business_leave: string;
      training_leave: string;
      remaining: string;
      days: string;
      hours: string;
    };
    form: {
      title: string;
      placeholder: string;
    };
    guidelines: {
      title: string;
      placeholder: string;
    };
    validation: {
      requiredFields: string;
    };
    success: {
      requestSubmitted: string;
    };
    error: {
      submitFailed: string;
    };
  };
}

// Helper type for nested key paths
export type TranslationKeyPath =
  | `common.${keyof TranslationKeys['common']}`
  | `auth.${keyof TranslationKeys['auth']}`
  | `pages.home.${keyof TranslationKeys['pages']['home']}`
  | `pages.docs.${keyof TranslationKeys['pages']['docs']}`
  | `pages.pricing.${keyof TranslationKeys['pages']['pricing']}`
  | `pages.blog.${keyof TranslationKeys['pages']['blog']}`
  | `pages.about.${keyof TranslationKeys['pages']['about']}`
  | `components.navbar.${keyof TranslationKeys['components']['navbar']}`
  | `components.languageSwitcher.${keyof TranslationKeys['components']['languageSwitcher']}`
  | `components.themeSwitch.${keyof TranslationKeys['components']['themeSwitch']}`
  | `dashboard.${keyof TranslationKeys['dashboard']}`
  | `dashboard.timeOff.${keyof TranslationKeys['dashboard']['timeOff']}`
  | `dashboard.timeOffRequests.${keyof TranslationKeys['dashboard']['timeOffRequests']}`
  | `dashboard.timeOffRequests.status.${keyof TranslationKeys['dashboard']['timeOffRequests']['status']}`
  | `dashboard.timeOffRequests.type.${keyof TranslationKeys['dashboard']['timeOffRequests']['type']}`
  | `dashboard.calendar.${keyof TranslationKeys['dashboard']['calendar']}`
  | `dashboard.tasks.${keyof TranslationKeys['dashboard']['tasks']}`
  | `dashboard.tasks.priority.${keyof TranslationKeys['dashboard']['tasks']['priority']}`
  | `dashboard.tasks.status.${keyof TranslationKeys['dashboard']['tasks']['status']}`
  | `dashboard.news.${keyof TranslationKeys['dashboard']['news']}`
  | `dashboard.celebrations.${keyof TranslationKeys['dashboard']['celebrations']}`
  | `dashboard.whosOut.${keyof TranslationKeys['dashboard']['whosOut']}`
  | `dashboard.welcome.${keyof TranslationKeys['dashboard']['welcome']}`
  | `stores.users.${keyof TranslationKeys['stores']['users']}`
  | `stores.products.${keyof TranslationKeys['stores']['products']}`
  | `apps.news.${keyof TranslationKeys['apps']['news']}`
  | `apps.taskManagement.${keyof TranslationKeys['apps']['taskManagement']}`
  | `apps.timeManagement.${keyof TranslationKeys['apps']['timeManagement']}`
  | `navigation.taskManagement.${keyof TranslationKeys['navigation']['taskManagement']}`
  | `navigation.taskManagement.actionBar.${keyof TranslationKeys['navigation']['taskManagement']['actionBar']}`
  | `navigation.taskManagement.columns.${keyof TranslationKeys['navigation']['taskManagement']['columns']}`
  | `navigation.timeManagement.${keyof TranslationKeys['navigation']['timeManagement']}`
  | `commandMenu.${keyof TranslationKeys['commandMenu']}`
  | `commandMenu.categories.${keyof TranslationKeys['commandMenu']['categories']}`
  | `createButton.${keyof TranslationKeys['createButton']}`
  | `createButton.taskManagement.${keyof TranslationKeys['createButton']['taskManagement']}`
  | `createButton.timeManagement.${keyof TranslationKeys['createButton']['timeManagement']}`
  | `timeOff.${keyof TranslationKeys['timeOff']}`
  | `timeOff.balances.${keyof TranslationKeys['timeOff']['balances']}`
  | `timeOff.form.${keyof TranslationKeys['timeOff']['form']}`
  | `timeOff.guidelines.${keyof TranslationKeys['timeOff']['guidelines']}`
  | `timeOff.validation.${keyof TranslationKeys['timeOff']['validation']}`
  | `timeOff.success.${keyof TranslationKeys['timeOff']['success']}`
  | `timeOff.error.${keyof TranslationKeys['timeOff']['error']}`;

export interface I18nContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKeyPath) => string;
  translations: TranslationKeys;
}
