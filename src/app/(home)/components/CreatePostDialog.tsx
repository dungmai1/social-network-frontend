"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ImagePlus, Loader2, Upload, X } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCreatePost } from "@/hooks/useCreatePost";
import { buildFormData } from "@/lib/formdata";

const MAX_IMAGES = 5;

interface CreatePostDialogProps {
    trigger: React.ReactElement;
}

export default function CreatePostDialog({ trigger }: CreatePostDialogProps) {
    const [open, setOpen] = useState(false);
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
    };

    const handleOpenChange = (nextOpen: boolean) => {
        setOpen(nextOpen);
        if (!nextOpen) {
            resetForm();
        }
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
            if (combined.length > MAX_IMAGES) {
                setError(`Bạn chỉ có thể chọn tối đa ${MAX_IMAGES} ảnh.`);
            } else {
                setError(null);
            }
            return combined.slice(0, MAX_IMAGES);
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
            setError("Vui lòng chọn ít nhất một ảnh.");
            return;
        }
        setError(null);
        const formData = buildFormData({ content: caption.trim() }, selectedFiles);
        try {
            await submitPost(formData);
            setSuccessMessage("Bài viết đã được tạo thành công!");
            setTimeout(() => {
                handleOpenChange(false);
            }, 600);
        } catch (err) {
            setError("Không thể tạo bài viết. Vui lòng thử lại.");
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="max-w-2xl">
                <DialogHeader>
                    <DialogTitle>Tạo bài viết mới</DialogTitle>
                    <DialogDescription>
                        Chia sẻ khoảnh khắc của bạn với mọi người. Bạn có thể tải lên tối đa {MAX_IMAGES} ảnh.
                    </DialogDescription>
                </DialogHeader>
                <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-600">Nội dung</label>
                        <textarea
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            placeholder="Bạn đang nghĩ gì?"
                            rows={3}
                            className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-gray-400 focus:outline-hidden"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-600">Hình ảnh</label>
                        <div className="flex flex-col gap-3 rounded-2xl border-2 border-dashed border-gray-200 p-6 text-center">
                            <div className="flex flex-col items-center gap-2 text-gray-600">
                                <ImagePlus size={36} />
                                <p className="text-sm">Kéo thả hoặc chọn nhiều ảnh để tải lên.</p>
                                <p className="text-xs text-gray-400">Hỗ trợ PNG, JPG, JPEG, WEBP (tối đa {MAX_IMAGES} ảnh).</p>
                            </div>
                            <div>
                                <label
                                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-500 cursor-pointer"
                                >
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
                            {previewUrls.length > 0 && (
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                    {previewUrls.map((url, index) => (
                                        <div key={url} className="relative rounded-xl border border-gray-100 bg-gray-50 p-2">
                                            <img
                                                src={url}
                                                alt={`preview-${index}`}
                                                className="h-32 w-full rounded-lg object-cover"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveImage(index)}
                                                className="absolute right-2 top-2 rounded-full bg-white/80 p-1 text-gray-700 shadow hover:bg-white"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                    {error && <p className="text-sm text-red-500">{error}</p>}
                    {successMessage && <p className="text-sm text-emerald-600">{successMessage}</p>}
                    <DialogFooter>
                        <Button type="submit" disabled={disableSubmit} className="w-full sm:w-auto">
                            {isPending && <Loader2 className="animate-spin" size={18} />}
                            Đăng bài
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

