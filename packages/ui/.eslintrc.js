module.exports = {
  root: true,
  extends: ["plugin:vue/vue3-essential", "custom/vue"],
  "import/no-extraneous-dependencies": [
    "error",
    {
      devDependencies: false,
      optionalDependencies: false,
      peerDependencies: false,
    },
  ],
};
