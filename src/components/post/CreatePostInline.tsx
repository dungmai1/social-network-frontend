"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ImagePlus,
  Loader2,
  Upload,
  X,
  ChevronDown,
  ChevronUp,
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
    [selectedFiles.length, isPending],
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedFiles.length) {
      setError("Vui lòng chọn ít nhất một ảnh.");
      return;
    }
    setError(null);
    const formData = buildFormData({ content: caption.trim() }, selectedFiles);
    try {
      await submitPost(formData);
      setSuccessMessage("Bài viết đã được tạo thành công!");
      setTimeout(() => {
        resetForm();
      }, 1500);
    } catch (err) {
      setError("Không thể tạo bài viết. Vui lòng thử lại.");
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
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 w-full max-w-2xl overflow-hidden">
      <form onSubmit={handleSubmit}>
        {/* Header - Always visible */}
        <div className="p-5">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-gray-200 flex-shrink-0">
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
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                onFocus={handleInputFocus}
                placeholder="Bạn đang nghĩ gì?"
                rows={isExpanded ? 3 : 1}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-gray-400 focus:outline-none resize-none transition-all"
              />
            </div>
          </div>
        </div>

        {/* Expanded content */}
        {isExpanded && (
          <div className="px-5 pb-5 space-y-4">
            {/* Image upload area */}
            <div className="flex flex-col gap-3 rounded-2xl border-2 border-dashed border-gray-200 p-4 text-center">
              <div className="flex flex-col items-center gap-2 text-gray-600">
                <ImagePlus size={32} />
                <p className="text-sm">
                  Kéo thả hoặc chọn nhiều ảnh để tải lên.
                </p>
                <p className="text-xs text-gray-400">
                  Hỗ trợ PNG, JPG, JPEG, WEBP.
                </p>
              </div>
              <div>
                <label className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-500 cursor-pointer transition">
                  <Upload size={18} />
                  Chọn ảnh
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
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 mt-3">
                  {previewUrls.map((url, index) => (
                    <div
                      key={url}
                      className="relative rounded-xl border border-gray-100 bg-gray-50 p-2"
                    >
                      <img
                        src={url}
                        alt={`preview-${index}`}
                        className="h-32 w-full rounded-lg object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute right-2 top-2 rounded-full bg-white/80 p-1 text-gray-700 shadow hover:bg-white transition"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Error/Success messages */}
            {error && <p className="text-sm text-red-500">{error}</p>}
            {successMessage && (
              <p className="text-sm text-emerald-600">{successMessage}</p>
            )}

            {/* Action buttons */}
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isPending}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition disabled:opacity-50"
              >
                Hủy
              </button>
              <button
                type="submit"
                disabled={disableSubmit}
                className="inline-flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-xl shadow hover:bg-emerald-500 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPending && <Loader2 className="animate-spin" size={18} />}
                Đăng bài
              </button>
            </div>
          </div>
        )}

        {/* Toggle button when not expanded */}
        {!isExpanded && (
          <div className="px-5 pb-4 flex justify-between items-center">
            <div className="flex gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-emerald-600 transition">
                <ImagePlus size={20} className="text-emerald-600" />
                <span>Ảnh</span>
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
