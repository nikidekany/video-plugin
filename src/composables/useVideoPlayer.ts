import { ref, reactive } from 'vue';

interface VideoPlayerOptions {
  canMute?: boolean;
  canAutoplay?: boolean;
  canControls?: boolean;
}

export function useVideoPlayer(options: VideoPlayerOptions) {
  const model = reactive({
    hasMute: true,
    hasAutoplay: true,
    hasControls: true,
  });

  return {
    model,
  };
}