import { AppTheme, useAppColors } from '@/core/ui/theme'
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useDialogPresenter } from './dialogPresenter'

export function ShowcaseAlertDialog() {
  const colors = useAppColors()
  const dialogState = useDialogPresenter((s) => s.dialogState)
  const onPositive = useDialogPresenter((s) => s.onPositive)
  const onNegative = useDialogPresenter((s) => s.onNegative)
  const onDismiss = useDialogPresenter((s) => s.onDismiss)

  if (!dialogState) return null

  return (
    <Modal transparent animationType="fade" onRequestClose={onDismiss}>
      <Pressable style={styles.overlay} onPress={onDismiss}>
        <Pressable style={[styles.dialog, { backgroundColor: colors.surface }]}>
          {dialogState.title && (
            <Text style={[styles.title, { color: colors.onSurface }]}>{dialogState.title}</Text>
          )}
          {dialogState.message && (
            <Text style={[styles.message, { color: colors.onSurfaceVariant }]}>
              {dialogState.message}
            </Text>
          )}
          <View style={styles.buttons}>
            {dialogState.negativeButton && (
              <TouchableOpacity style={styles.button} onPress={onNegative}>
                <Text style={[styles.buttonText, { color: colors.primary }]}>
                  {dialogState.negativeButton}
                </Text>
              </TouchableOpacity>
            )}
            {dialogState.positiveButton && (
              <TouchableOpacity style={styles.button} onPress={onPositive}>
                <Text style={[styles.buttonText, { color: colors.primary }]}>
                  {dialogState.positiveButton}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: AppTheme.spacing.lg,
  },
  dialog: {
    borderRadius: AppTheme.borderRadius.xl,
    padding: AppTheme.spacing.lg,
    width: '100%',
    maxWidth: 360,
  },
  title: {
    ...AppTheme.typography.headlineMedium,
    marginBottom: AppTheme.spacing.md,
  },
  message: {
    ...AppTheme.typography.bodyLarge,
    marginBottom: AppTheme.spacing.lg,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: AppTheme.spacing.sm,
  },
  button: {
    paddingVertical: AppTheme.spacing.sm,
    paddingHorizontal: AppTheme.spacing.md,
  },
  buttonText: {
    ...AppTheme.typography.labelLarge,
  },
})
