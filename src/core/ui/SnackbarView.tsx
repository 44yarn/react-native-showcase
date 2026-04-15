import { AppTheme } from '@/core/ui/theme'
import { useEffect, useRef } from 'react'
import { Animated, StyleSheet, Text, View } from 'react-native'
import { useSnackbarPresenter } from './snackbarPresenter'

export function SnackbarView() {
  const snackbarState = useSnackbarPresenter((s) => s.snackbarState)
  const opacity = useRef(new Animated.Value(0)).current
  const translateY = useRef(new Animated.Value(20)).current

  useEffect(() => {
    if (snackbarState) {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start()
    } else {
      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 150, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: 20, duration: 150, useNativeDriver: true }),
      ]).start()
    }
  }, [snackbarState, opacity, translateY])

  if (!snackbarState) return null

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.snackbar, { opacity, transform: [{ translateY }] }]}>
        <Text style={styles.message}>{snackbarState.message}</Text>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: AppTheme.spacing.lg,
    left: AppTheme.spacing.md,
    right: AppTheme.spacing.md,
  },
  snackbar: {
    backgroundColor: AppTheme.colors.onSurface,
    borderRadius: AppTheme.borderRadius.md,
    padding: AppTheme.spacing.md,
  },
  message: {
    ...AppTheme.typography.bodyMedium,
    color: AppTheme.colors.surface,
  },
})
