// Uploader Helper Function - isUploadThing.ts
// lib\isUploadThingURL.ts

export function isUploadThingUrl(value: string) {
  try {
    const host = new URL(value).hostname
    return host.endsWith(".ufs.sh") || host === "utfs.io"
  } catch {
    return false
  }
}