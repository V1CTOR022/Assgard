
const brand = {
  gold: "#F5C518",
  goldDim: "#C9A200",
  secondary: "#5856D6",
  success: "#34C759",
  warning: "#FF9500",
  error: "#FF3B30",
  white: "#FFFFFF",
  black: "#000000",
} as const;

export const authColors = {
  ...brand,
  background: "#FFFFFF",
  text: "#000000",
  muted: "#8A8A8A",
  border: "#CCCCCC",
  placeholder: "#9A9A9A",
  actionBg: "#000000",
  actionText: "#FFFFFF",
} as const;

export const appColors = {
  ...brand,
  background: "#0A0A0A",
  card: "#1A1A1A",
  cardBorder: "#2A2A2A",
  panel: "#111111",
  tabBar: "#1C1C1E",
  text: "#FFFFFF",
  muted: "#616161",
  mutedLight: "#9A9A9A",
  actionBg: "#FFFFFF",
  actionText: "#000000",

  ink: "#0C0D0F",
  cardGradient: ["#3D3E44", "#1B1C1F", "#08080A"],
  chrome: "#1B1C20",
  stroke: "#292A2F",
  dim: "#9C9CA4",

  surface: "#FFFFFF",
  surfaceText: "#0C0D0F",
  sub: "#94979F",
  hairline: "#F1F2F4",

  cardLight: "#FFFFFF",
  cardLightGradient: ["#FFFFFF", "#F4F5F7", "#E7E8EC"],
  chromeLight: "#F1F2F4",
  strokeLight: "#E2E3E7",
} as const;

export const brandColors = brand;
