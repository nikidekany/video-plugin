import { ref, reactive } from 'vue';

interface VideoPlayerOptions {
  canMute?: string;
  canAutoplay?: string;
  canControls?: string;
}

export function useVideoPlayer(options: VideoPlayerOptions) {
  const model = reactive({
    hasMute: "true",
    hasAutoplay: "true",
    hasControls: "true",
  });

  return {
    model,
  };
}