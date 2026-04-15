import type { Result } from '@/core/foundation/result'
import { runCatching } from '@/core/foundation/result'

export type User = {
  email: string
  displayName: string
}

export const ERROR_PASSWORD = 'error'

export const SAMPLE_EMAILS = [
  'demo@example.com',
  'alice@showcase.dev',
  'bob@showcase.dev',
  'charlie@showcase.dev',
  'test@example.com',
]

async function login(email: string, password: string): Promise<Result<User>> {
  return runCatching(async () => {
    await new Promise((resolve) => setTimeout(resolve, 1500))
    if (password === ERROR_PASSWORD) {
      throw new Error('Invalid credentials')
    }
    return { email, displayName: email.split('@')[0] }
  })
}

export const authRepository = { login }
