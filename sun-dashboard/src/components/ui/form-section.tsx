"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface FormSectionProps {
  title?: string;
  children: ReactNode;
  className?: string;
  spacing?: "sm" | "md" | "lg";
}

const spacingClasses = {
  sm: "space-y-3",
  md: "space-y-4", 
  lg: "space-y-6"
};

export function FormSection({ 
  title, 
  children, 
  className = "",
  spacing = "md"
}: FormSectionProps) {
  return (
    <motion.div 
      className={`${spacingClasses[spacing]} ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      {title && (
        <h3 className="text-lg font-semibold text-foreground mb-3">
          {title}
        </h3>
      )}
      {children}
    </motion.div>
  );
}
