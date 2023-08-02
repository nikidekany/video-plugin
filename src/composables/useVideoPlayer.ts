import { ref, reactive } from 'vue'

export interface VideoPlayerOptions {
  hasMute?: boolean
  hasAutoplay?: boolean
  hasControls?: boolean
}

export function useVideoPlayer(options: VideoPlayerOptions) {
  const model = reactive({
    hasMute: false,
    hasAutoplay: true,
    hasControls: true,
  })

  return {
    model,
  }
}
