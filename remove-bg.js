/* eslint-disable @typescript-eslint/no-require-imports */

const { removeBackground } = require('@imgly/background-removal-node');
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const INPUT_FILE = 'teacher-kamran.jpeg';
const OUTPUT_FILE = 'teacher-kamran-cutout.png';

async function main() {
  const inputPath = path.resolve(__dirname, 'public', INPUT_FILE);
  const outputPath = path.resolve(__dirname, 'public', OUTPUT_FILE);
  
  console.log('Processing ' + inputPath + '...');
  
  try {
    const inputURL = pathToFileURL(inputPath).href;
    const blob = await removeBackground(inputURL);
    const buffer = Buffer.from(await blob.arrayBuffer());
    fs.writeFileSync(outputPath, buffer);
    console.log('Successfully saved cutout to ' + outputPath);
    const stats = fs.statSync(outputPath);
    console.log('File size: ' + stats.size + ' bytes');
  } catch (error) {
    console.error('Error during background removal:', error);
    process.exit(1);
  }
}

main();
