import { useSessionStore } from '@/core/data/useSessionStore'
import { t } from '@/core/i18n'
import { SnackbarView } from '@/core/ui/SnackbarView'
import { useSnackbarPresenter } from '@/core/ui/snackbarPresenter'
import { AppTheme, useAppColors } from '@/core/ui/theme'
import { useEffect } from 'react'
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native'
import { useHomeStore } from './useHomeStore'

export function HomeScreen() {
  const colors = useAppColors()
  const displayName = useSessionStore((s) => s.displayName)
  const screenTitle = useHomeStore((s) => s.screenTitle)
  const savedEmail = useHomeStore((s) => s.savedEmail)
  const isRememberEmail = useHomeStore((s) => s.isRememberEmail)
  const init = useHomeStore((s) => s.init)
  const toggleRememberEmail = useHomeStore((s) => s.toggleRememberEmail)
  const logout = useHomeStore((s) => s.logout)

  useEffect(() => {
    init()
  }, [init])

  useEffect(() => {
    const timer = setTimeout(() => {
      useSnackbarPresenter.getState().show(t('home.welcome', { name: displayName }))
    }, 500)
    return () => clearTimeout(timer)
  }, [displayName])

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.onBackground }]}>{screenTitle}</Text>

        <Text style={[styles.greeting, { color: colors.onBackground }]}>
          {t('home.welcome', { name: displayName })}
        </Text>

        {savedEmail && (
          <Text style={[styles.savedEmail, { color: colors.outline }]}>{savedEmail}</Text>
        )}

        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.onBackground }]}>
            {t('home.rememberEmail')}
          </Text>
          <Switch
            value={isRememberEmail}
            onValueChange={toggleRememberEmail}
            trackColor={{ true: colors.primary }}
          />
        </View>

        <TouchableOpacity
          style={[styles.logoutButton, { borderColor: colors.outline }]}
          onPress={logout}
        >
          <Text style={[styles.logoutButtonText, { color: colors.primary }]}>
            {t('home.logout')}
          </Text>
        </TouchableOpacity>
      </View>

      <SnackbarView />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: AppTheme.spacing.lg,
    gap: AppTheme.spacing.md,
  },
  title: {
    ...AppTheme.typography.headlineMedium,
    textAlign: 'center',
  },
  greeting: {
    ...AppTheme.typography.bodyLarge,
    textAlign: 'center',
  },
  savedEmail: {
    ...AppTheme.typography.bodyMedium,
    textAlign: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: {
    ...AppTheme.typography.bodyLarge,
  },
  logoutButton: {
    borderWidth: 1,
    borderRadius: AppTheme.borderRadius.md,
    padding: AppTheme.spacing.md,
    alignItems: 'center',
  },
  logoutButtonText: {
    ...AppTheme.typography.labelLarge,
  },
})
