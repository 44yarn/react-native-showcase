import type { Result } from '@/core/foundation/result'
import { runCatching } from '@/core/foundation/result'

type User = {
  email: string
  name: string
}

async function login(email: string, _password: string): Promise<Result<User>> {
  return runCatching(async () => {
    // TODO: 実際の API 呼び出しに置き換え
    await new Promise((resolve) => setTimeout(resolve, 1000))
    if (email === 'error@example.com') {
      throw new Error('Invalid credentials')
    }
    return { email, name: 'Showcase User' }
  })
}

export const authRepository = { login }
