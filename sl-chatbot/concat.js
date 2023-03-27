const concat = require("concat");
(async function build() {
  const files = [
    "./dist/sl-chatbot/runtime.js",
    "./dist/sl-chatbot/polyfills.js",
    "./dist/sl-chatbot/main.js",
  ];
  await concat(files, "./dist/sl-chatbot/micro-fe.js");
})();