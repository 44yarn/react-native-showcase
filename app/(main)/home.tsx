import { HomeScreen, useHomeStore } from '@/feature/home'
import { useRouter } from 'expo-router'
import { useEffect } from 'react'
import { BackHandler } from 'react-native'

export default function HomeRoute() {
  const effect = useHomeStore((s) => s.effect)
  const consumeEffect = useHomeStore((s) => s.consumeEffect)
  const onBack = useHomeStore((s) => s.onBack)
  const router = useRouter()

  useEffect(() => {
    if (effect?.type === 'navigateToLogin') {
      consumeEffect()
      router.replace('/(auth)/login')
    }
  }, [effect, consumeEffect, router])

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      onBack()
      return true
    })
    return () => subscription.remove()
  }, [onBack])

  return <HomeScreen />
}
