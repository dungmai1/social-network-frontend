"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ImagePlus,
  Loader2,
  Upload,
  X,
  Sparkles,
  Camera,
} from "lucide-react";
import { useCreatePost } from "@/hooks/useCreatePost";
import { buildFormData } from "@/lib/formdata";

interface CreatePostInlineProps {
  userAvatar?: string;
  username?: string;
}

export default function CreatePostInline({
  userAvatar,
  username,
}: CreatePostInlineProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [caption, setCaption] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState("");

  const { mutateAsync: submitPost, isPending } = useCreatePost();

  const refreshFiles = useCallback((updater: (prev: File[]) => File[]) => {
    setSelectedFiles((prev) => {
      const next = updater(prev);
      setPreviewUrls((prevUrls) => {
        prevUrls.forEach((url) => URL.revokeObjectURL(url));
        return next.map((file) => URL.createObjectURL(file));
      });
      return next;
    });
  }, []);

  const resetForm = () => {
    setCaption("");
    refreshFiles(() => []);
    setError(null);
    setSuccessMessage("");
    setIsExpanded(false);
  };

  useEffect(() => {
    return () => {
      previewUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [previewUrls]);

  const handleSelectFiles = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    if (files.length === 0) return;

    refreshFiles((prev) => {
      const combined = [...prev, ...files];
      setError(null);
      return combined;
    });
    event.target.value = "";
  };

  const handleRemoveImage = (index: number) => {
    refreshFiles((prev) => prev.filter((_, i) => i !== index));
    setError(null);
  };

  const disableSubmit = useMemo(
    () => !selectedFiles.length || isPending,
    [selectedFiles.length, isPending]
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFiles.length) {
      setError("Please select at least one image.");
      return;
    }
    setError(null);
    const formData = buildFormData({ content: caption.trim() }, selectedFiles);
    try {
      await submitPost(formData);
      setSuccessMessage("Post created successfully!");
      setTimeout(() => {
        resetForm();
      }, 1500);
    } catch (err) {
      setError("Could not create post. Please try again.");
    }
  };

  const handleInputFocus = () => {
    if (!isExpanded) {
      setIsExpanded(true);
    }
  };

  const handleCancel = () => {
    resetForm();
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden">
      <form onSubmit={handleSubmit}>
        {/* Header - Always visible */}
        <div className="p-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-primary/30 flex-shrink-0">
              <img
                src={
                  userAvatar ||
                  `https://picsum.photos/seed/${username || "create"}/80`
                }
                alt={username || "User"}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex-1">
              <textarea
                id="create-post-input"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                onFocus={handleInputFocus}
                placeholder="What's on your mind?"
                rows={isExpanded ? 3 : 1}
                className="w-full rounded-xl bg-muted/50 border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-2 focus:ring-primary/20 focus:outline-none resize-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Expanded content */}
        {isExpanded && (
          <div className="px-5 pb-5 space-y-4">
            {/* Image upload area */}
            <div className="flex flex-col gap-4 rounded-2xl border-2 border-dashed border-border hover:border-primary/50 p-5 text-center transition-colors">
              <div className="flex flex-col items-center gap-2 text-muted-foreground">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Camera size={24} className="text-primary" />
                </div>
                <p className="text-sm font-medium text-foreground">
                  Add photos to your post
                </p>
                <p className="text-xs text-muted-foreground">
                  Drag and drop or click to select
                </p>
              </div>
              <div>
                <label className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-md hover:bg-primary/90 cursor-pointer transition-colors btn-glow">
                  <Upload size={18} />
                  Choose images
                  <input
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    multiple
                    className="hidden"
                    onChange={handleSelectFiles}
                  />
                </label>
              </div>

              {/* Image previews */}
              {previewUrls.length > 0 && (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 mt-2">
                  {previewUrls.map((url, index) => (
                    <div
                      key={url}
                      className="relative rounded-xl overflow-hidden bg-muted/30 group"
                    >
                      <img
                        src={url}
                        alt={`preview-${index}`}
                        className="h-32 w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute right-2 top-2 p-1.5 rounded-full bg-card/90 text-foreground shadow-md opacity-0 group-hover:opacity-100 hover:bg-destructive hover:text-destructive-foreground transition-all cursor-pointer"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Error/Success messages */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-destructive/10 border border-destructive/30">
                <X size={16} className="text-destructive" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
            {successMessage && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 border border-green-500/30">
                <Sparkles size={16} className="text-green-500" />
                <p className="text-sm text-green-600 dark:text-green-400">
                  {successMessage}
                </p>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isPending}
                className="px-5 py-2.5 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded-xl transition-colors disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={disableSubmit}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground text-sm font-semibold rounded-xl shadow-md hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer btn-glow"
              >
                {isPending && <Loader2 className="animate-spin" size={18} />}
                {isPending ? "Posting..." : "Post"}
              </button>
            </div>
          </div>
        )}

        {/* Toggle button when not expanded */}
        {!isExpanded && (
          <div className="px-5 pb-4 flex justify-between items-center">
            <div className="flex gap-2">
              <label className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm text-muted-foreground cursor-pointer hover:bg-accent/50 hover:text-foreground transition-colors">
                <ImagePlus size={20} className="text-primary" />
                <span>Photo</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,image/webp"
                  multiple
                  className="hidden"
                  onChange={(e) => {
                    handleSelectFiles(e);
                    setIsExpanded(true);
                  }}
                />
              </label>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
