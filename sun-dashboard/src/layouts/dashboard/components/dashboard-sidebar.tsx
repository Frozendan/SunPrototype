"use client";

import {
  User,
  Badge,
  Avatar,
  Chip,
  Button,
  ScrollShadow,
  Card,
  CardBody,
  CardFooter,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectItem,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  Input,
  Spacer,
  SelectSection,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { useNavigate, useLocation } from "react-router-dom";

import { SunIcon } from "@/components/sun-logo";
import { useAuth } from "@/hooks/use-auth";
import { useTranslation } from "@/lib/i18n-context";

import NotificationsCard from "./notifications-card";
import Sidebar from "./sidebar";
import type { SidebarItem, Workspace, DashboardUser } from "../types";

const workspaces: Workspace[] = [
  {
    value: "0",
    label: "Sun Group",
    items: [
      {
        value: "1",
        label: "Core workspace",
      },
      {
        value: "2",
        label: "Design workspace",
      },
      {
        value: "3",
        label: "Dev. workspace",
      },
      {
        value: "4",
        label: "Marketing workspace",
      },
    ],
  },
];

const mockUsers: DashboardUser[] = [
  {
    id: 1,
    name: "Kate Moore",
    role: "Customer Support",
    team: "Customer Support",
    avatar:
      "https://nextuipro.nyc3.cdn.digitaloceanspaces.com/components-images/avatars/e1b8ec120710c09589a12c0004f85825.jpg",
    email: "kate.moore@example.com",
  },
  {
    id: 2,
    name: "John Doe",
    role: "Product Designer",
    team: "Design",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026708c",
    email: "john.doe@example.com",
  },
  {
    id: 3,
    name: "Jane Doe",
    role: "Product Manager",
    team: "Product",
    avatar: "https://i.pravatar.cc/150?u=a04258114e22026708c",
    email: "jane.doe@example.com",
  },
];

interface DashboardSidebarProps {
  className?: string;
  isCompact?: boolean;
}

export default function DashboardSidebar({ className, isCompact = false }: DashboardSidebarProps) {
  const { user, logout, isAdmin } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSidebarSelect = (key: string) => {
    // Handle navigation based on selected key
    switch (key) {
      case "home":
        navigate("/dashboard");
        break;
      case "settings":
        // Navigate to settings when implemented
        break;
      default:
        console.log(`Navigate to ${key}`);
    }
  };

  const sidebarItems: SidebarItem[] = [
    {
      key: "home",
      href: "/dashboard",
      icon: "solar:home-2-linear",
      title: t('common.dashboard'),
    },
    {
      key: "projects",
      href: "#",
      icon: "solar:widget-2-outline",
      title: "Projects",
      endContent: (
        <Icon className="text-default-400" icon="solar:add-circle-line-duotone" width={24} />
      ),
    },
    {
      key: "tasks",
      href: "#",
      icon: "solar:checklist-minimalistic-outline",
      title: "Tasks",
      endContent: (
        <Icon className="text-default-400" icon="solar:add-circle-line-duotone" width={24} />
      ),
    },
    {
      key: "team",
      href: "#",
      icon: "solar:users-group-two-rounded-outline",
      title: "Team",
    },
    {
      key: "tracker",
      href: "#",
      icon: "solar:sort-by-time-linear",
      title: "Tracker",
      endContent: (
        <Chip size="sm" variant="flat">
          New
        </Chip>
      ),
    },
    {
      key: "analytics",
      href: "#",
      icon: "solar:chart-outline",
      title: "Analytics",
    },
    {
      key: "perks",
      href: "#",
      icon: "solar:gift-linear",
      title: "Perks",
      endContent: (
        <Chip size="sm" variant="flat">
          3
        </Chip>
      ),
    },
    {
      key: "expenses",
      href: "#",
      icon: "solar:bill-list-outline",
      title: "Expenses",
    },
    {
      key: "settings",
      href: "#",
      icon: "solar:settings-outline",
      title: t('common.settings'),
    },
  ];

  // Get current path for active sidebar item
  const currentPath = location.pathname.split("/")[1] || "home";

  if (!user) {
    return null;
  }

  return (
    <div className={`border-divider relative flex h-full flex-1 flex-col py-4 px-3.5 transition-all duration-300 ${
      isCompact ? 'w-20' : 'w-72'
    } ${className}`}>
      <div className="flex items-center justify-between">
        <div className={`flex items-center gap-2 px-2 ${isCompact ? 'justify-center py-1 w-full' : ''}`}>
          <div className="flex items-center justify-center">
            <SunIcon className="text-foreground" size={isCompact ? 20 : 26} />
          </div>
          {!isCompact && <span className="text-small font-bold uppercase transition text-primary">Sun Group</span>}
        </div>
      </div>

      <Spacer y={8} />

      {!isCompact && (
        <div className="flex flex-col gap-y-2">
          <Select
            disableSelectorIconRotation
            aria-label="Select workspace"
            className="px-1"
            classNames={{
              trigger:
                "min-h-14 bg-transparent border-small border-default-200 dark:border-default-100 data-[hover=true]:border-default-500 dark:data-[hover=true]:border-default-200 data-[hover=true]:bg-transparent",
            }}
            defaultSelectedKeys={["1"]}
            items={workspaces}
            listboxProps={{
              bottomContent: (
                <Button
                  className="bg-default-100 text-foreground text-center"
                  size="sm"
                  onPress={() => console.log("on create workspace")}
                >
                  New Workspace
                </Button>
              ),
            }}
            placeholder="Select workspace"
            renderValue={(items) => {
              return items.map((item) => (
                <div key={item.key} className="ml-1 flex flex-col gap-y-0.5">
                  <span className="text-tiny leading-4">Sun Group</span>
                  <span className="text-tiny text-default-400">{item.data?.label}</span>
                </div>
              ));
            }}
            selectorIcon={
              <Icon color="hsl(var(--heroui-default-500))" icon="lucide:chevrons-up-down" />
            }
            startContent={
              <div className="border-small border-default-300 relative h-10 w-10 flex-none rounded-full">
                <Icon
                  className="text-default-500 mt-2 ml-2"
                  icon="solar:users-group-rounded-linear"
                  width={24}
                />
              </div>
            }
          >
            {(section) => (
              <SelectSection
                key={section.value}
                hideSelectedIcon
                showDivider
                aria-label={section.label}
                items={section.items}
                title={section.label}
              >
                {/* @ts-ignore */}
                {(item) => (
                  <SelectItem key={item.value} aria-label={item.label} textValue={item.label}>
                    <div className="flex flex-row items-center justify-between gap-1">
                      <span>{item.label}</span>
                      <div className="border-small border-default-300 flex h-6 w-6 items-center justify-center rounded-full">
                        <Icon
                          className="text-default-500"
                          icon="solar:users-group-rounded-linear"
                          width={16}
                        />
                      </div>
                    </div>
                  </SelectItem>
                )}
              </SelectSection>
            )}
          </Select>
          <Input
            fullWidth
            aria-label="search"
            classNames={{
              base: "px-1",
              inputWrapper: "dark:bg-default-50",
            }}
            labelPlacement="outside"
            placeholder="Search..."
            startContent={
              <Icon
                className="text-default-500 [&>g]:stroke-[2px]"
                icon="solar:magnifer-linear"
                width={18}
              />
            }
          />
        </div>
      )}

      <ScrollShadow className={`h-full max-h-full py-6 ${isCompact ? '-mr-2 pr-2' : '-mr-6 pr-6'}`}>
        <Sidebar
          isCompact={isCompact}
          defaultSelectedKey={currentPath === "" ? "home" : currentPath}
          iconClassName="group-data-[selected=true]:text-primary-foreground"
          itemClasses={{
            base: "data-[selected=true]:bg-primary-400 dark:data-[selected=true]:bg-primary-300 data-[hover=true]:bg-default-300/20 dark:data-[hover=true]:bg-default-200/40",
            title: "group-data-[selected=true]:text-primary-foreground",
          }}
          items={sidebarItems}
          onSelect={handleSidebarSelect}
        />
        <Spacer y={8} />
        {!isCompact && (
          <Card className="mx-2 overflow-visible" shadow="sm">
            <CardBody className="items-center py-5 text-center">
              <h3 className="text-medium text-default-700 font-medium">
                Upgrade to Pro
                <span aria-label="rocket-emoji" className="ml-2" role="img">
                  🚀
                </span>
              </h3>
              <p className="text-small text-default-500 p-4">
                Get 1 month free and unlock all the features of the pro plan.
              </p>
            </CardBody>
            <CardFooter className="absolute -bottom-8 justify-center">
              <Button className="px-10" color="primary" radius="full">
                Upgrade
              </Button>
            </CardFooter>
          </Card>
        )}
      </ScrollShadow>

      {/*{!isCompact && (*/}
      {/*  <Dropdown placement="top">*/}
      {/*    <DropdownTrigger>*/}
      {/*      <Button className="mb-4 h-16 items-center justify-between" variant="light">*/}
      {/*        <User*/}
      {/*          avatarProps={{*/}
      {/*            size: "sm",*/}
      {/*            isBordered: false,*/}
      {/*            src: user.avatar,*/}
      {/*          }}*/}
      {/*          className="justify-start transition-transform"*/}
      {/*          description={user.role}*/}
      {/*          name={user.name}*/}
      {/*        />*/}
      {/*        <Icon className="text-default-400" icon="lucide:chevrons-up-down" width={16} />*/}
      {/*      </Button>*/}
      {/*    </DropdownTrigger>*/}
      {/*    <DropdownMenu*/}
      {/*      aria-label="Account switcher"*/}
      {/*      variant="flat"*/}
      {/*      onAction={(key) => console.log(`selected user ${key}`)}*/}
      {/*    >*/}
      {/*      {mockUsers.map((mockUser) => (*/}
      {/*        <DropdownItem key={mockUser.id} textValue={mockUser.name}>*/}
      {/*          <div className="flex items-center gap-x-3">*/}
      {/*            <Avatar*/}
      {/*              alt={mockUser.name}*/}
      {/*              classNames={{*/}
      {/*                base: "shrink-0",*/}
      {/*                img: "transition-none",*/}
      {/*              }}*/}
      {/*              size="sm"*/}
      {/*              src={mockUser.avatar}*/}
      {/*            />*/}
      {/*            <div className="flex flex-col">*/}
      {/*              <p className="text-small text-default-600 font-medium">{mockUser.name}</p>*/}
      {/*              <p className="text-tiny text-default-400">{mockUser.email}</p>*/}
      {/*            </div>*/}
      {/*          </div>*/}
      {/*        </DropdownItem>*/}
      {/*      ))}*/}
      {/*    </DropdownMenu>*/}
      {/*  </Dropdown>*/}
      {/*)}*/}
      
      {/*/!* Compact mode user avatar *!/*/}
      {/*{isCompact && (*/}
      {/*  <div className="mb-4 flex justify-center">*/}
      {/*    <Avatar*/}
      {/*      className="h-8 w-8"*/}
      {/*      name={user.name}*/}
      {/*      src={user.avatar}*/}
      {/*      size="sm"*/}
      {/*    />*/}
      {/*  </div>*/}
      {/*)}*/}
    </div>
  );
}
