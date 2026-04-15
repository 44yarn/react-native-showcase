import { t } from '@/core/i18n'
import { ShowcaseAlertDialog } from '@/core/ui/ShowcaseAlertDialog'
import { useIndicatorState } from '@/core/ui/indicatorState'
import { AppTheme, useAppColors } from '@/core/ui/theme'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
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
  const colors = useAppColors()
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
  const cancelLogin = useLoginStore((s) => s.cancelLogin)
  const navigateToInfo = useLoginStore((s) => s.navigateToInfo)
  const isLoginEnabled = useLoginStore((s) => s.isLoginEnabled)
  const submit = useLoginStore((s) => s.submit)
  const isLoading = useIndicatorState((s) => s.isLoading)

  useEffect(() => {
    init()
  }, [init])

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.appTitle, { color: colors.primary }]}>{t('app.title')}</Text>
      <Text style={[styles.title, { color: colors.onBackground }]}>{t('login.title')}</Text>

      <View style={[styles.inputContainer, { borderColor: colors.outline }]}>
        <TextInput
          style={[styles.input, { color: colors.onSurface }]}
          placeholder={t('login.email')}
          placeholderTextColor={colors.onSurfaceVariant}
          value={email}
          onChangeText={updateEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!isLoading}
        />
        <TouchableOpacity style={styles.trailingIcon} onPress={setRandomEmail} disabled={isLoading}>
          <MaterialCommunityIcons name="refresh" size={24} color={colors.onSurfaceVariant} />
        </TouchableOpacity>
      </View>

      <View style={[styles.inputContainer, { borderColor: colors.outline }]}>
        <TextInput
          style={[styles.input, { color: colors.onSurface }]}
          placeholder={t('login.password')}
          placeholderTextColor={colors.onSurfaceVariant}
          value={password}
          onChangeText={updatePassword}
          secureTextEntry={!isPasswordVisible}
          editable={!isLoading}
        />
        <TouchableOpacity
          style={styles.trailingIcon}
          onPress={togglePasswordVisibility}
          disabled={isLoading}
        >
          <MaterialCommunityIcons
            name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
            size={24}
            color={colors.onSurfaceVariant}
          />
        </TouchableOpacity>
      </View>

      {error && <Text style={[styles.error, { color: colors.error }]}>{error}</Text>}

      <TouchableOpacity
        style={[
          styles.primaryButton,
          { backgroundColor: colors.primary },
          !isLoginEnabled && styles.buttonDisabled,
        ]}
        onPress={submit}
        disabled={!isLoginEnabled}
      >
        <Text style={[styles.primaryButtonText, { color: colors.onPrimary }]}>
          {t('login.login')}
        </Text>
      </TouchableOpacity>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={[
            styles.outlinedButton,
            { borderColor: colors.outline },
            isLoading && styles.buttonDisabled,
          ]}
          onPress={setDemoFailure}
          disabled={isLoading}
        >
          <Text style={[styles.outlinedButtonText, { color: colors.primary }]}>
            {t('login.loginFail')}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.outlinedButton,
            { borderColor: colors.outline },
            !isLoading && styles.buttonDisabled,
          ]}
          onPress={cancelLogin}
          disabled={!isLoading}
        >
          <Text style={[styles.outlinedButtonText, { color: colors.primary }]}>
            {t('login.cancel')}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.textButton} onPress={navigateToInfo} disabled={isLoading}>
        <Text
          style={[
            styles.textButtonText,
            { color: colors.primary },
            isLoading && styles.buttonDisabled,
          ]}
        >
          {t('login.information')}
        </Text>
      </TouchableOpacity>

      {isLoading && (
        <ActivityIndicator style={styles.indicator} size="large" color={colors.primary} />
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
  },
  appTitle: {
    ...AppTheme.typography.labelLarge,
    textAlign: 'center',
    marginBottom: AppTheme.spacing.xs,
  },
  title: {
    ...AppTheme.typography.headlineLarge,
    marginBottom: AppTheme.spacing.xl,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: AppTheme.borderRadius.md,
    marginBottom: AppTheme.spacing.md,
  },
  input: {
    flex: 1,
    padding: AppTheme.spacing.md,
    ...AppTheme.typography.bodyLarge,
  },
  trailingIcon: {
    padding: AppTheme.spacing.sm,
    marginRight: AppTheme.spacing.xs,
  },
  error: {
    ...AppTheme.typography.bodyMedium,
    marginBottom: AppTheme.spacing.md,
  },
  primaryButton: {
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
  },
  buttonRow: {
    flexDirection: 'row',
    gap: AppTheme.spacing.sm,
    marginBottom: AppTheme.spacing.sm,
  },
  outlinedButton: {
    flex: 1,
    borderWidth: 1,
    borderRadius: AppTheme.borderRadius.md,
    padding: AppTheme.spacing.md,
    alignItems: 'center',
  },
  outlinedButtonText: {
    ...AppTheme.typography.labelLarge,
  },
  textButton: {
    padding: AppTheme.spacing.sm,
    alignItems: 'center',
  },
  textButtonText: {
    ...AppTheme.typography.labelLarge,
  },
  indicator: {
    marginTop: AppTheme.spacing.md,
  },
})
