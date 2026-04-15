import { LoginScreen, useLoginStore } from '@/feature/login'
import { useRouter } from 'expo-router'
import { useEffect } from 'react'

export default function LoginRoute() {
  const effect = useLoginStore((s) => s.effect)
  const consumeEffect = useLoginStore((s) => s.consumeEffect)
  const router = useRouter()

  useEffect(() => {
    if (effect?.type === 'navigateToHome') {
      consumeEffect()
      router.replace('/(main)/home')
    } else if (effect?.type === 'navigateToInfo') {
      consumeEffect()
      router.push('/(main)/info')
    }
  }, [effect, consumeEffect, router])

  return <LoginScreen />
}
