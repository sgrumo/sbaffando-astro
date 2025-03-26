module.exports = {
    content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
    theme: {
        extend: {
            colors: {
                yellow: '#E7B545',
                'secondary-yellow': '#FFC93E',
                'tertiary-yellow': '#FFE49E',
                red: '#C1413C',
                green: '#1B4543',
                black: '#090B04',
                white: '#FFFEFB',
            },
            boxShadow: {
                '3xl': '0 0 40px 0 rgba(27, 69, 67, 0.2)',
            },
        },
    },
    plugins: [],
}
