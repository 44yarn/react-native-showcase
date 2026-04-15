import { useAppColors } from '@/core/ui/theme'
import { Stack } from 'expo-router'

export default function MainLayout() {
  const colors = useAppColors()

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.onSurface,
        contentStyle: { backgroundColor: colors.background },
        animation: 'slide_from_right',
        animationDuration: 200,
      }}
    />
  )
}
