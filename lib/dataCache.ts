// Lib Data Cache

type CACHE_TAG =
  | "users"
  | "job-order-list"
  | "job-orders"
  | "custom-stickers"

export function getGlobalTag(tag: CACHE_TAG) {
  return `global:${tag}` as const
}

export function getIdTag(tag: CACHE_TAG, id: string) {
  return `id:${id}-${tag}` as const
}

export function getUserTag(tag: CACHE_TAG, userId: string) {
  return `user:${userId}-${tag}` as const
}