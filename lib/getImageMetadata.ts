// Get Image Data

export type ImageMetadata = {
    name: string
    size: number
    type: string
    lastModified: number
    width: number | null
    height: number | null
}

export async function getImageMetadata(file: File): Promise<ImageMetadata> {
    const base = {
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
    }
    try {
        const bitmap = await createImageBitmap(file)
        const { width, height } = bitmap
        bitmap.close()
        return { ...base, width, height }
    } catch {
        // non-raster files (e.g. SVG/PDF) or unsupported formats
        return { ...base, width: null, height: null }
    }
}