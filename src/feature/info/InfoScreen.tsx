import { AppTheme } from '@/core/ui/theme'
import { StyleSheet, Text, View } from 'react-native'

export function InfoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Info</Text>
      <Text style={styles.body}>React Native Showcase</Text>
      <Text style={styles.label}>Architecture: Feature-based with Zustand</Text>
      <Text style={styles.label}>Framework: Expo + Expo Router</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: AppTheme.spacing.lg,
    backgroundColor: AppTheme.colors.background,
  },
  title: {
    ...AppTheme.typography.headlineLarge,
    color: AppTheme.colors.onBackground,
    marginBottom: AppTheme.spacing.lg,
  },
  body: {
    ...AppTheme.typography.bodyLarge,
    color: AppTheme.colors.onSurface,
    marginBottom: AppTheme.spacing.sm,
  },
  label: {
    ...AppTheme.typography.bodyMedium,
    color: AppTheme.colors.onSurfaceVariant,
    marginBottom: AppTheme.spacing.xs,
  },
})
