import { ShowcaseAlertDialog } from '@/core/ui/ShowcaseAlertDialog'
import { useIndicatorState } from '@/core/ui/indicatorState'
import { AppTheme } from '@/core/ui/theme'
import { useEffect } from 'react'
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native'
import { useLoginStore } from './useLoginStore'

export function LoginScreen() {
  const email = useLoginStore((s) => s.email)
  const password = useLoginStore((s) => s.password)
  const isPasswordVisible = useLoginStore((s) => s.isPasswordVisible)
  const error = useLoginStore((s) => s.error)
  const init = useLoginStore((s) => s.init)
  const updateEmail = useLoginStore((s) => s.updateEmail)
  const updatePassword = useLoginStore((s) => s.updatePassword)
  const togglePasswordVisibility = useLoginStore((s) => s.togglePasswordVisibility)
  const setRandomEmail = useLoginStore((s) => s.setRandomEmail)
  const setDemoFailure = useLoginStore((s) => s.setDemoFailure)
  const navigateToInfo = useLoginStore((s) => s.navigateToInfo)
  const submit = useLoginStore((s) => s.submit)
  const isLoading = useIndicatorState((s) => s.isLoading)

  const isLoginEnabled = email.trim().length > 0 && password.trim().length > 0 && !isLoading

  useEffect(() => {
    init()
  }, [init])

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, styles.inputFlex]}
          placeholder="Email"
          value={email}
          onChangeText={updateEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!isLoading}
        />
        <TouchableOpacity style={styles.iconButton} onPress={setRandomEmail} disabled={isLoading}>
          <Text style={styles.iconText}>🔄</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputRow}>
        <TextInput
          style={[styles.input, styles.inputFlex]}
          placeholder="Password"
          value={password}
          onChangeText={updatePassword}
          secureTextEntry={!isPasswordVisible}
          editable={!isLoading}
        />
        <TouchableOpacity
          style={styles.iconButton}
          onPress={togglePasswordVisibility}
          disabled={isLoading}
        >
          <Text style={styles.iconText}>{isPasswordVisible ? '🙈' : '👁'}</Text>
        </TouchableOpacity>
      </View>

      {error && <Text style={styles.error}>{error}</Text>}

      <TouchableOpacity
        style={[styles.primaryButton, !isLoginEnabled && styles.buttonDisabled]}
        onPress={submit}
        disabled={!isLoginEnabled}
      >
        <Text style={styles.primaryButtonText}>Sign In</Text>
      </TouchableOpacity>

      <View style={styles.secondaryButtons}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={setDemoFailure}
          disabled={isLoading}
        >
          <Text style={styles.secondaryButtonText}>Demo Failure</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={navigateToInfo}
          disabled={isLoading}
        >
          <Text style={styles.secondaryButtonText}>Information</Text>
        </TouchableOpacity>
      </View>

      {isLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={AppTheme.colors.primary} />
        </View>
      )}

      <ShowcaseAlertDialog />
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
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: AppTheme.spacing.md,
    gap: AppTheme.spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: AppTheme.colors.outline,
    borderRadius: AppTheme.borderRadius.md,
    padding: AppTheme.spacing.md,
    ...AppTheme.typography.bodyLarge,
    color: AppTheme.colors.onSurface,
  },
  inputFlex: {
    flex: 1,
  },
  iconButton: {
    padding: AppTheme.spacing.sm,
  },
  iconText: {
    fontSize: 24,
  },
  error: {
    ...AppTheme.typography.bodyMedium,
    color: AppTheme.colors.error,
    marginBottom: AppTheme.spacing.md,
  },
  primaryButton: {
    backgroundColor: AppTheme.colors.primary,
    padding: AppTheme.spacing.md,
    borderRadius: AppTheme.borderRadius.md,
    alignItems: 'center',
    marginBottom: AppTheme.spacing.md,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  primaryButtonText: {
    ...AppTheme.typography.labelLarge,
    color: AppTheme.colors.onPrimary,
  },
  secondaryButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: AppTheme.spacing.lg,
  },
  secondaryButton: {
    padding: AppTheme.spacing.sm,
  },
  secondaryButtonText: {
    ...AppTheme.typography.labelLarge,
    color: AppTheme.colors.primary,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
