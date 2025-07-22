// TypeScript global declaration for Calendly widget
declare global {
  interface CalendlyWidget {
    initPopupWidget: (options: { url: string }) => void;
  }
  interface Window {
    Calendly?: CalendlyWidget;
  }
}
// calendly.ts: Utility to open Calendly popup

export function openCalendlyPopup(url: string = "https://calendly.com/megicode") {
  if (typeof window === "undefined") return;
  // If Calendly script is not loaded, load it
  if (!document.getElementById("calendly-widget-script")) {
    const script = document.createElement("script");
    script.id = "calendly-widget-script";
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    document.body.appendChild(script);
    script.onload = () => {
      window.Calendly?.initPopupWidget && window.Calendly.initPopupWidget({ url });
    };
  } else {
    window.Calendly?.initPopupWidget && window.Calendly.initPopupWidget({ url });
  }
}
