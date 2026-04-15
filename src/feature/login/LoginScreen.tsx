import { AppTheme } from '@/core/ui/theme'
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { useLoginStore } from './useLoginStore'

export function LoginScreen() {
  const email = useLoginStore((s) => s.email)
  const password = useLoginStore((s) => s.password)
  const isLoading = useLoginStore((s) => s.isLoading)
  const error = useLoginStore((s) => s.error)
  const updateEmail = useLoginStore((s) => s.updateEmail)
  const updatePassword = useLoginStore((s) => s.updatePassword)
  const submit = useLoginStore((s) => s.submit)

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={updateEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={updatePassword}
        secureTextEntry
      />

      {error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity
        style={[styles.button, isLoading && styles.buttonDisabled]}
        onPress={submit}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>{isLoading ? 'Loading...' : 'Sign In'}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: AppTheme.spacing.lg,
    backgroundColor: AppTheme.colors.background,
  },
  title: {
    ...AppTheme.typography.headlineLarge,
    color: AppTheme.colors.onBackground,
    marginBottom: AppTheme.spacing.xl,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: AppTheme.colors.outline,
    borderRadius: AppTheme.borderRadius.md,
    padding: AppTheme.spacing.md,
    marginBottom: AppTheme.spacing.md,
    ...AppTheme.typography.bodyLarge,
    color: AppTheme.colors.onSurface,
  },
  error: {
    ...AppTheme.typography.bodyMedium,
    color: AppTheme.colors.error,
    marginBottom: AppTheme.spacing.md,
  },
  button: {
    backgroundColor: AppTheme.colors.primary,
    padding: AppTheme.spacing.md,
    borderRadius: AppTheme.borderRadius.md,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    ...AppTheme.typography.labelLarge,
    color: AppTheme.colors.onPrimary,
  },
})
