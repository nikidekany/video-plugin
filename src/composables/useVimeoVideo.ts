import { ref, reactive, watchEffect, Ref } from 'vue';

interface VimeoVideo {
  name: string;
  // Add other properties based on the actual Vimeo video structure
}

export function useVimeoVideos() {
  const videos: Ref<VimeoVideo[]> = ref([]);
  const filteredVideos: Ref<VimeoVideo[]> = ref([]);
  const videoFilter: Ref<string> = ref('');

  const model = reactive({
    videos,
    filteredVideos,
    videoFilter,
    selectedVideo: '',
    vimeoHLS: '',
    vimeoMP4: '',
    vimeoMP4Mobile: '',
  });
  function fetchFromVimeo(endpoint: string, videoURL: string) {

    return new Promise<VimeoVideo>((resolve) => {
      setTimeout(() => {
        resolve({ name: 'Video 1' });
      }, 1000);
    });
  }

  function getVideosFromFolder(folderName: string) {
    // const found = model.folders.find((folder) => folder.name === folderName);
    // if (found) {
    //   fetchFromVimeo('videos', found.metadata.connections.videos.uri).then(
    //     (res) => {
    //       if (res.data && res.data.length === 1) {
    //         model.videos = [res.data[0]];
    //         onSelectVideo(res.data[0].name);
    //       } else {
    //         model.videos = res.data;
    //       }
    //     }
    //   );
    // }
  }

  function onSelectVideo(videoName: string) {
    model.selectedVideo = videoName;
    model.videoFilter = videoName;
  }

  watchEffect(() => {
    model.filteredVideos = model.videos.filter((video) =>
      video.name.toLowerCase().includes(model.videoFilter.toLowerCase())
    );
  });

  return {
    model,
    getVideosFromFolder,
    onSelectVideo,
  };
}