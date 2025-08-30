import { vars } from "nativewind"

export const baseTheme = {
  light: {
    "--bg-page": "#f3f3f3",
    "--bg-border": "#999999",
    "--bg-img": "#999999",
    "--bg-btn-default": "#2da24c",
    "--bg-btn-disabled": "#dddddd",
    "--bg-btn-active": "#2da24c",
    "--text-btn-default": "#f3f3f3",
    "--text-btn-disabled": "#999999",
    "--text-copy": "#1E1E1E",
    "--text-failure": "#ff88bd",
    "--text-headline": "#2da24c",
    "--text-success": "#2da24c",
  },
  dark: {
    "--bg-page": "#1E1E1E",
    "--bg-border": "#666666",
    "--bg-img": "#313131",
    "--bg-btn-default": "#31cb5a",
    "--bg-btn-disabled": "#313131",
    "--bg-btn-active": "#31cb5a",
    "--text-btn-default": "#212121",
    "--text-btn-disabled": "#666666",
    "--text-copy": "#f0f0f0",
    "--text-failure": "#ff88bd",
    "--text-headline": "#31cb5a",
    "--text-success": "#31cb5a",
  },
}

export const nativewindTheme = {
  light: vars(baseTheme.light),
  dark: vars(baseTheme.dark),
}
export default nativewindTheme
