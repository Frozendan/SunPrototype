"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";

interface EditableTitleProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isInvalid?: boolean;
  errorMessage?: string;
  className?: string;
}

export function EditableTitle({ 
  value, 
  onChange, 
  placeholder = "Enter title", 
  isInvalid, 
  errorMessage,
  className = ""
}: EditableTitleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        handleAccept();
      }
    };

    if (isEditing) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isEditing, tempValue]);

  const handleEdit = () => {
    setIsEditing(true);
    setTempValue(value);
  };

  const handleAccept = () => {
    onChange(tempValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAccept();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {!isEditing ? (
        <motion.div
          onClick={handleEdit}
          className={`text-3xl font-bold cursor-pointer hover:bg-default-100 rounded-lg px-3 py-2 transition-colors ${
            isInvalid ? 'text-danger' : 'text-foreground'
          } ${!value ? 'text-default-400' : ''}`}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
        >
          {value || placeholder}
        </motion.div>
      ) : (
        <div className="relative">
          <input
            ref={inputRef}
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`text-3xl font-bold bg-transparent border-none outline-none w-full px-3 py-2 rounded-lg focus:bg-default-50 ${
              isInvalid ? 'text-danger' : 'text-foreground'
            }`}
            placeholder={placeholder}
          />
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute top-full z-10 right-0 flex gap-1 bg-background border border-divider rounded-lg shadow-lg p-1"
              style={{ transform: 'translateY(calc(100% + 16px))' }}
            >
              <Button
                isIconOnly
                size="sm"
                color="success"
                variant="flat"
                onPress={handleAccept}
                aria-label="Accept changes"
              >
                <Check size={16} />
              </Button>
              <Button
                isIconOnly
                size="sm"
                color="danger"
                variant="flat"
                onPress={handleCancel}
                aria-label="Cancel changes"
              >
                <X size={16} />
              </Button>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
      {isInvalid && errorMessage && (
        <p className="text-danger text-sm mt-1 px-3">{errorMessage}</p>
      )}
    </div>
  );
}
