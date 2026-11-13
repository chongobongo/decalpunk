"use client"

import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import type { ImageMetadata } from "@/lib/getImageMetadata";
import { X } from "lucide-react";

export function Dropzone({
    value,
    onChange,
    meta,
}: {
    value: File | null;
    onChange: (file: File | null) => void;
    meta?: ImageMetadata | null;
}) {
    const [preview, setPreview] = useState<string | null>(null)

    useEffect(() => {
        if (!value) {
            setPreview(null);
            return;
        }
        const url = URL.createObjectURL(value);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [value]);

    const { getRootProps, getInputProps, isDragActive, isDragReject, isDragAccept } = useDropzone({
        accept: { "image/*": [] },
        maxFiles: 1,
        onDrop: (acceptedFiles) => {
            const file = acceptedFiles[0];
            if (file) onChange(file);
        },
    });

    function handleRemove(e: React.MouseEvent) {
        e.stopPropagation();
        onChange(null);
    }

    return (
  <div className="flex min-h-0 flex-1 items-center justify-center p-10">                {preview ? (
          <div className="relative flex min-h-0 w-full flex-1 items-center justify-center">
                       
                            <img
                                src={preview}
                                alt={value?.name ?? "Preview"}
                                className="w-full max-h-72 rounded-xl object-contain border-2 border-gray-300"
                            />
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="absolute top-2 right-2 flex items-center justify-center w-7 h-7 rounded-full bg-white/90 border border-gray-300 text-gray-600 hover:bg-white hover:text-red-600 transition-colors"
                                aria-label="Remove image"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        <p className="mt-2 text-sm font-medium text-gray-800 truncate" title={value?.name}>
                            {value?.name}
                        </p>
                        {meta && (
                            <p className="text-xs text-gray-500">
                                {meta.width && meta.height ? `${meta.width}×${meta.height}px · ` : ""}
                                {(meta.size / 1024).toFixed(0)} KB
                            </p>
                        )}
                    </div>
                ) : (
                <div
                    {...getRootProps()}
                    className={`flex flex-col items-center justify-center w-96 p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200
                        ${isDragActive ? 'scale-[1.02]' : 'scale-100'}
                        ${isDragReject ? 'border-red-500 bg-red-50 text-red-600' : ''}
                        ${isDragAccept ? 'border-green-500 bg-green-50 text-green-600' : ''}
                        ${!isDragActive ? 'border-gray-300 bg-gray-50 text-gray-500 hover:border-gray-400' : ''}
                    `}
                >
                    <input {...getInputProps()} />
                    <p className="text-sm font-medium">
                        {isDragReject && "Unsupported file type!"}
                        {isDragAccept && "Drop your images here!"}
                        {!isDragActive && "Drag & drop images here, or click to browse"}
                    </p>
                </div>
            )}
        </div>
    );
}