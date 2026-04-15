import { useAppColors } from '@/core/ui/theme'
import { Stack } from 'expo-router'

export default function MainLayout() {
  const colors = useAppColors()

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: colors.surface },
        headerTintColor: colors.onSurface,
      }}
    />
  )
}
