import { PreferenceKey, preferenceStorage } from '@/core/data/preferenceStorage'
import { useSessionStore } from '@/core/data/useSessionStore'
import { t } from '@/core/i18n'
import { useSnackbarPresenter } from '@/core/ui/snackbarPresenter'
import { create } from 'zustand'

export type HomeEffect = { type: 'navigateToLogin' }

type HomeState = {
  _initialized: boolean
  screenTitle: string
  savedEmail: string | undefined
  isRememberEmail: boolean
  effect: HomeEffect | undefined
}

type HomeActions = {
  init: () => Promise<void>
  toggleRememberEmail: () => Promise<void>
  onBack: () => void
  logout: () => void
  consumeEffect: () => void
}

export const useHomeStore = create<HomeState & HomeActions>((set, get) => ({
  _initialized: false,
  screenTitle: 'Home',
  savedEmail: undefined,
  isRememberEmail: true,
  effect: undefined,

  init: async () => {
    if (get()._initialized) return
    set({ _initialized: true })
    const { isGuest } = useSessionStore.getState()
    set({ screenTitle: isGuest ? t('home.guestTitle') : t('home.title') })
    const savedEmail = await preferenceStorage.getOrNull<string>(PreferenceKey.Auth.SavedEmail)
    const isRememberEmail = await preferenceStorage.getOrDefault(
      PreferenceKey.Auth.RememberEmail,
      true,
    )
    set({ savedEmail, isRememberEmail })
  },

  toggleRememberEmail: async () => {
    const next = !get().isRememberEmail
    set({ isRememberEmail: next })
    await preferenceStorage.put(PreferenceKey.Auth.RememberEmail, next)
    if (!next) {
      await preferenceStorage.remove(PreferenceKey.Auth.SavedEmail)
      set({ savedEmail: undefined })
    }
  },

  onBack: () => {
    useSnackbarPresenter.getState().show(t('home.backMessage'))
  },

  logout: () => {
    useSessionStore.getState().clearSession()
    set({ _initialized: false, effect: { type: 'navigateToLogin' } })
  },

  consumeEffect: () => set({ effect: undefined }),
}))
