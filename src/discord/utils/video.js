var fs = require("fs");
var ffmpeg = require("ffmpeg");

/**
 * @param {string} url
 * @returns {boolean}
 */
const isVideo = (url) => {
  return url.match(/\.(mp4|mov|avi|wmv|flv|webm|mkv)$/) != null;
};

/**
 * @param {string} videoPath
 * @returns {string} Path to the thumbnail
 */
async function getFirstFrame(videoPath) {
  console.log("Extracting thumbnail from", videoPath);
  return new Promise(async (resolve, reject) => {
    try {
      var process = new ffmpeg(`images/${videoPath}`);
      const video = await process;
      video
        .fnExtractFrameToJPG("dist", {
          frame_rate: 1,
          number: 1,
          file_name: "thumbnail",
        })
        .then((values) => {
          if (values) {
            resolve({ thumbnail: "dist/thumbnail_1.jpg" });
          } else {
            reject("Thumbnail extraction failed");
          }
        });
    } catch (e) {
      reject(e);
    }
  });
}

async function addWatermark(watermark, videoPath) {
  console.log("Watermarking", videoPath);
  const extension = videoPath?.split(".")?.[1];
  const wmPath = `dist/watermarked.${extension}`;
  const returnValue = { watermarkedVideoPath: wmPath };

  // If there is any old watermarked video, delete it
  if (fs.existsSync(wmPath)) {
    console.log("Deleting old", videoPath);
    fs.unlinkSync(wmPath);
  }

  return new Promise(async (resolve, reject) => {
    try {
      var process = new ffmpeg(`./images/${videoPath}`);
      await process.then(function (video) {
        video
          .fnAddWatermark(watermark, wmPath, {
            position: "C",
          })
          .then(() => resolve(returnValue));
      });
      return returnValue;
    } catch (e) {
      reject(e);
    }
  });
}

module.exports = {
  isVideo,
  getFirstFrame,
  addWatermark,
};
