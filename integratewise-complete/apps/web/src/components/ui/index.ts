/**
 * UI Components Index
 * Barrel exports for all UI utility components
 * Day 4: UI Polish + Integration
 */

// Skeleton Loaders
export {
  Skeleton,
  KPIBandSkeleton,
  TableSkeleton,
  CardGridSkeleton,
  ListItemSkeleton,
  ApprovalCardSkeleton,
  TimelineSkeleton,
  EntityHeaderSkeleton,
  DashboardSkeleton,
  PageSkeleton,
  KanbanSkeleton
} from './skeleton-loaders'

// Empty States
export {
  EmptyState,
  NoAccountsEmpty,
  NoContactsEmpty,
  NoDealsEmpty,
  NoTicketsEmpty,
  NoSignalsEmpty,
  NoSituationsEmpty,
  NoPendingApprovalsEmpty,
  NoExecutionsEmpty,
  NoActHistoryEmpty,
  NoAIMemoriesEmpty,
  NoInsightsEmpty,
  NoPoliciesEmpty,
  NoAuditLogsEmpty,
  NoSearchResultsEmpty,
  NoFilteredResultsEmpty,
  NoTimelineEventsEmpty,
  NoIntegrationsEmpty,
  NoNotificationsEmpty,
  NoDashboardDataEmpty,
  NoConversationsEmpty,
  NoGoalsEmpty,
  NoCustomSettingsEmpty
} from './empty-states'

// Error Boundaries
export {
  ErrorBoundary,
  ErrorFallback,
  InlineError,
  CardError,
  PageError,
  useAsyncState
} from './error-boundaries'
export type { ErrorType } from './error-boundaries'

// Responsive Components
export {
  // Hooks
  useMediaQuery,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useBreakpoint,
  useMobileNav,
  // Providers
  MobileNavProvider,
  // Components
  MobileHeader,
  MobileNavDrawer,
  CollapsibleSidebar,
  ResponsiveGrid,
  ResponsiveStack,
  ResponsiveShow,
  ResponsiveTable,
  BottomSheet,
  ActionRow,
  TouchButton,
  // Constants
  breakpoints
} from './responsive'

// Tabs
export { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs'

// Select
export {
  Select,
  SelectGroup,
  SelectValue,
  SelectTrigger,
  SelectContent,
  SelectLabel,
  SelectItem,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from './select'
export { Switch } from "./switch"
export { Textarea } from "./textarea"
