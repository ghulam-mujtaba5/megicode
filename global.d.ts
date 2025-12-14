// Calendly widget global type
interface CalendlyWidget {
  initPopupWidget: (options: { url: string }) => void;
}
interface Window {
  Calendly?: CalendlyWidget;
}
// Add global type for Calendly widget
interface CalendlyWidget {
  initPopupWidget: (options: { url: string }) => void;
}
interface Window {
  Calendly?: CalendlyWidget;
}

// CSSStyleDeclaration extensions for modern CSS features
interface CSSStyleDeclaration {
  anchorName?: string;
  positionAnchor?: string;
  viewTransitionName?: string;
}

// HTMLElement extensions for Popover API
interface HTMLElement {
  popover?: 'auto' | 'manual' | '';
  showPopover?: () => void;
  hidePopover?: () => void;
  togglePopover?: () => boolean;
}

declare global {
  interface Window {
    __megicodeTheme?: string;
  }
}
export {};
