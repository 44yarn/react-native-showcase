import { useSessionStore } from '@/core/data/useSessionStore'
import { SnackbarView } from '@/core/ui/SnackbarView'
import { AppTheme, useAppColors } from '@/core/ui/theme'
import { useEffect } from 'react'
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native'
import { useHomeStore } from './useHomeStore'

export function HomeScreen() {
  const colors = useAppColors()
  const displayName = useSessionStore((s) => s.displayName)
  const isGuest = useSessionStore((s) => s.isGuest)
  const savedEmail = useHomeStore((s) => s.savedEmail)
  const isRememberEmail = useHomeStore((s) => s.isRememberEmail)
  const init = useHomeStore((s) => s.init)
  const toggleRememberEmail = useHomeStore((s) => s.toggleRememberEmail)
  const logout = useHomeStore((s) => s.logout)

  const screenTitle = isGuest ? 'Guest Home' : 'Home'

  useEffect(() => {
    init()
  }, [init])

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.onBackground }]}>{screenTitle}</Text>
      <Text style={[styles.welcome, { color: colors.onSurfaceVariant }]}>
        Hello, {displayName}!
      </Text>

      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.outline }]}>
        <View style={styles.row}>
          <Text style={[styles.label, { color: colors.onSurface }]}>Remember Email</Text>
          <Switch
            value={isRememberEmail}
            onValueChange={toggleRememberEmail}
            trackColor={{ true: colors.primary }}
          />
        </View>
        {savedEmail && (
          <View style={styles.row}>
            <Text style={[styles.label, { color: colors.onSurface }]}>Saved Email</Text>
            <Text style={[styles.value, { color: colors.onSurfaceVariant }]}>{savedEmail}</Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        style={[styles.logoutButton, { borderColor: colors.error }]}
        onPress={logout}
      >
        <Text style={[styles.logoutButtonText, { color: colors.error }]}>Logout</Text>
      </TouchableOpacity>

      <SnackbarView />
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
    marginBottom: AppTheme.spacing.sm,
    marginTop: AppTheme.spacing.xl,
  },
  welcome: {
    ...AppTheme.typography.bodyLarge,
    marginBottom: AppTheme.spacing.xl,
  },
  card: {
    borderRadius: AppTheme.borderRadius.lg,
    padding: AppTheme.spacing.md,
    marginBottom: AppTheme.spacing.xl,
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
  },
  value: {
    ...AppTheme.typography.bodyMedium,
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
