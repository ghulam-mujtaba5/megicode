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
}declare global {
  interface Window {
    __megicodeTheme?: string;
  }
}
export {};
