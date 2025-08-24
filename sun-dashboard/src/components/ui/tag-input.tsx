"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Button, Chip, Autocomplete, AutocompleteItem } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import type { MockLabel } from "@/types/task-form";
import { useTagsStore } from "@/stores/tags-store";

interface TagInputProps {
  selectedTagIds: string[];
  onChange: (tagIds: string[]) => void;
  placeholder?: string;
  className?: string;
  isInvalid?: boolean;
  errorMessage?: string;
  onTagCreate?: (tag: MockLabel) => void;
}

export function TagInput({
  selectedTagIds,
  onChange,
  placeholder = "Search and select tags...",
  className = "",
  isInvalid,
  errorMessage,
  onTagCreate,
}: TagInputProps) {
  const [isInputVisible, setIsInputVisible] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const inputRef = useRef<HTMLDivElement>(null);

  // Use tags store
  const { getAllTags, searchTags, createTag, getTagById } = useTagsStore();
  const allTags = getAllTags();

  const selectedTags = allTags.filter(tag => selectedTagIds.includes(tag.id));
  const availableTagsForSelection = allTags.filter(tag => !selectedTagIds.includes(tag.id));

  useEffect(() => {
    if (isInputVisible && inputRef.current) {
      // Focus the autocomplete input
      const input = inputRef.current.querySelector('input');
      if (input) {
        input.focus();
      }
    }
  }, [isInputVisible]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsInputVisible(false);
        setSearchValue("");
      }
    };

    if (isInputVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isInputVisible]);

  const handleAddTag = () => {
    setIsInputVisible(true);
    setSearchValue("");
  };

  const handleTagSelect = (key: React.Key | null) => {
    const keyStr = key?.toString();

    if (!keyStr) return;

    // Check if this is a "create new tag" selection
    if (keyStr.startsWith('create:')) {
      const tagName = keyStr.replace('create:', '');
      const newTag = createTag(tagName);

      // Add the new tag to selected tags
      if (!selectedTagIds.includes(newTag.id)) {
        onChange([...selectedTagIds, newTag.id]);
      }

      // Notify parent component about tag creation
      onTagCreate?.(newTag);
    } else {
      // Handle existing tag selection
      if (!selectedTagIds.includes(keyStr)) {
        onChange([...selectedTagIds, keyStr]);
      }
    }

    setIsInputVisible(false);
    setSearchValue("");
  };

  const handleRemoveTag = (tagIdToRemove: string) => {
    onChange(selectedTagIds.filter(id => id !== tagIdToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsInputVisible(false);
      setSearchValue("");
    }
  };

  // Compute filtered tags and create option
  const { filteredTags, showCreateOption } = useMemo(() => {
    const trimmedSearch = searchValue.trim();

    if (!trimmedSearch) {
      return {
        filteredTags: availableTagsForSelection,
        showCreateOption: false,
      };
    }

    const filtered = availableTagsForSelection.filter(tag =>
      tag.name.toLowerCase().includes(trimmedSearch.toLowerCase()) ||
      tag.description?.toLowerCase().includes(trimmedSearch.toLowerCase())
    );

    // Show create option if no exact match exists and search is not empty
    const exactMatch = allTags.some(tag =>
      tag.name.toLowerCase() === trimmedSearch.toLowerCase()
    );

    return {
      filteredTags: filtered,
      showCreateOption: !exactMatch && trimmedSearch.length > 0,
    };
  }, [searchValue, availableTagsForSelection, allTags]);

  const getTagColor = (color: string) => {
    const colorMap: Record<string, any> = {
      blue: "primary",
      green: "success",
      purple: "secondary",
      red: "danger",
      orange: "warning",
      yellow: "warning",
      gray: "default",
      pink: "secondary",
      cyan: "primary",
    };
    return colorMap[color] || "default";
  };

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Selected Tags */}
      <AnimatePresence>
        {selectedTags.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap gap-2"
          >
            {selectedTags.map((tag) => (
              <motion.div
                key={tag.id}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
              >
                <Chip
                  color={getTagColor(tag.color)}
                  variant="flat"
                  onClose={() => handleRemoveTag(tag.id)}
                  size="sm"
                >
                  {tag.name}
                </Chip>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Tag Button or Input */}
      <div ref={inputRef}>
        {!isInputVisible ? (
          <Button
            variant="bordered"
            size="sm"
            onPress={handleAddTag}
            startContent={<Icon icon="solar:add-circle-linear" width={16} />}
            className="text-default-600 border-dashed"
          >
            Add Tag
          </Button>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Autocomplete
              placeholder={placeholder}
              inputValue={searchValue}
              onInputChange={setSearchValue}
              onSelectionChange={handleTagSelect}
              variant="bordered"
              size="sm"
              isInvalid={isInvalid}
              errorMessage={errorMessage}
              onKeyDown={handleKeyDown}
              startContent={<Icon icon="solar:tag-linear" width={16} />}
              className="max-w-xs"
            >
              {/* Create new tag option */}
              {showCreateOption && (
                <AutocompleteItem
                  key={`create:${searchValue.trim()}`}
                  textValue={`Create new tag: ${searchValue.trim()}`}
                  startContent={
                    <Icon
                      icon="solar:add-circle-bold"
                      width={14}
                      className="text-default-500"
                    />
                  }
                  className="border-b border-divider"
                >
                  <div className="flex items-center gap-2">
                      Create new tag: "{searchValue.trim()}"
                  </div>
                </AutocompleteItem>
              )}

              {/* Existing tags */}
              {filteredTags.map((tag) => (
                <AutocompleteItem
                  key={tag.id}
                  textValue={tag.name}
                  startContent={
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        backgroundColor: tag.color === 'blue' ? '#3b82f6' :
                                       tag.color === 'green' ? '#10b981' :
                                       tag.color === 'purple' ? '#8b5cf6' :
                                       tag.color === 'red' ? '#ef4444' :
                                       tag.color === 'orange' ? '#f97316' :
                                       tag.color === 'yellow' ? '#eab308' :
                                       tag.color === 'gray' ? '#6b7280' :
                                       tag.color === 'pink' ? '#ec4899' :
                                       tag.color === 'cyan' ? '#06b6d4' : '#6b7280'
                      }}
                    />
                  }
                  description={tag.description}
                >
                  {tag.name}
                </AutocompleteItem>
              ))}
            </Autocomplete>
          </motion.div>
        )}
      </div>

      {/* Error Message */}
      {isInvalid && errorMessage && !isInputVisible && (
        <p className="text-danger text-sm">{errorMessage}</p>
      )}
    </div>
  );
}
