const isProdMode = process.env.NODE_ENV === 'production';
export default {
    mode: 'production',
    mount: {
        'snowpack-public': '/',
        'src': '/src'
    },
    plugins: [
        '@snowpack/plugin-react-refresh'
    ],
    devOptions: {
        port: 1236,
        hmr: true
    },
    buildOptions: {
        out: 'dist-snowpack',
        sourcemap: !isProdMode
    },
};