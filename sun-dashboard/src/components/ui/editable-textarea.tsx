"use client";

import { useState, useRef, useEffect } from "react";
import { Button, Textarea } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X } from "lucide-react";

interface EditableTextAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  isInvalid?: boolean;
  errorMessage?: string;
  className?: string;
  label?: string;
  minRows?: number;
}

export function EditableTextArea({ 
  value, 
  onChange, 
  placeholder = "Enter text", 
  isInvalid, 
  errorMessage,
  className = "",
  label,
  minRows = 6
}: EditableTextAreaProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      // Move cursor to end
      const length = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(length, length);
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
    if (e.key === 'Escape') {
      handleCancel();
    }
    // Allow Ctrl+Enter or Cmd+Enter to save
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      handleAccept();
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Label */}
      {label && (
        <label className="block text-md font-bold text-foreground mb-2">
          {label}
        </label>
      )}
      
      {!isEditing ? (
        <motion.div
          onClick={handleEdit}
          className={` cursor-pointer hover:bg-default-100 rounded-lg px-0 py-3 transition-colors border-2 border-transparent hover:border-default-200 ${
            isInvalid ? 'text-danger border-danger' : 'text-foreground'
          } ${!value ? 'text-default-400' : ''}`}
        >
          <div className="whitespace-pre-wrap text-sm leading-relaxed">
            {value || placeholder}
          </div>
        </motion.div>
      ) : (
        <div className="relative">
          <Textarea
            ref={textareaRef}
            value={tempValue}
            onValueChange={setTempValue}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            minRows={minRows}
            variant="bordered"
            className="w-full"
            classNames={{
              input: "text-sm",
              inputWrapper: isInvalid ? "border-danger" : ""
            }}
          />
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute -bottom-6 z-10 right-0 flex gap-1 bg-background border border-divider rounded-lg shadow-lg p-1 mt-2"
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
          <div className="text-xs text-default-500 mt-1">
            Press Ctrl+Enter to save, Esc to cancel
          </div>
        </div>
      )}
      {isInvalid && errorMessage && (
        <p className="text-danger text-sm mt-1 px-3">{errorMessage}</p>
      )}
    </div>
  );
}
