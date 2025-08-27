"use client";

import React, { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Kbd,
  Modal,
  ModalContent,
  ScrollShadow,
  cn,
  tv,
  Listbox,
  ListboxItem,
  Chip,
} from "@heroui/react";
import { Command } from "cmdk";
import { matchSorter } from "match-sorter";
import { useLocalStorage, useMediaQuery } from "usehooks-ts";
import { isAppleDevice, isWebKit } from "@react-aria/utils";
import { intersectionBy, isEmpty } from "lodash";
import MultiRef from "react-multi-ref";
import scrollIntoView from "scroll-into-view-if-needed";
import { Icon } from "@iconify/react";

import { useTranslation } from "@/lib/i18n-context";
import { commandMenuData } from "./data";
import { CategoryEnum, type SearchResultItem } from "./types";

const cmdk = tv({
  slots: {
    base: "max-h-full h-auto",
    header: [
      "flex",
      "items-center",
      "w-full",
      "px-4",
      "border-b",
      "border-default-400/50",
      "dark:border-default-100",
    ],
    searchIcon: "text-default-400 text-lg [&>g]:stroke-[2px]",
    input: [
      "w-full",
      "px-2",
      "h-14",
      "font-sans",
      "text-lg",
      "outline-hidden",
      "rounded-none",
      "bg-transparent",
      "text-default-700",
      "placeholder-default-500",
      "dark:text-default-500",
      "dark:placeholder:text-default-300",
    ],
    listScroll: ["pt-2", "pr-4", "pb-6", "overflow-y-auto"],
    list: ["max-h-[50vh] sm:max-h-[40vh]"],
    listWrapper: ["flex", "flex-col", "gap-4", "pb-4"],
    itemWrapper: [
      "px-4",
      "mt-2",
      "group",
      "flex",
      "h-[54px]",
      "justify-between",
      "items-center",
      "rounded-lg",
      "shadow",
      "bg-content2/50",
      "active:opacity-70",
      "cursor-pointer",
      "transition-opacity",
      "data-[active=true]:bg-primary",
      "data-[active=true]:text-primary-foreground",
    ],
    leftWrapper: ["flex", "gap-3", "items-center", "w-full", "max-w-full"],
    leftWrapperOnMobile: ["flex", "gap-3", "items-center", "w-full", "max-w-[166px]"],
    rightWrapper: ["flex", "flex-row", "gap-2", "items-center"],
    leftIcon: [
      "text-default-500 dark:text-default-300",
      "group-data-[active=true]:text-primary-foreground",
    ],
    itemContent: ["flex", "flex-col", "gap-0", "justify-center", "max-w-[80%]"],
    itemParentTitle: [
      "text-default-400",
      "text-xs",
      "group-data-[active=true]:text-primary-foreground",
      "select-none",
    ],
    itemTitle: [
      "truncate",
      "text-default-500",
      "group-data-[active=true]:text-primary-foreground",
      "select-none",
    ],
    emptyWrapper: ["flex", "flex-col", "text-center", "items-center", "justify-center", "h-32"],
    sectionTitle: ["text-xs", "font-semibold", "leading-4", "text-default-900"],
    categoryItem: [
      "h-[50px]",
      "gap-3",
      "py-2",
      "bg-default-100/50",
      "text-medium",
      "text-default-500",
      "data-[hover=true]:bg-default-400/40",
      "data-[selected=true]:bg-default-400/40",
      "data-[selected=true]:text-white",
      "data-[selected=true]:focus:bg-default-400/40",
    ],
  },
});

const MATCH_KEYS = ["content", "group.name", "category", "description", "keywords"] as const;
const RECENT_SEARCHES_KEY = "recent-searches--sun-dashboard";
const MAX_RECENT_SEARCHES = 10;
const MAX_RESULTS = 20;

const CATEGORY_ICON_MAP = {
  [CategoryEnum.DASHBOARD]: "solar:home-2-linear",
  [CategoryEnum.NEWS]: "solar:document-text-linear",
  [CategoryEnum.TASKS]: "solar:checklist-minimalistic-linear",
  [CategoryEnum.TIME]: "solar:clock-circle-linear",
};

const CATEGORIES = [
  {
    key: CategoryEnum.DASHBOARD,
    icon: CATEGORY_ICON_MAP[CategoryEnum.DASHBOARD],
    label: "commandMenu.categories.dashboard",
  },
  {
    key: CategoryEnum.NEWS,
    icon: CATEGORY_ICON_MAP[CategoryEnum.NEWS],
    label: "commandMenu.categories.news",
  },
  {
    key: CategoryEnum.TASKS,
    icon: CATEGORY_ICON_MAP[CategoryEnum.TASKS],
    label: "commandMenu.categories.tasks",
  },
  {
    key: CategoryEnum.TIME,
    icon: CATEGORY_ICON_MAP[CategoryEnum.TIME],
    label: "commandMenu.categories.time",
  },
] as const;

function flattenSearchData() {
  let flattened: SearchResultItem[] = [];

  Object.keys(commandMenuData).forEach((key) => {
    const items = commandMenuData[key as CategoryEnum];
    flattened = flattened.concat(items);
  });

  return flattened;
}

function groupedSearchData(data: SearchResultItem[]) {
  const categoryGroupMap = {
    [CategoryEnum.DASHBOARD]: [] as SearchResultItem[],
    [CategoryEnum.NEWS]: [] as SearchResultItem[],
    [CategoryEnum.TASKS]: [] as SearchResultItem[],
    [CategoryEnum.TIME]: [] as SearchResultItem[],
  };

  data.forEach((item) => {
    if (item.category) {
      categoryGroupMap[item.category].push(item);
    }
  });

  return categoryGroupMap;
}

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandMenu({ isOpen, onClose }: CommandMenuProps) {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [activeItem, setActiveItem] = useState(0);
  const [menuNodes] = useState(() => new MultiRef<number, HTMLElement>());
  const [selectedCategory, setSelectedCategory] = useState<CategoryEnum>(CategoryEnum.DASHBOARD);
  const slots = useMemo(() => cmdk(), []);
  const flattenedData = useMemo(() => flattenSearchData(), []);
  const groupedData = useMemo(() => groupedSearchData(flattenedData), [flattenedData]);
  const eventRef = useRef<"mouse" | "keyboard">();
  const listRef = useRef<HTMLDivElement>(null);
  const [, setCommandKey] = useState<"ctrl" | "command">("command");

  const isMobile = useMediaQuery("(max-width: 650px)");

  const [savedRecentSearches, setRecentSearches] = useLocalStorage<SearchResultItem[]>(
    RECENT_SEARCHES_KEY,
    [],
  );

  useEffect(() => {
    setCommandKey(isAppleDevice() ? "command" : "ctrl");
  }, []);

  const recentSearches = useMemo(() => {
    if (isEmpty(savedRecentSearches)) return [];

    return savedRecentSearches?.map((item) => {
      const found = flattenedData.find((i) => i.slug === item.slug);
      return found || item;
    });
  }, [savedRecentSearches, flattenedData]);

  const addToRecentSearches = useCallback(
    (item: SearchResultItem) => {
      let searches = recentSearches ?? [];

      if (!searches.find((i) => i.slug === item.slug)) {
        setRecentSearches([item, ...searches].slice(0, MAX_RECENT_SEARCHES));
      } else {
        searches = searches.filter((i) => i.slug !== item.slug);
        setRecentSearches([item, ...searches].slice(0, MAX_RECENT_SEARCHES));
      }
    },
    [recentSearches, setRecentSearches],
  );

  const results = useMemo<SearchResultItem[]>(
    function getResults() {
      if (query.length < 2) return [];

      const words = query.split(" ");

      if (words.length === 1) {
        return matchSorter(flattenedData, query, {
          keys: MATCH_KEYS,
        }).slice(0, MAX_RESULTS);
      }

      const matchesForEachWord = words.map((word) =>
        matchSorter(flattenedData, word, {
          keys: MATCH_KEYS,
        }),
      );

      const matches = intersectionBy(...matchesForEachWord, "slug").slice(0, MAX_RESULTS);

      return matches;
    },
    [query, flattenedData],
  );

  const categoryGroups = useMemo(() => {
    const categoryGroups: { [key: string]: SearchResultItem[] } = {};
    const categorySearchItems = groupedData[selectedCategory];

    categorySearchItems.forEach((item) => {
      if (!categoryGroups[item.group.key]) {
        categoryGroups[item.group.key] = [];
      }
      categoryGroups[item.group.key].push(item);
    });

    return categoryGroups;
  }, [groupedData, selectedCategory]);

  const flattenGroupedItems = useMemo(() => {
    let flatten = [] as SearchResultItem[];

    Object.values(categoryGroups).forEach((groupItems) => {
      flatten = [...flatten, ...groupItems];
    });

    return flatten;
  }, [categoryGroups]);

  const items = useMemo(
    () => (!isEmpty(results) ? results : (recentSearches ?? [])),
    [results, recentSearches],
  );

  const onItemSelect = useCallback(
    (item: SearchResultItem) => {
      onClose();
      addToRecentSearches(item);
      navigate(item.url);
    },
    [onClose, addToRecentSearches, navigate],
  );

  const onCategorySelect = useCallback((keys: any) => {
    const key = Array.from(keys)[0] as CategoryEnum;
    setSelectedCategory(key);
  }, []);

  const onInputKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      eventRef.current = "keyboard";
      switch (e.key) {
        case "ArrowDown": {
          e.preventDefault();
          if (activeItem + 1 < items.length + flattenGroupedItems.length) {
            setActiveItem(activeItem + 1);
          }
          break;
        }
        case "ArrowUp": {
          e.preventDefault();
          if (activeItem - 1 >= 0) {
            setActiveItem(activeItem - 1);
          }
          break;
        }
        case "Enter": {
          if (items?.length <= 0) break;

          if (activeItem < items.length) {
            onItemSelect(items[activeItem]);
            break;
          } else if (
            isEmpty(query) &&
            flattenGroupedItems &&
            activeItem < items.length + flattenGroupedItems?.length
          ) {
            onItemSelect(flattenGroupedItems[activeItem - items.length]);
            break;
          }
          break;
        }
      }
    },
    [activeItem, flattenGroupedItems, items, onItemSelect, query],
  );

  // Reset active item when query changes
  useEffect(() => {
    setActiveItem(0);
  }, [query]);

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current || eventRef.current === "mouse") return;
    const node = menuNodes.map.get(activeItem);

    if (!node) return;
    scrollIntoView(node, {
      scrollMode: "if-needed",
      behavior: "smooth",
      block: "end",
      inline: "end",
      boundary: listRef.current,
    });
  }, [activeItem, menuNodes]);

  return (
    <Modal
      hideCloseButton
      backdrop="blur"
      classNames={{
        base: [
          "mt-[20vh]",
          "border-small",
          "dark:border-default-100",
          "supports-backdrop-filter:bg-background/80",
          "dark:supports-backdrop-filter:bg-background/30",
          "supports-backdrop-filter:backdrop-blur-md",
          "supports-backdrop-filter:backdrop-saturate-150",
        ],
        backdrop: ["bg-black/80"],
      }}
      isOpen={isOpen}
      motionProps={{
        onAnimationComplete: () => {
          if (!isOpen) {
            setQuery("");
          }
        },
      }}
      placement="top"
      scrollBehavior="inside"
      size={isEmpty(query) ? "2xl" : "xl"}
      onClose={onClose}
    >
      <ModalContent>
        <Command className={slots.base()} label="Quick search command" shouldFilter={false}>
          <div className={slots.header()}>
            <Icon className={slots.searchIcon()} icon="solar:magnifer-linear" width={20} />
            <Command.Input
              autoFocus={!isWebKit()}
              className={slots.input()}
              placeholder={t('commandMenu.placeholder')}
              value={query}
              onKeyDown={onInputKeyDown}
              onValueChange={setQuery}
            />
            {query.length > 0 && (
              <Button
                isIconOnly
                className="border-default-400 data-[hover=true]:bg-content2 dark:border-default-100 border"
                radius="full"
                size="sm"
                variant="bordered"
                onPress={() => setQuery("")}
              >
                <Icon icon="mdi:close" width={16} />
              </Button>
            )}
            <Kbd className="ml-2 hidden border-none px-2 py-1 text-[0.6rem] font-medium md:block">
              ESC
            </Kbd>
          </div>
          <div className="relative grid grid-cols-12 gap-4">
            {/* Category (Web) */}
            {!isMobile && isEmpty(query) && (
              <div className="col-span-4 flex flex-col gap-2 border-r-1 border-white/10 px-4 py-2">
                <p className={slots.sectionTitle()}>{t('commandMenu.categories.title')}</p>
                <Listbox
                  disallowEmptySelection
                  hideSelectedIcon
                  aria-label="Categories"
                  classNames={{
                    list: "gap-2",
                  }}
                  selectedKeys={[selectedCategory]}
                  selectionMode="single"
                  variant="flat"
                  onSelectionChange={onCategorySelect}
                >
                  {CATEGORIES.map((item) => (
                    <ListboxItem
                      key={item.key}
                      className={slots.categoryItem()}
                      startContent={<Icon className="text-default-400" icon={item.icon} width={20} />}
                      textValue={t(item.label)}
                    >
                      <span className="flex w-[100px]">{t(item.label)}</span>
                    </ListboxItem>
                  ))}
                </Listbox>
              </div>
            )}
            {/* Scrollable Items */}
            <div
              ref={listRef}
              className={cn(
                slots.listScroll(),
                {"col-span-8": !isMobile && isEmpty(query)},
                {"col-span-12 pl-4": isMobile || !isEmpty(query)},
              )}
            >
              <Command.List className={cn(slots.list(), "[&>div]:pb-4")} role="listbox">
                {query.length > 0 && (
                  <Command.Empty>
                    <div className={slots.emptyWrapper()}>
                      <div>
                        <p>{t('commandMenu.noResults')}</p>
                        <p className="text-default-400">{t('commandMenu.tryDifferent')}</p>
                      </div>
                    </div>
                  </Command.Empty>
                )}
                {isEmpty(query) && (
                  <div className={slots.listWrapper()}>
                    {/* Recent */}
                    {!isEmpty(recentSearches) && recentSearches.length > 0 && (
                      <Command.Group
                        heading={
                          <div className="flex items-center justify-between">
                            <p className={slots.sectionTitle()}>{t('commandMenu.recent')}</p>
                          </div>
                        }
                      >
                        <ScrollShadow hideScrollBar orientation="horizontal">
                          <div className="flex flex-row gap-2">
                            {recentSearches.map((item, index) => (
                              <Command.Item
                                key={item.slug}
                                ref={menuNodes.ref(index)}
                                className={slots.itemWrapper()}
                                data-active={index === activeItem}
                                value={item.content}
                                onMouseEnter={() => {
                                  eventRef.current = "mouse";
                                  setActiveItem(index);
                                }}
                                onMouseLeave={() => {
                                  if (index === activeItem) {
                                    setActiveItem(-1);
                                  }
                                }}
                                onSelect={() => {
                                  if (eventRef.current === "keyboard") return;
                                  onItemSelect(item);
                                }}
                              >
                                <div className={isMobile ? slots.leftWrapperOnMobile() : slots.leftWrapper()}>
                                  {item.icon && (
                                    <Icon
                                      className={slots.leftIcon()}
                                      icon={item.icon}
                                      width={20}
                                    />
                                  )}
                                  <div className={slots.itemContent()}>
                                    <span className={slots.itemParentTitle()}>
                                      {item.group.name}
                                    </span>
                                    <p className={slots.itemTitle()}>{item.content}</p>
                                  </div>
                                </div>
                              </Command.Item>
                            ))}
                          </div>
                        </ScrollShadow>
                      </Command.Group>
                    )}
                    {/* Categories (Mobile) */}
                    {isMobile && (
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center justify-between">
                          <p className={slots.sectionTitle()}>{t('commandMenu.categories.title')}</p>
                        </div>
                        <ScrollShadow hideScrollBar orientation="horizontal">
                          <Listbox
                            disallowEmptySelection
                            hideSelectedIcon
                            aria-label="Categories"
                            classNames={{
                              list: "flex-row gap-2",
                            }}
                            selectedKeys={[selectedCategory]}
                            selectionMode="single"
                            variant="flat"
                            onSelectionChange={onCategorySelect}
                          >
                            {CATEGORIES.map((item) => (
                              <ListboxItem
                                key={item.key}
                                className={slots.categoryItem()}
                                startContent={<Icon className="text-default-400" icon={item.icon} width={20} />}
                                textValue={t(item.label)}
                              >
                                <span className="flex w-[100px]">{t(item.label)}</span>
                              </ListboxItem>
                            ))}
                          </Listbox>
                        </ScrollShadow>
                      </div>
                    )}
                    {/* Groups */}
                    {Object.keys(categoryGroups).map((key) => {
                      const groupItems = categoryGroups[key];
                      const groupName = groupItems[0].group.name;
                      let totalItems = recentSearches ? recentSearches.length : 0;

                      return (
                        <div key={key} className="flex flex-col">
                          <Command.Group
                            heading={
                              <div className="flex flex-row items-center justify-between gap-1">
                                <p className="text-default-900 text-xs leading-4 font-semibold">{groupName}</p>
                              </div>
                            }
                          >
                            <div className="flex flex-col gap-2">
                              {groupItems.map((item, _index) => {
                                totalItems++;
                                const itemIndex = totalItems - 1;
                                const isActive = itemIndex === activeItem;

                                return (
                                  <Command.Item
                                    key={item.slug}
                                    ref={menuNodes.ref(itemIndex)}
                                    className={slots.itemWrapper()}
                                    data-active={isActive}
                                    value={item.content}
                                    onMouseEnter={() => {
                                      eventRef.current = "mouse";
                                      setActiveItem(itemIndex);
                                    }}
                                    onMouseLeave={() => {
                                      if (itemIndex === activeItem) {
                                        setActiveItem(-1);
                                      }
                                    }}
                                    onSelect={() => {
                                      if (eventRef.current === "keyboard") return;
                                      onItemSelect(item);
                                    }}
                                  >
                                    <div className={isMobile ? slots.leftWrapperOnMobile() : slots.leftWrapper()}>
                                      {item.icon && (
                                        <Icon
                                          className={slots.leftIcon()}
                                          icon={item.icon}
                                          width={20}
                                        />
                                      )}
                                      <div className={slots.itemContent()}>
                                        <span className={slots.itemParentTitle()}>
                                          {t(`commandMenu.categories.${item.category}`)}/{item.group.name}
                                        </span>
                                        <p className={slots.itemTitle()}>{item.content}</p>
                                      </div>
                                    </div>
                                    <div className={slots.rightWrapper()}>
                                      {item.isNew && (
                                        <Chip size="sm" variant="flat" color="primary">
                                          {t('common.new')}
                                        </Chip>
                                      )}
                                      <Icon icon="solar:alt-arrow-right-line-duotone" width={20} />
                                    </div>
                                  </Command.Item>
                                );
                              })}
                            </div>
                          </Command.Group>
                        </div>
                      );
                    })}
                  </div>
                )}

                {results.map((item, index) => (
                  <Command.Item
                    key={item.slug}
                    ref={menuNodes.ref(index)}
                    className={slots.itemWrapper()}
                    data-active={index === activeItem}
                    value={item.content}
                    onMouseEnter={() => {
                      eventRef.current = "mouse";
                      setActiveItem(index);
                    }}
                    onMouseLeave={() => {
                      if (index === activeItem) {
                        setActiveItem(-1);
                      }
                    }}
                    onSelect={() => {
                      if (eventRef.current === "keyboard") return;
                      onItemSelect(item);
                    }}
                  >
                    <div className={isMobile ? slots.leftWrapperOnMobile() : slots.leftWrapper()}>
                      {item.icon && (
                        <Icon
                          className={slots.leftIcon()}
                          icon={item.icon}
                          width={20}
                        />
                      )}
                      <div className={slots.itemContent()}>
                        <span className={slots.itemParentTitle()}>
                          {t(`commandMenu.categories.${item.category}`)}/{item.group.name}
                        </span>
                        <p className={slots.itemTitle()}>{item.content}</p>
                      </div>
                    </div>
                    <div className={slots.rightWrapper()}>
                      {item.isNew && (
                        <Chip size="sm" variant="flat" color="primary">
                          {t('common.new')}
                        </Chip>
                      )}
                      <Icon icon="solar:alt-arrow-right-line-duotone" width={20} />
                    </div>
                  </Command.Item>
                ))}
              </Command.List>
            </div>
          </div>
        </Command>
      </ModalContent>
    </Modal>
  );
}
