import * as fs from "fs";
import * as pako from "pako";
import protobuf from "protobufjs";
import svgaProto from "./svgaProto.json";
import * as os from "os";
import pkg from 'zlibjs/bin/inflate.min.js';
import sharp, { Sharp } from 'sharp'
import { Options } from "../types";

const { Zlib } = pkg;
const QUALITY: number = 70;

const getVersion = (data: Uint8Array) => {
    const dataHeader = new Uint8Array(data, 0, 4)
    if (dataHeader[0] === 80 && dataHeader[1] === 75 && dataHeader[2] === 3 && dataHeader[3] === 4) {
        return 1
    }
    return 2
}

class SvgaUtility {
    private protoMovieEntity = protobuf.Root.fromJSON(svgaProto).lookupType("com.opensource.svga.MovieEntity");
    private options: Options = {}
    private async _parse(buffer: ArrayBuffer) {
        const inflateData = new Zlib.Inflate(new Uint8Array(buffer)).decompress()
        const movie = this.protoMovieEntity.decode(inflateData)
        return {
            movieEntity: movie
        };
    }

    constructor(options: Options) {
        this.options = options || {
            quality: QUALITY,
            palette: true,
        }
    }

    public async compress(buffer: ArrayBuffer) {
        const { movieEntity }: { movieEntity: any } = await this._parse(buffer);
        const dataHead = new Uint8Array(buffer, 0, 4)
        const version = getVersion(dataHead)
        if (version !== 2) {
            throw new Error('[unplugin-compress-svga] svga package version must is 2')
        }
        // Reducing concurrency should reduce the memory usage too.
        const divisor = process.env.NODE_ENV === "development" ? 4 : 2;
        sharp.concurrency(Math.floor(Math.max(os.cpus().length / divisor, 1)));
        const result: any = {};
        for (const [frame, buffer] of Object.entries(movieEntity.images)) {
            const input: Sharp = await sharp(buffer as Uint8Array);
            const optimizedBuffer = await input
                .png(this.options)
                .toBuffer();
            result[frame] = optimizedBuffer;
        }
        movieEntity.images = result;
        const file = pako.deflate(this.protoMovieEntity.encode(movieEntity).finish().buffer);

        return {
            parsedInfo: movieEntity,
            file,
        };
    }
}

export default SvgaUtility