<script setup lang="ts">
export interface Props {
  hls: string
  audio: string
}
defineProps<Props>()
</script>
<template>
  <video>
    <source
      :src="hls"
      type="application/x-mpegURL"
    />
    <source
      type="video/mp4"
      :src="audio"
    />
  </video>
</template>

<!-- 
  how to use the composables that I made
import { useVimeoFolders } from './useVimeoFolders';
import { useVimeoVideos } from './useVimeoVideos';
import { useVideoPlayer } from './useVideoPlayer';
import { useSearchFilter } from './useSearchFilter';
import { useFolderSelection } from './useFolderSelection';

export default {
  setup() {
    const { model: folderModel, onSelectFolder } = useVimeoFolders({
      singleFolderID: '12345',
    });

    const { model: videoModel, getVideosFromFolder, onSelectVideo } =
      useVimeoVideos();

    const { model: videoPlayerModel } = useVideoPlayer({
      canMute: true,
      canAutoplay: true,
      canControls: true,
    });

    const { filteredFolders, folderFilter } = useSearchFilter<VimeoFolder>(
      folderModel.folders
    );

    const { filteredVideos, videoFilter } = useSearchFilter<VimeoVideo>(
      videoModel.videos
    );

    const { selectedFolder } = useFolderSelection();

    // Use the above composables in your Vue template as needed
    // ...

    return {
      folderModel,
      onSelectFolder,
      videoModel,
      getVideosFromFolder,
      onSelectVideo,
      videoPlayerModel,
      filteredFolders,
      folderFilter,
      filteredVideos,
      videoFilter,
      selectedFolder,
    };
  },
}; -->
