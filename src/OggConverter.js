import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import { createWriteStream } from 'fs';
import axios from 'axios';
import ffmpeg from 'fluent-ffmpeg';
import installer from '@ffmpeg-installer/ffmpeg';
import { removeFile } from './utils.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export class OggConverter {
  constructor() {
    ffmpeg.setFfmpegPath(installer.path);
  };

  convertToMp3 = async (input, output) => {
    try {
      const outputPath = resolve(dirname(input), `${output}.mp3`);

      return new Promise((resolve, reject) => {
        ffmpeg(input)
        .inputOption(('-t 30'))
        .output(outputPath)
        .on('end', () => {
          removeFile(input);
          resolve(outputPath);
        })
        .on('error', (error) => reject(error.message))
        .run()
      });
    } catch (error) {
      console.log('Converter mp3 voice error');
    }
  };

   create = async (url, filename) => {
    try {
      const oggPath = resolve(__dirname, '../voices',`${filename}.ogg`);

      const response = await axios({
        method: 'get',
        url,
        responseType: 'stream'
      });

      return new Promise((resolve) => {
        const writableStream = createWriteStream(oggPath);
        
        response.data.pipe(writableStream);
        writableStream.on('finish', () => resolve(oggPath));
      });
    } catch (error) {
      console.log('Converter ogg voice error');
    }
  } 
}