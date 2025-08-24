"use client";

import { useRef } from "react";
import { Button } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "@iconify/react";
import { useTranslation } from "@/lib/i18n-context";
import type { AttachmentFile } from "@/types/task-form";

interface FileUploadProps {
  files: AttachmentFile[];
  onChange: (files: AttachmentFile[]) => void;
  className?: string;
  isInvalid?: boolean;
  errorMessage?: string;
}

const ACCEPTED_FILE_TYPES = {
  images: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'],
  documents: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain', 'text/csv']
};

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export function FileUpload({ 
  files, 
  onChange, 
  className = "",
  isInvalid,
  errorMessage 
}: FileUploadProps) {
  const { t } = useTranslation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isImageFile = (type: string) => ACCEPTED_FILE_TYPES.images.includes(type);
  const isDocumentFile = (type: string) => ACCEPTED_FILE_TYPES.documents.includes(type);

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    
    const newFiles: AttachmentFile[] = selectedFiles
      .filter(file => {
        // Validate file type
        if (!isImageFile(file.type) && !isDocumentFile(file.type)) {
          console.warn(`File type ${file.type} not supported`);
          return false;
        }
        
        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
          console.warn(`File ${file.name} is too large (${file.size} bytes)`);
          return false;
        }
        
        return true;
      })
      .map(file => ({
        id: `file_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        name: file.name,
        size: file.size,
        type: file.type,
        file,
        url: URL.createObjectURL(file)
      }));

    onChange([...files, ...newFiles]);
    
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveFile = (fileId: string) => {
    const fileToRemove = files.find(f => f.id === fileId);
    if (fileToRemove?.url) {
      URL.revokeObjectURL(fileToRemove.url);
    }
    onChange(files.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const imageFiles = files.filter(file => isImageFile(file.type));
  const documentFiles = files.filter(file => isDocumentFile(file.type));

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Header with label and upload button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <label className="block text-md font-bold text-foreground">
            {t("navigation.taskManagement.attachments")}
          </label>
          {files.length > 0 && (
            <span className="text-xs text-default-500 bg-default-100 px-2 py-1 rounded-full">
              {files.length} {t("navigation.taskManagement.attachmentCount")}
            </span>
          )}
        </div>
        <Button
          isIconOnly
          size="sm"
          variant="light"
          onPress={handleFileSelect}
          color="primary"
          aria-label={t("navigation.taskManagement.uploadFiles")}
        >
          <Icon icon="solar:add-square-bold" width={20} />
        </Button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={[...ACCEPTED_FILE_TYPES.images, ...ACCEPTED_FILE_TYPES.documents].join(',')}
        onChange={handleFileChange}
        className="hidden"
      />

      {/* File display area */}
      <div className={`min-h-[80px] border-2 border-dashed rounded-lg p-4 transition-colors ${
        isInvalid ? 'border-danger' : 'border-default-300'
      } ${files.length === 0 ? 'hover:border-default-400 hover:bg-default-50 cursor-pointer' : ''}`}
        onClick={files.length === 0 ? handleFileSelect : undefined}
      >
        {files.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-16 text-default-500 text-sm space-y-2">
            <Icon icon="solar:cloud-upload-linear" width={20} />
            <span>{t("navigation.taskManagement.noAttachmentsYet")}</span>
            <span className="text-xs text-default-400">{t("navigation.taskManagement.clickToUpload")}</span>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Image thumbnails */}
            {imageFiles.length > 0 && (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <AnimatePresence>
                    {imageFiles.map((file) => (
                      <motion.div
                        key={file.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="relative group"
                      >
                        <div className="w-20 h-20 rounded-lg overflow-hidden border border-default-200">
                          <img
                            src={file.url}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <Button
                          isIconOnly
                          size="sm"
                          color="danger"
                          variant="solid"
                          onPress={() => handleRemoveFile(file.id)}
                          className="absolute -top-2 -right-2 w-6 h-6 min-w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Icon icon="solar:close-circle-bold" width={12} />
                        </Button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}

            {/* Document list */}
            {documentFiles.length > 0 && (
              <div className="space-y-2">
                <AnimatePresence>
                  {documentFiles.map((file) => (
                    <motion.div
                      key={file.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="flex items-center justify-between p-2 bg-default-100 rounded-lg group"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <Icon 
                          icon="solar:document-text-linear" 
                          width={20} 
                          className="text-default-600 flex-shrink-0" 
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground truncate">
                            {file.name}
                          </p>
                          <p className="text-xs text-default-500">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <Button
                        isIconOnly
                        size="sm"
                        color="danger"
                        variant="light"
                        onPress={() => handleRemoveFile(file.id)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
                      >
                        <Icon icon="solar:trash-bin-minimalistic-linear" width={16} />
                      </Button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Error message */}
      {isInvalid && errorMessage && (
        <p className="text-danger text-sm">{errorMessage}</p>
      )}
    </div>
  );
}
