import { AppTheme } from '@/core/ui/theme'
import { StyleSheet, Text, View } from 'react-native'

export function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home</Text>
      <Text style={styles.body}>Welcome to React Native Showcase</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: AppTheme.colors.background,
  },
  title: {
    ...AppTheme.typography.headlineLarge,
    color: AppTheme.colors.onBackground,
    marginBottom: AppTheme.spacing.md,
  },
  body: {
    ...AppTheme.typography.bodyLarge,
    color: AppTheme.colors.onSurfaceVariant,
  },
})
