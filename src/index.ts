
import type { UnpluginFactory } from 'unplugin'
import { createUnplugin } from 'unplugin'
import type { Options } from './types'
import SvgaUtility from './utlis/svgaUtility'


export const unpluginFactory: UnpluginFactory<Options | undefined> = options => {
    const svgaUtility = new SvgaUtility(options as Options)
    const svgaReg = /\.svga$/;
    return {
        name: 'unplugin-compress-svga',
        enforce: 'post',
        vite: {
            async transformIndexHtml(html: any, ctx: any) {
                const { bundle } = ctx
                for (const key in bundle) {
                    if (svgaReg.test(key)) {
                        const { source, fileName } = bundle[key]
                        // 压缩svga
                        const { file } = await svgaUtility.compress(source.buffer) as any
                        ctx.bundle[fileName].source = Buffer.from(file)
                    }
                }
                return html
            }
        },
        webpack(compiler) { },
    }

}

export const unplugin = /* #__PURE__ */ createUnplugin(unpluginFactory)

export default unplugin