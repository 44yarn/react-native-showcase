import { useSessionStore } from '@/core/data/useSessionStore'
import { SnackbarView } from '@/core/ui/SnackbarView'
import { AppTheme } from '@/core/ui/theme'
import { useEffect } from 'react'
import { StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native'
import { useHomeStore } from './useHomeStore'

export function HomeScreen() {
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
    <View style={styles.container}>
      <Text style={styles.title}>{screenTitle}</Text>
      <Text style={styles.welcome}>Hello, {displayName}!</Text>

      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Remember Email</Text>
          <Switch
            value={isRememberEmail}
            onValueChange={toggleRememberEmail}
            trackColor={{ true: AppTheme.colors.primary }}
          />
        </View>
        {savedEmail && (
          <View style={styles.row}>
            <Text style={styles.label}>Saved Email</Text>
            <Text style={styles.value}>{savedEmail}</Text>
          </View>
        )}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>

      <SnackbarView />
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
    marginBottom: AppTheme.spacing.sm,
    marginTop: AppTheme.spacing.xl,
  },
  welcome: {
    ...AppTheme.typography.bodyLarge,
    color: AppTheme.colors.onSurfaceVariant,
    marginBottom: AppTheme.spacing.xl,
  },
  card: {
    backgroundColor: AppTheme.colors.surface,
    borderRadius: AppTheme.borderRadius.lg,
    padding: AppTheme.spacing.md,
    marginBottom: AppTheme.spacing.xl,
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
  },
  value: {
    ...AppTheme.typography.bodyMedium,
    color: AppTheme.colors.onSurfaceVariant,
  },
  logoutButton: {
    borderWidth: 1,
    borderColor: AppTheme.colors.error,
    borderRadius: AppTheme.borderRadius.md,
    padding: AppTheme.spacing.md,
    alignItems: 'center',
  },
  logoutButtonText: {
    ...AppTheme.typography.labelLarge,
    color: AppTheme.colors.error,
  },
})
