import { analyse_file } from "./analyse_file";
import { download_audio } from "./download_audio";
import fs from "fs-extra";
import path from "path";

export const process_channel = async (channel: string) : Promise<string | null> => {
  const DIRECTORY = path.resolve(__dirname, channel);

  const full_output: { [key: string]: any } = {};

  const download = await download_audio(
    "https://www.youtube.com/@" + channel,
    DIRECTORY
  );

  if (!download) {
    console.error("Error downloading audio.");
  }


  try {
    const files = await fs.readdir(DIRECTORY);
    const wavFiles = files.filter((file) => file.endsWith(".wav"));

    if (wavFiles.length === 0) {
      // console.log("No wav files found.");

      try {
        await fs.remove(DIRECTORY);
        // console.log(`Deleted directory: ${DIRECTORY}`);
      } catch (error: any) {
        console.error("Error deleting directory:", error.message);
      }

      return null;
    }

    const output = [];

    for (const file of wavFiles) {
      const filePath = path.join(DIRECTORY, file);

      // console.log(`Analysing: ${file}...`);

      output.push(
        analyse_file(filePath).then((analysis) => {
          if (analysis) {
            // // console.log(analysis);
            // console.log(`Saved analysis`);
            full_output[file.slice(0, -4)] = analysis;
          }
        })
      );
    }

    await Promise.all(output);
  } catch (error: any) {
    console.error("Error processing directory:", error.message);
  }

  // console.log("Analysis complete.");
  // // console.log(full_output);

  try {
    await fs.remove(DIRECTORY);
    // console.log(`Deleted directory: ${DIRECTORY}`);
  } catch (error: any) {
    console.error("Error deleting directory:", error.message);
  }

  return JSON.stringify(full_output);
};
