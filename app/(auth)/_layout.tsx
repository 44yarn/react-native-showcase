import { useAppColors } from '@/core/ui/theme'
import { Stack } from 'expo-router'

export default function AuthLayout() {
  const colors = useAppColors()

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
        animationDuration: 200,
      }}
    />
  )
}
