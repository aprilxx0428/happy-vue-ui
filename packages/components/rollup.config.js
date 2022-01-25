import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import VuePlugin from 'rollup-plugin-vue'
import typescript from 'rollup-plugin-typescript2'
import tsconfig from './tsconfig.json'

export default {
    input: 'index.ts',
    output: [
        {
            file: 'dist/index.js',
            format: 'umd',
            name: 'components',
            globals: {
                axios: 'axios',
                'vue-property-decorator': 'vue-property-decorator',
                vue: 'Vue',
                '@belvoly-vue-aioa/tinymce': 'tinymce',
                'element-ui': 'element-ui'
            }
        },
        {
            file: 'dist/index.es.js',
            format: 'es',
            globals: {
                axios: 'axios',
                'vue-property-decorator': 'vue-property-decorator',
                vue: 'Vue',
                '@belvoly-vue-aioa/tinymce': 'tinymce',
                'element-ui': 'element-ui'
            }
        }
    ],
    //plugins: [VuePlugin({ styleInjector: '~' + 'vue-runtime-helpers/dist/inject-style/browser.js' }), commonjs(), typescript()],
    plugins: [
        nodeResolve(),
        typescript(tsconfig),
        VuePlugin({
            compileTemplate: true,
            styleInjector: '~' + 'vue-runtime-helpers/dist/inject-style/browser.js'
        }),
        commonjs()
    ],

    external: ['@belvoly-vue-aioa/m-core', '@belvoly-vue-aioa/bvant', '@belvoly-vue-aioa/tinymce', 'vue-property-decorator', 'element-ui/lib/theme-chalk/index.css', 'element-ui', 'axios', 'vue']
}
