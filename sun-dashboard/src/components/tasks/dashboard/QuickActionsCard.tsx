import { Card, CardBody, CardHeader, Button } from "@heroui/react";
import { motion } from "framer-motion";
import { Icon } from "@iconify/react";

import { useTranslation } from "@/lib/i18n-context";

export interface QuickAction {
  key: string;
  title: string;
  description: string;
  icon: string;
  color: "primary" | "secondary" | "warning" | "success";
  onClick: () => void;
}

interface QuickActionsCardProps {
  actions: QuickAction[];
  itemVariants: any;
}

export function QuickActionsCard({ actions, itemVariants }: QuickActionsCardProps) {
  const { t } = useTranslation();

  return (
    <motion.div variants={itemVariants}>
      <Card className="w-full">
        <CardHeader>
          <h3 className="text-lg font-semibold">Quick Actions</h3>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {actions.map((action) => (
              <Button
                key={action.key}
                color={action.color}
                variant="flat"
                className="justify-start h-16"
                startContent={<Icon icon={action.icon} width={20} />}
                onPress={action.onClick}
              >
                <div className="flex flex-col items-start">
                  <span className="font-semibold">{action.title}</span>
                  <span className="text-small text-default-500">{action.description}</span>
                </div>
              </Button>
            ))}
          </div>
        </CardBody>
      </Card>
    </motion.div>
  );
}
