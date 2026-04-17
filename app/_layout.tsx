import { ShowcaseAlertDialog } from '@/core/ui/ShowcaseAlertDialog'
import { useAppColors } from '@/core/ui/theme'
import { Stack } from 'expo-router'
import * as SystemUI from 'expo-system-ui'
import { useEffect } from 'react'

export default function RootLayout() {
  const colors = useAppColors()

  useEffect(() => {
    SystemUI.setBackgroundColorAsync(colors.background)
  }, [colors.background])

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.background },
          animation: 'slide_from_right',
          animationDuration: 200,
        }}
      >
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(main)" />
      </Stack>
      <ShowcaseAlertDialog />
    </>
  )
}
