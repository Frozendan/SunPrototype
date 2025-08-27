export enum CategoryEnum {
  DASHBOARD = "dashboard",
  NEWS = "news",
  TASKS = "tasks",
  TIME = "time",
}

export type SearchItemType = "navigation" | "action" | "recent";

export type GroupInfo = {
  key: string;
  name: string;
};

export type SearchResultItem = {
  slug: string;
  url: string;
  group: GroupInfo;
  content: string;
  category: CategoryEnum;
  type: SearchItemType;
  icon?: string;
  description?: string;
  isNew?: boolean;
  keywords?: string[];
};

export type CategoryData = Record<CategoryEnum, SearchResultItem[]>;
