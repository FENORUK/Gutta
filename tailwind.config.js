/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx}", "./node_modules/flowbite/**/*.{js,ts}"],
    theme: {
        extend: {},
    },
    plugins: [require("flowbite/plugin")],
}
