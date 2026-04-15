import { AppTheme, useAppColors } from '@/core/ui/theme'
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
  const colors = useAppColors()

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.onBackground }]}>React Native Showcase</Text>
      <Text style={[styles.description, { color: colors.onSurfaceVariant }]}>
        This app demonstrates React Native architecture patterns including Expo Router, Zustand
        state management, and various UI feedback mechanisms.
      </Text>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
        {INFO_ITEMS.map((item) => (
          <View key={item.label} style={styles.row}>
            <Text style={[styles.label, { color: colors.onSurface }]}>{item.label}</Text>
            <Text style={[styles.value, { color: colors.onSurfaceVariant }]}>{item.value}</Text>
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
  },
  title: {
    ...AppTheme.typography.headlineLarge,
    marginBottom: AppTheme.spacing.md,
    marginTop: AppTheme.spacing.xl,
  },
  description: {
    ...AppTheme.typography.bodyLarge,
    marginBottom: AppTheme.spacing.xl,
    lineHeight: 24,
  },
  card: {
    borderRadius: AppTheme.borderRadius.lg,
    padding: AppTheme.spacing.md,
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: AppTheme.spacing.sm,
  },
  label: {
    ...AppTheme.typography.bodyLarge,
    fontWeight: '600',
  },
  value: {
    ...AppTheme.typography.bodyMedium,
  },
})
