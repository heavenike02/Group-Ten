import { execSync } from "child_process";
import * as fs from "fs";

export function download_audio(
  channelUrl: string,
  downloads_folder: string
): boolean {
  const outputPath = `${downloads_folder}/%(title)s.%(ext)s`;

  if (!channelUrl || !downloads_folder) {
    console.error("❌ Error: Channel URL and downloads_folder are required.");
    return false;
  }

  if (!fs.existsSync(downloads_folder)) {
    fs.mkdirSync(downloads_folder, { recursive: true });
  }

  try {
    execSync("yt-dlp --version", { stdio: "ignore" });
  } catch (err) {
    console.error(
      "❌ Error: yt-dlp is not installed. Install it before running the script."
    );
    return false;
  }

  // console.log(`📥 Downloading audio from: ${channelUrl}`);
  // console.log(`📂 Saving to: ${downloads_folder}`);
  const command = `yt-dlp --extract-audio --audio-format wav -f bestaudio --playlist-items 1-5 -N 8 --match-filter "duration < 600" -o "${outputPath}" "${channelUrl}"`;
  // const command = `yt-dlp -f bestaudio --extract-audio --audio-format wav --playlist-items 1-2 -N 8 --download-sections "*0-500" -o "${outputPath}" "${channelUrl}"`;

  try {
    execSync(command, { stdio: "inherit" });
    // console.log("✅ Download complete!");
    return true;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`❌ Error: ${error.message}`);
    } else {
      console.error(`❌ Error: ${error}`);
    }
    return false;
  }
}
