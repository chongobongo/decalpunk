import Dropzone from "react-dropzone"
import { useDropzone } from 'react-dropzone';

export function SplashSlider() {

const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject
  } = useDropzone({
    accept: { 'image/*': [] }
  });

    return (
        <div className="flex items-center justify-center bg-amber-400">
      <div
      {...getRootProps()}
      className={`flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200
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
        </div>
    )
}