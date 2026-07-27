/** Tokens visuais compartilhados do SisCob, extraídos da interface existente. */
export const uiTokens = {
  spacing: { xs: "0.5rem", sm: "0.75rem", md: "1rem", lg: "1.5rem", xl: "2rem" },
  radius: { sm: "0.5rem", md: "0.75rem", lg: "1rem", full: "9999px" },
  shadow: { sm: "0 1px 2px rgb(15 23 42 / 0.05)", xl: "0 20px 25px rgb(15 23 42 / 0.1)" },
  color: {
    primary: "#1d4ed8",
    background: "#f1f5f9",
    foreground: "#0f172a",
    border: "#e2e8f0",
    success: "#047857",
    warning: "#b45309",
    danger: "#b91c1c",
  },
  typography: {
    body: "Arial, Helvetica, sans-serif",
    pageTitle: "text-2xl font-bold tracking-tight sm:text-3xl",
    sectionTitle: "text-sm font-semibold",
  },
} as const;
