import { defineConfig } from 'vite'
import Inspect from 'vite-plugin-inspect'
import Unplugin from '../../src/vite'

export default defineConfig({
    build: {
        target: ['chrome > 120']
    },
    plugins: [
        Inspect(),
        //@ts-ignore
        Unplugin({
            quality: 70,
            palette: true,
        }),
    ],
})