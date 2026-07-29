"use client"

import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { X } from "lucide-react";

export function Dropzone({
    value,
    onChange,
}: {
    value: File | null;
    onChange: (file: File | null) => void;
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
        <div className="flex flex-col items-center justify-center bg-amber-400">
            {preview ? (
                <div className="relative w-96">
                    <img
                        src={preview}
                        alt="Preview"
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