import { useColorScheme } from 'react-native'

type AppColors = {
  primary: string
  onPrimary: string
  primaryContainer: string
  onPrimaryContainer: string
  surface: string
  onSurface: string
  onSurfaceVariant: string
  background: string
  onBackground: string
  error: string
  onError: string
  outline: string
}

const lightColors: AppColors = {
  primary: '#6750A4',
  onPrimary: '#FFFFFF',
  primaryContainer: '#EADDFF',
  onPrimaryContainer: '#21005D',
  surface: '#FFFBFE',
  onSurface: '#1C1B1F',
  onSurfaceVariant: '#49454F',
  background: '#FFFBFE',
  onBackground: '#1C1B1F',
  error: '#B3261E',
  onError: '#FFFFFF',
  outline: '#79747E',
}

const darkColors: AppColors = {
  primary: '#D0BCFF',
  onPrimary: '#381E72',
  primaryContainer: '#4F378B',
  onPrimaryContainer: '#EADDFF',
  surface: '#1C1B1F',
  onSurface: '#E6E1E5',
  onSurfaceVariant: '#CAC4D0',
  background: '#1C1B1F',
  onBackground: '#E6E1E5',
  error: '#F2B8B5',
  onError: '#601410',
  outline: '#938F99',
}

export const AppTheme = {
  colors: lightColors,
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  typography: {
    headlineLarge: { fontSize: 32, fontWeight: '700' as const },
    headlineMedium: { fontSize: 28, fontWeight: '600' as const },
    bodyLarge: { fontSize: 16, fontWeight: '400' as const },
    bodyMedium: { fontSize: 14, fontWeight: '400' as const },
    labelLarge: { fontSize: 14, fontWeight: '500' as const },
    labelMedium: { fontSize: 12, fontWeight: '500' as const },
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
} as const

export type { AppColors }

export function useAppColors(): AppColors {
  const scheme = useColorScheme()
  return scheme === 'dark' ? darkColors : lightColors
}
