import svgaUrl from './assets/boyBlue.svga?url'
import { Parser, Player } from 'svga'

const parser = new Parser()
const svga = await parser.load(svgaUrl)
const canvas = document.createElement('canvas')
document.getElementById('app')!.appendChild(canvas)
const player = new Player(canvas)
await player.mount(svga)
player.start()
