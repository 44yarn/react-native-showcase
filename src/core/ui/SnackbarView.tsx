import { AppTheme, useAppColors } from '@/core/ui/theme'
import { useEffect, useRef } from 'react'
import { Animated, StyleSheet, Text, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { useSnackbarPresenter } from './snackbarPresenter'

export function SnackbarView() {
  const colors = useAppColors()
  const snackbarState = useSnackbarPresenter((s) => s.snackbarState)
  const insets = useSafeAreaInsets()
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
    <View style={[styles.container, { bottom: insets.bottom + AppTheme.spacing.lg }]}>
      <Animated.View
        style={[
          styles.snackbar,
          { backgroundColor: colors.onSurface, opacity, transform: [{ translateY }] },
        ]}
      >
        <Text style={[styles.message, { color: colors.surface }]}>{snackbarState.message}</Text>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: AppTheme.spacing.md,
    right: AppTheme.spacing.md,
  },
  snackbar: {
    borderRadius: AppTheme.borderRadius.md,
    padding: AppTheme.spacing.md,
  },
  message: {
    ...AppTheme.typography.bodyMedium,
  },
})
