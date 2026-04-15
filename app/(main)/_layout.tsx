import { AppTheme } from '@/core/ui/theme'
import { Stack } from 'expo-router'

export default function MainLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: AppTheme.colors.surface },
        headerTintColor: AppTheme.colors.onSurface,
      }}
    />
  )
}
