module.exports = {
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
      padding: {
        xs: "20rem",
      },
      width: {
        xs: "20rem",
      },
    },
  },
  variants: {
    backgroundColor: ["responsive", "hover", "focus", "active"],
  },
  plugins: [],
};
