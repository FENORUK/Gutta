/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx}", "./node_modules/flowbite/**/*.{js,ts}"],
    theme: {
        extend: {},
    },
    variants: {
        extend: {
            display: ["group-hover"],
        },
    },
    plugins: [require("flowbite/plugin")],
}
