import { useVideoPlayer, VideoView } from "expo-video";
import { useRef } from "react";
import { StyleSheet, View } from "react-native";
// Import the local video asset
import earthVideo from "../assets/video/earth.mp4";

export default function EarthVideo() {
  const ref = useRef(null);

  const player = useVideoPlayer(earthVideo, (player) => {
    player.loop = true;
    player.play();
  });

  return (
    <View style={styles.contentContainer}>
      <VideoView
        ref={ref}
        style={styles.video}
        player={player}
        contentFit="cover"
        nativeControls={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    padding: 0,
  },
  video: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  controlsContainer: {
    padding: 0,
  },
});
