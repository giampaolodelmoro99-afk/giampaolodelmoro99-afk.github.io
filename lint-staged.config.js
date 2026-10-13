export default {
  "*.{ts,tsx,js,mjs}": ["oxlint --type-aware --fix", "prettier --write"],
  "*.css": ["stylelint --fix", "prettier --write"],
  "*.{json,md,yml,yaml,html}": ["prettier --write"],
};
