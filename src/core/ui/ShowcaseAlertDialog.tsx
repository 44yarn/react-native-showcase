import { AppTheme } from '@/core/ui/theme'
import { Modal, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useDialogPresenter } from './dialogPresenter'

export function ShowcaseAlertDialog() {
  const dialogState = useDialogPresenter((s) => s.dialogState)
  const onPositive = useDialogPresenter((s) => s.onPositive)
  const onNegative = useDialogPresenter((s) => s.onNegative)
  const onDismiss = useDialogPresenter((s) => s.onDismiss)

  if (!dialogState) return null

  return (
    <Modal transparent animationType="fade" onRequestClose={onDismiss}>
      <Pressable style={styles.overlay} onPress={onDismiss}>
        <Pressable style={styles.dialog}>
          {dialogState.title && <Text style={styles.title}>{dialogState.title}</Text>}
          {dialogState.message && <Text style={styles.message}>{dialogState.message}</Text>}
          <View style={styles.buttons}>
            {dialogState.negativeButton && (
              <TouchableOpacity style={styles.negativeButton} onPress={onNegative}>
                <Text style={styles.negativeButtonText}>{dialogState.negativeButton}</Text>
              </TouchableOpacity>
            )}
            {dialogState.positiveButton && (
              <TouchableOpacity style={styles.positiveButton} onPress={onPositive}>
                <Text style={styles.positiveButtonText}>{dialogState.positiveButton}</Text>
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
    backgroundColor: AppTheme.colors.surface,
    borderRadius: AppTheme.borderRadius.xl,
    padding: AppTheme.spacing.lg,
    width: '100%',
    maxWidth: 360,
  },
  title: {
    ...AppTheme.typography.headlineMedium,
    color: AppTheme.colors.onSurface,
    marginBottom: AppTheme.spacing.md,
  },
  message: {
    ...AppTheme.typography.bodyLarge,
    color: AppTheme.colors.onSurfaceVariant,
    marginBottom: AppTheme.spacing.lg,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: AppTheme.spacing.sm,
  },
  negativeButton: {
    paddingVertical: AppTheme.spacing.sm,
    paddingHorizontal: AppTheme.spacing.md,
  },
  negativeButtonText: {
    ...AppTheme.typography.labelLarge,
    color: AppTheme.colors.primary,
  },
  positiveButton: {
    paddingVertical: AppTheme.spacing.sm,
    paddingHorizontal: AppTheme.spacing.md,
  },
  positiveButtonText: {
    ...AppTheme.typography.labelLarge,
    color: AppTheme.colors.primary,
  },
})
