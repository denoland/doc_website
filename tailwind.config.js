const defaultTheme = require("tailwindcss/defaultTheme"); // eslint-disable-line

module.exports = {
  purge: ["./components/**/*.tsx", "./pages/**/*.tsx"],
  theme: {
    fontFamily: {
      mono: [
        "Menlo",
        "Monaco",
        '"Lucida Console"',
        "Consolas",
        '"Liberation Mono"',
        '"Courier New"',
        "monospace",
      ],
    },
    inset: {
      "0": 0,
      auto: "auto",
      "16": "4rem",
      "20": "5rem",
      xs: "20rem",
    },
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
      padding: {
        xs: "20rem",
      },
      width: {
        xs: "20rem",
      },
      colors: {
        "light-black-950": "#080808",
        "light-black-900": "#111",
        "light-black-800": "#222",
        "light-black-700": "#333",
      },
    },
  },
  variants: {
    backgroundColor: [
      "responsive",
      "hover",
      "focus",
      "active",
      "dark",
      "dark:hover",
      "dark:focus",
      "dark:active",
    ],
    borderColor: [
      "responsive",
      "hover",
      "focus",
      "dark",
      "dark:hover",
      "dark:focus",
    ],
    placeholderColor: [
      "responsive",
      "hover",
      "focus",
      "dark",
      "dark:hover",
      "dark:focus",
    ],
    textColor: [
      "responsive",
      "hover",
      "focus",
      "group-hover",
      "dark",
      "dark:hover",
      "dark:focus",
      "dark:group-hover",
      "focus-within",
      "dark:focus-within",
      "dark:odd",
      "dark:even",
      "dark:active",
      "dark:disabled",
    ],
    borderStyle: ["responsive", "dark"],
  },
  plugins: [
    require("@tailwindcss/ui"),
    require("tailwindcss-prefers-dark-mode")(),
  ],
};
