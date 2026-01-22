import ffmpeg from "fluent-ffmpeg"
import fs from "fs"
import path from "path"

/**
 * Convert any video/audio file to MP3
 */
export function toMp3(input, output) {
  return new Promise((resolve, reject) => {
    ffmpeg(input)
      .audioBitrate(128)
      .save(output)
      .on("end", () => resolve(output))
      .on("error", reject)
  })
}

/**
 * Convert any video to WhatsApp-friendly MP4
 */
export function toVideo(input, output) {
  return new Promise((resolve, reject) => {
    ffmpeg(input)
      .outputOptions([
        "-preset veryfast",
        "-movflags +faststart",
        "-pix_fmt yuv420p"
      ])
      .save(output)
      .on("end", () => resolve(output))
      .on("error", reject)
  })
}

/**
 * Convert image/video to WEBP sticker
 */
export function toSticker(input, output) {
  return new Promise((resolve, reject) => {
    ffmpeg(input)
      .outputOptions([
        "-vcodec libwebp",
        "-vf scale=512:512:for
