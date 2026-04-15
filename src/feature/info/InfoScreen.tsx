import { AppTheme } from '@/core/ui/theme'
import { StyleSheet, Text, View } from 'react-native'

const INFO_ITEMS = [
  { label: 'Architecture', value: 'Feature-based, Store pattern' },
  { label: 'UI', value: 'React Native + Expo' },
  { label: 'State', value: 'Zustand' },
  { label: 'Navigation', value: 'Expo Router (file-based)' },
  { label: 'Async', value: 'Promise + async/await' },
  { label: 'Storage', value: 'SecureStore' },
] as const

export function InfoScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>React Native Showcase</Text>
      <Text style={styles.description}>
        This app demonstrates React Native architecture patterns including Expo Router, Zustand
        state management, and various UI feedback mechanisms.
      </Text>
      <View style={styles.card}>
        {INFO_ITEMS.map((item) => (
          <View key={item.label} style={styles.row}>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.value}>{item.value}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: AppTheme.spacing.lg,
    backgroundColor: AppTheme.colors.background,
  },
  title: {
    ...AppTheme.typography.headlineLarge,
    color: AppTheme.colors.onBackground,
    marginBottom: AppTheme.spacing.md,
    marginTop: AppTheme.spacing.xl,
  },
  description: {
    ...AppTheme.typography.bodyLarge,
    color: AppTheme.colors.onSurfaceVariant,
    marginBottom: AppTheme.spacing.xl,
    lineHeight: 24,
  },
  card: {
    backgroundColor: AppTheme.colors.surface,
    borderRadius: AppTheme.borderRadius.lg,
    padding: AppTheme.spacing.md,
    borderWidth: 1,
    borderColor: AppTheme.colors.outline,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: AppTheme.spacing.sm,
  },
  label: {
    ...AppTheme.typography.bodyLarge,
    color: AppTheme.colors.onSurface,
    fontWeight: '600',
  },
  value: {
    ...AppTheme.typography.bodyMedium,
    color: AppTheme.colors.onSurfaceVariant,
  },
})
