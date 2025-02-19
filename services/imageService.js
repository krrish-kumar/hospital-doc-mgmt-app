const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function compressImage(filePath, outputDir) {
  try {
    // Generate output file path
    const outputFilePath = path.join(outputDir, path.basename(filePath));
    await sharp(filePath)
      .resize({ width: 1024 }) // resize to a max width of 1024px for example
      .jpeg({ quality: 80 })   // adjust quality for JPEG
      .toFile(outputFilePath);
    return outputFilePath;
  } catch (error) {
    throw error;
  }
}

module.exports = { compressImage };