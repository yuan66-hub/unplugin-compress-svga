
# ✨ unplugin-compress-svga

## 📦 Install

```bash
npm add @yuanjianming/unplugin-compress-svga -D
```

## 💪 Basic Use

- vite.config.ts

```ts
import { defineConfig } from 'vite'
import compressSvga from '@yuanjianming/unplugin-compress-svga/vite'
export default defineConfig({
    //....
    plugins: [compressSvga({
      //   https://sharp.pixelplumbing.com/api-output#png
    })],
})
```



## 💪 Default Config

```ts
  //   https://sharp.pixelplumbing.com/api-output#png
{
            quality: 70,
            palette: true,       
}
```



