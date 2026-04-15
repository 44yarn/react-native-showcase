import * as SecureStore from 'expo-secure-store'

export const PreferenceKey = {
  Auth: {
    SavedEmail: 'auth.saved_email',
    RememberEmail: 'auth.remember_email',
  },
} as const

export async function getOrNull<T>(key: string): Promise<T | undefined> {
  const raw = await SecureStore.getItemAsync(key)
  if (raw === null) return undefined
  return JSON.parse(raw) as T
}

export async function getOrDefault<T>(key: string, defaultValue: T): Promise<T> {
  const value = await getOrNull<T>(key)
  return value ?? defaultValue
}

export async function put<T>(key: string, value: T): Promise<void> {
  await SecureStore.setItemAsync(key, JSON.stringify(value))
}

export async function remove(key: string): Promise<void> {
  await SecureStore.deleteItemAsync(key)
}

export const preferenceStorage = { getOrNull, getOrDefault, put, remove }
