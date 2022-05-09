import { FFmpegKit } from "ffmpeg-kit-react-native";
import * as FileSystem from "expo-file-system";
import { v4 as uuid } from "uuid";
import { Platform } from "react-native";

export const capturePhoto = async ({
  setShortPressable,
  photo,
  imported,
  metadata,
  setVideoList,
  VideoList,
}) => {
  setShortPressable(false);
  let picType = "photo";
  if (imported) {
    picType = "photoImported";
  }
  console.log("infunc " + photo.path);
  const photoPath = photo;
  const photoID = uuid();
  const length = 2;
  let fileEnd = "mp4"; // check if this is right on android before releasing
  if (Platform.OS === "ios") {
    fileEnd = "mov";
  }

  const endingTag = "DayInTheLife/Today/" + photoID + "." + fileEnd;
  const newURI =
    FileSystem.documentDirectory +
    "DayInTheLife/Today/" +
    photoID +
    "." +
    fileEnd;
  const cacheURI = FileSystem.cacheDirectory + photoID + "." + fileEnd;
  const cacheURI2 = FileSystem.cacheDirectory + photoID + "000" + "." + fileEnd;
  console.log(metadata);
  console.log("META");

  if (!imported) {
    await FFmpegKit.execute(
      `-y -i ${photoPath} -vf "transpose=1" ${photoPath} -loglevel quiet`
    );
  }
  if (Platform.OS === "android") {
    if (metadata.metadata.Orientation != 6) {
      await FFmpegKit.execute(
        `-y -i ${photoPath} -vf "transpose=3" ${photoPath} -loglevel quiet`
      );
    }
    await FFmpegKit.execute(
      `-loop 1 -i ${photoPath} -c:v libx264 -t 2 -pix_fmt yuv420p -preset ultrafast -vf "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:-1:-1:color=white" ${cacheURI}`
    );
    await FFmpegKit.execute(
      ` -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=44100 -i ${cacheURI} -c:v copy -c:a mp3 -shortest -preset ultrafast -video_track_timescale 600 ${newURI}`
    );
    // await FFmpegKit.execute(
    //   `-i ${cacheURI2} -map 0:0 -map 0:1 -ac 2 -c:a mp3 -ar 48000 -vf format=yuv420p,scale=1080x1920,yadif  -c:v libx264 ${newURI}`
    // );
  } else if (Platform.OS === "ios") {
    await FFmpegKit.execute(
      `-framerate 1/2 -i ${photoPath} -c:v libx264 -t 2 -pix_fmt yuv420p -vf "scale=1080:1920:force_original_aspect_ratio=decrease,pad=1080:1920:-1:-1:color=black" ${cacheURI}`
    );
    await FFmpegKit.execute(
      ` -f lavfi -i anullsrc=channel_layout=stereo:sample_rate=44100 -i ${cacheURI} -c:v copy -c:a aac -shortest ${cacheURI2}`
    );

    await FFmpegKit.execute(
      `-i ${cacheURI2} -map 0:0 -map 0:1 -ac 2 -c:a aac -ar 48000 -vf format=yuv420p,scale=1080x1920,yadif -video_track_timescale 600 -c:v libx264 ${newURI}`
    );
  } else {
    throw console.error("err, not on ios or android");
  }

  console.log("aaa");
  // await FileSystem.deleteAsync(photoPath)
  setVideoList([...VideoList, { uri: endingTag, type: picType, duration: 2 }]);
  console.log(endingTag);

  setShortPressable(true);
};
