import { t } from '@/core/i18n'
import { AppTheme, useAppColors } from '@/core/ui/theme'
import { StyleSheet, Text, View } from 'react-native'

const INFO_KEYS = [
  { label: 'info.architecture', value: 'info.architectureValue' },
  { label: 'info.ui', value: 'info.uiValue' },
  { label: 'info.state', value: 'info.stateValue' },
  { label: 'info.navigation', value: 'info.navigationValue' },
  { label: 'info.async', value: 'info.asyncValue' },
  { label: 'info.storage', value: 'info.storageValue' },
] as const

export function InfoScreen() {
  const colors = useAppColors()

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.onBackground }]}>{t('info.title')}</Text>
      <Text style={[styles.description, { color: colors.onSurfaceVariant }]}>
        {t('info.description')}
      </Text>
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
        {INFO_KEYS.map((item) => (
          <View key={item.label} style={styles.row}>
            <Text style={[styles.label, { color: colors.onSurface }]}>{t(item.label)}</Text>
            <Text style={[styles.value, { color: colors.onSurfaceVariant }]}>{t(item.value)}</Text>
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
