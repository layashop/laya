// Base values
const bBreakpoints = [
  `480px`,
  `680px`, // 40rem
  `768px`, // 56rem
  `1280px`, // 80rem
  `1480px`, // 80rem
]

const bColors = {
  transparent: "transparent",
  black: "#000",
  white: "#fff",
  text: "#333",
  background: "#fff",
  buttonText: '#0051b5',
  buttonBg: '#eef'
}

const bFonts = {
  sans:
    '"Noto Sans", -apple-system, BlinkMacSystemFont,"Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"',
  serif: 'Georgia, Cambria, "Times New Roman", Times, serif',
  mono: 'Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  headings: "'Poppins', sans-serif",
}

const bFontSizes = {
  tiny: ".875rem",
  base: "1rem",
  lg: "1.125rem",
  xl: "1.25rem",
  "2xl": "1.5rem",
  "3xl": "2rem",
  "4xl": "2.25rem",
  "5xl": "3rem",
}

const bLineHeights = {
  none: "1",
  normal: "1.5",
  body: "1.625",
  heading: "1.25",
}

const bHeadings = {
  base: {
    fontFamily: "heading",
    fontWeight: "heading",
    lineHeight: "heading",
    my: "xsmall",
  },
  intro: {
    textTransform: "uppercase",
    mb: ["xsmall", null, "small"],
    mt: "xsmall",
    fontWeight: "normal",
    lineHeight: "normal",
  },
}
const bShadows = {
  default: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
}

const bTransitions = {
  bg: "color, background-color .2s ease-in-out",
  shadow: "box-shadow .4s ease-in-out",
  color: "color, border-color .4s",
}

export default {
  useCustomProperties: true,
  breakpoints: bBreakpoints,
  background: {
    default: {
      bg: "white",
      color: "black",
    },
    dark: {
      bg: "darkShade",
      color: "lightShade",
    },
    light: {
      bg: "lightShade",
      color: "darkShade",
    },
  },
  colors: {
    ...bColors,
  },
  fonts: {
    ...bFonts,
    body: bFonts.sans,
    heading: bFonts.headings,
    monospace: bFonts.mono,
  },
  fontWeights: {
    thin: "200",
    normal: "400",
    bold: "700",
    body: "400",
    heading: "700",
  },
  fontSizes: bFontSizes,
  lineHeights: bLineHeights,
  shadows: bShadows,
  transitions: bTransitions,
  container: {
    wrapper: {
      maxWidth: ["340px", "768px", "1024px", "1280px"],
      width: "100%",
      mx: "auto",
    },
  },
  grid: {
    default: {
      display: "flex",
      flexWrap: "wrap",
    },
    centered: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      textAlign: "center",
    },
    column: {
      display: "block",
    },
  },
  icons: {
    mobileMenu: {
      p: "tiny",
      fontSize: "5xl",
    },
    social: {
      mx: ["tiny", null, "small"],
      fontSize: "4xl",
    },
  },
  buttons: {
    primary: {
      color: "darkShade",
      bg: "primary",
      "&:hover": {
        backgroundColor: "secondary",
        color: "lightShade",
      },
    },
    secondary: {
      color: "background",
      bg: "secondary",
      "&:hover": {
        backgroundColor: "primary",
        color: "lightShade",
      },
    },
    light: {
      bg: "lightShade",
      color: "black",
      "&:hover": {
        backgroundColor: "darkShade",
        color: "white",
      },
    },
    dark: {
      bg: "darkShade",
      color: "white",
      "&:hover": {
        backgroundColor: "lightShade",
        color: "black",
      },
    },
    transparent: {
      border: "none",
      background: "none",
      "&:hover": {
        boxShadow: "none",
      },
    },
  },
  styles: {
    root: {
      fontFamily: "body",
      fontWeight: "body",
      lineHeight: "body",
    },
    a: {
      color: "link",
      textDecoration: "none",
      ":hover": {
        textDecoration: "underline",
      },
    },
    h1: {
      ...bHeadings.base,
      fontSize: ["4xl", null, "5xl"],
    },
    h2: {
      ...bHeadings.base,
      fontSize: ["2xl", null, "4xl"],
    },
    h3: {
      ...bHeadings.base,
      fontSize: ["xl", null, "3xl"],
    },
    h4: {
      ...bHeadings.base,
      fontSize: ["base", null, "2xl"],
    },
    h5: {
      ...bHeadings.base,
      fontSize: ["tiny", null, "base"],
    },
    h6: {
      ...bHeadings.base,
      fontSize: "tiny",
    },
  },
  text: {
    tiny: {
      fontSize: "tiny",
    },
    base: {
      fontSize: "base",
    },
    lg: {
      fontSize: "lg",
    },
    xl: {
      fontSize: "xl",
    },
    xxl: {
      fontSize: "2xl",
    },
  },
  space: {
    none: 0,
    tiny: "0.25rem", // 4px
    xsmall: "0.5rem", // 8px
    small: "1rem", // 16px
    medium: "2rem", // 32px
    large: "4rem", // 64px
    xlarge: "8rem", // 128px
  },
  images: {
    default: {
      maxWidth: "100%",
      width: "100%",
    },
    avatar: {
      borderRadius: "100%",
      width: "6rem",
      overflow: "hidden",
      mb: "xsmall",
    },
  },
}
