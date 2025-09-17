// Centralized logo paths for the project
// Single source of truth: unify all logo usages to the PWA icon
export const PWA_ICON = '/meta/megicode-logo1.svg';

// Map legacy/constants to the single icon to avoid broken refs after cleanup
export const LOGO_MAIN_LIGHT = PWA_ICON;
export const LOGO_MAIN_DARK = PWA_ICON;
export const LOGO_NAVBAR_LIGHT = PWA_ICON;
export const LOGO_NAVBAR_DARK = PWA_ICON;
export const LOGO_ICON = PWA_ICON;
export const LOGO_LEGACY = PWA_ICON;

export default {
  LOGO_MAIN_LIGHT,
  LOGO_MAIN_DARK,
  LOGO_NAVBAR_LIGHT,
  LOGO_NAVBAR_DARK,
  LOGO_ICON,
  LOGO_LEGACY,
  PWA_ICON,
};
