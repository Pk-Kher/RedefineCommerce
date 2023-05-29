const plugin = require("tailwindcss/plugin");
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        secondary: "var(--color-secondary)",
        red: {
          // Sidebar = BG ACTIVE COLOR = var(--color-red-
          50: "var(--color-red-50)",
          100: "var(--color-red-100)",
          200: "var(--color-red-200)",
          300: "var(--color-red-300)",
          400: "var(--color-red-400)",
          500: "var(--color-red-500)",
          600: "var(--color-red-600)",
          700: "var(--color-red-700)",
          800: "var(--color-red-800)",
          900: "var(--color-red-900)",
        },
        indigo: {
          // Button = BG COLOR = var(--color-indigo-
          50: "var(--color-indigo-50)",
          100: "var(--color-indigo-100)",
          200: "var(--color-indigo-200)",
          300: "var(--color-indigo-300)",
          400: "var(--color-indigo-400)",
          500: "var(--color-indigo-500)",
          600: "var(--color-indigo-600)",
          700: "var(--color-indigo-700)",
          800: "var(--color-indigo-800)",
          900: "var(--color-indigo-900)",
        },
        lightwhite: "#F7F7FA",
        lightpurple: {
          // Sidebar = FONT COLOR = var(--color-lightpurple-
          50: "var(--color-lightpurple-50)",
          100: "var(--color-lightpurple-100)",
          200: "var(--color-lightpurple-200)",
          300: "var(--color-lightpurple-300)",
          400: "var(--color-lightpurple-400)",
          500: "var(--color-lightpurple-500)",
          600: "var(--color-lightpurple-600)",
          700: "var(--color-lightpurple-700)",
          800: "var(--color-lightpurple-800)",
          900: "var(--color-lightpurple-900)",
        },
        dimgray: {
          // Sidebar = FONT COLOR = var(--color-lightpurple-
          50: "var(--color-lightpurple-50)",
          100: "var(--color-lightpurple-100)",
          200: "var(--color-lightpurple-200)",
          300: "var(--color-lightpurple-300)",
          400: "var(--color-lightpurple-400)",
          500: "var(--color-lightpurple-500)",
          600: "var(--color-lightpurple-600)",
          700: "var(--color-lightpurple-700)",
          800: "var(--color-lightpurple-800)",
          900: "var(--color-lightpurple-900)",
        },
        sidebar: {
          // Sidebar -  BG COLOR - var(--color-sidebar-
          50: "var(--color-sidebar-50)",
          100: "var(--color-sidebarbar-100)",
          200: "var(--color-sidebarbar-200)",
          300: "var(--color-sidebarbar-300)",
          400: "var(--color-sidebarbar-400)",
          500: "var(--color-sidebarbar-500)",
          600: "var(--color-sidebarbar-600)",
          700: "var(--color-sidebarbar-700)",
          800: "var(--color-sidebarbar-800)",
          900: "var(--color-sidebarbar-900)",
        },
        sidebartext: {
          // Sidebar = Text ACTIVE COLOR = var(--color-sidebartext-
          50: "var(--color-sidebartext-50)",
          100: "var(--color-sidebartext-100)",
          200: "var(--color-sidebartext-200)",
          300: "var(--color-sidebartext-300)",
          400: "var(--color-sidebartext-400)",
          500: "var(--color-sidebartext-500)",
          600: "var(--color-sidebartext-600)",
          700: "var(--color-sidebartext-700)",
          800: "var(--color-sidebartext-800)",
          900: "var(--color-sidebartext-900)",
        },
        buttontext: {
          // Button = FONT COLOR = var(--color-buttontext-
          50: "var(--color-buttontext-50)",
          100: "var(--color-buttontext-100)",
          200: "var(--color-buttontext-200)",
          300: "var(--color-buttontext-300)",
          400: "var(--color-buttontext-400)",
          500: "var(--color-buttontext-500)",
          600: "var(--color-buttontext-600)",
          700: "var(--color-buttontext-700)",
          800: "var(--color-buttontext-800)",
          900: "var(--color-buttontext-900)",
        },
        gray: {
          // Color = PRIMARY = var(--color-gray-
          50: "var(--color-gray-50)",
          100: "var(--color-gray-100)",
          200: "var(--color-gray-200)",
          300: "var(--color-gray-300)",
          400: "var(--color-gray-400)",
          500: "var(--color-gray-500)",
          600: "var(--color-gray-600)",
          700: "var(--color-gray-700)",
          800: "var(--color-gray-800)",
          900: "var(--color-gray-900)",
        },
      },
      boxShadow: {
        DEFAULT:
          "0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px 0 rgba(0, 0, 0, 0.02)",
        md: "0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.02)",
        lg: "0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.01)",
        xl: "0 20px 25px -5px rgba(0, 0, 0, 0.08), 0 10px 10px -5px rgba(0, 0, 0, 0.01)",
        xxl: "10px 20px 40px 10px rgba(41, 41, 41, 0.15)",
        hb: "0px 25px 30px 10px rgba(0,0,0,0.06)",
      },
      outline: {
        blue: "2px solid rgba(0, 112, 244, 0.5)",
      },
      fontFamily: {
        inter: "var(--body-font)",
        title: "var(--title-font)",
      },
      fontSize: {
        sm: [
          "var(--sm-size)",
          {
            lineHeight: "var(--sm-lineHeight)",
            letterSpacing: "calc(var(--sm-letterSpacing) + 1px)",
          },
        ],
        title: [
          "var(--title-size)",
          {
            lineHeight: "var(--title-lineHeight)",
            letterSpacing: "calc(var(--title-letterSpacing) + 1px)",
          },
        ],
      },
      fontWeight: {
        sm: "var(--sm-fontWeight)",
        fontWeighttitle: "var(--title-fontWeight)",
      },
      logoImg: {
        logo: "var(--logo-img)",
      },
      screens: {
        xs: "480px",
      },
      borderWidth: {
        3: "3px",
      },
      minWidth: {
        36: "9rem",
        44: "11rem",
        56: "14rem",
        60: "15rem",
        72: "18rem",
        80: "20rem",
      },
      maxWidth: {
        "8xl": "88rem",
        "9xl": "96rem",
      },
      zIndex: {
        60: "60",
      },
    },
  },
  plugins: [
    // eslint-disable-next-line global-require
    require("tailwind-scrollbar"),
    // eslint-disable-next-line global-require
    require("@tailwindcss/forms"),
    // add custom variant for expanding sidebar
    plugin(({ addVariant, e }) => {
      addVariant("sidebar-expanded", ({ modifySelectors, separator }) => {
        modifySelectors(
          ({ className }) =>
            `.sidebar-expanded .${e(
              `sidebar-expanded${separator}${className}`
            )}`
        );
      });
    }),
  ],
  variants: {
    scrollbar: ["rounded"],
  },
};
