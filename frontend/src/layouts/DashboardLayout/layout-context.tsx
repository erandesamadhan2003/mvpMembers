import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

interface LayoutContextValue {
  sidebarCollapsed: boolean
  mobileDrawerOpen: boolean
  toggleSidebar: () => void
  setMobileDrawerOpen: (open: boolean) => void
  closeMobileDrawer: () => void
}

const LayoutContext = createContext<LayoutContextValue | null>(null)

export function LayoutProvider({ children }: { children: ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false)

  const toggleSidebar = useCallback(() => {
    setSidebarCollapsed((prev) => !prev)
  }, [])

  const closeMobileDrawer = useCallback(() => {
    setMobileDrawerOpen(false)
  }, [])

  const value = useMemo(
    () => ({
      sidebarCollapsed,
      mobileDrawerOpen,
      toggleSidebar,
      setMobileDrawerOpen,
      closeMobileDrawer,
    }),
    [
      sidebarCollapsed,
      mobileDrawerOpen,
      toggleSidebar,
      closeMobileDrawer,
    ],
  )

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  )
}

export function useLayout() {
  const ctx = useContext(LayoutContext)
  if (!ctx) {
    throw new Error('useLayout must be used within LayoutProvider')
  }
  return ctx
}
