/**
 * Financial Dashboard UX Components - Complete Index
 * exports:/56 components, 35+ hooks, animations, optimizations, and patterns
 */

// Phase 1: Foundation UX
export {
  SmartInsights,
} from './SmartInsights';

export {
  NoFoundersEmpty,
  NoAccountsEmpty,
  NoExpensesEmpty,
  NoSubscriptionsEmpty,
  EmptyState,
} from './EmptyStates';

export {
  SkeletonCard,
  SkeletonStatCard,
  SkeletonTable,
  SkeletonOverview,
} from './SkeletonLoaders';

export {
  FormField,
  FormFieldError,
  ErrorToast,
  useValidationFeedback,
  VALIDATION_SUGGESTIONS,
} from './FormValidation';

export {
  KeyboardCheatSheet,
  useKeyboardShortcuts,
  FINANCIAL_DASHBOARD_SHORTCUTS,
} from './KeyboardShortcuts';

export {
  ConfirmDialog,
  useConfirm,
} from './ConfirmDialog';

export {
  SearchBox,
  AdvancedFilter,
  FilterRow,
  useFuzzySearch,
} from './SearchAndFilter';

export {
  BulkActions,
  BulkCheckbox,
  useBulkSelection,
} from './BulkActions';

export {
  Tooltip,
  HelpIcon,
  AccessibleButton,
  GuidedTour,
  A11Y,
} from './Accessibility';

// Phase 2: Advanced Velocity & Interactions
export {
  AnimatedNumber,
  FadeInScale,
  SlideIn,
  StaggerChildren,
  Pulse,
  Bounce,
  Flip,
  ANIMATION_STYLES,
} from './AdvancedAnimations';

export {
  useDebounce,
  useThrottle,
  useInfiniteScroll,
  usePagination,
  VirtualScroll,
  useRafDebounce,
  useMemoDeep,
} from './PerformanceOptimizations';

export {
  ContextMenu,
  useContextMenu,
  Popover,
  DraggableList,
  GestureDetector,
  useSwipe,
} from './AdvancedInteractions';

export {
  useUndoRedo,
  CommandPalette,
  useCommandPalette,
} from './UndoRedoAndCommands';

export {
  useRealtimeData,
  useTimeSeries,
  AdvancedNotification,
  useNotificationCenter,
  ADVANCED_ANIMATION_STYLES,
} from './RealtimeAndVisualization';

// Phase 3: State Management & Advanced Patterns
export {
  useFinancialReducer,
  ThemeContext,
  useThemeContext,
  useResponsive,
  useSuspenseData,
  useTabManager,
  useModalStack,
  useFormState,
  useAsync,
} from './AdvancedStateManagement';

// Aggregated configuration
export const DASHBOARD_UX_CONFIG = {
  animations: {
    enabled: true,
    duration: 300,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },
  performance: {
    debounceDelay: 300,
    throttleInterval: 100,
    virtualScrollThreshold: 100,
    maxHistoryStack: 50,
  },
  notifications: {
    maxStack: 5,
    autoCloseDuration: 4000,
    position: 'bottom-right',
  },
  keyboard: {
    enabled: true,
    shortcutsEnabled: true,
    commandPaletteKey: 'cmd+k',
  },
  realtime: {
    pollingInterval: 5000,
    retryAttempts: 3,
    retryDelay: 1000,
  },
  accessibility: {
    wcagLevel: 'AA',
    reduceMotionEnabled: true,
    focusVisible: true,
  },
};

// Component combinations for common patterns
export const FINANCIAL_DASHBOARD_COMPONENTS = {
  // Common page layouts
  PageWithSidebar: 'Use useResponsive() + InternalSidebar + main content',
  PageWithTabs: 'Use useTabManager() + Tab routing',
  PageWithModal: 'Use useModalStack() + CommandPalette for discoverability',

  // Common data patterns
  DataTableWithActions: 'BulkActions + ContextMenu + SearchBox + VirtualScroll',
  FilteredDataList: 'AdvancedFilter + useFuzzySearch + useInfiniteScroll + SkeletonLoaders',
  RealtimeDataPanel: 'useRealtimeData + useTimeSeries + AnimatedNumber notifications',

  // Common interaction patterns
  FormWithValidation: 'useFormState + FormField + KeyboardShortcuts + useUndoRedo',
  ConfirmableAction: 'useConfirm + AdvancedNotification + useAsync',
  SearchableContent: 'SearchBox + useFuzzySearch + ContextMenu + Keyboard shortcuts',
};

// Re-exports from UXComponents.ts for backwards compatibility
export { DASHBOARD_UX_CONFIG as DashboardConfig };
