import { ref, reactive, watchEffect, Ref } from 'vue'
import { VimeoFoldersOptions } from './useVimeoFolders'
import { VimeoFolder } from './useVimeoFolders'

export interface VimeoVideo {
  name: string
  has_audio: boolean
  link: string
  embed: {
    html: string
  }
  uri: string
  play: {
    hls: {
      link: string
    }
  }
  resource_key: string
  metadata: {
    connections: {
      videos: {
        uri: string
      }
    }
    interactions: {}
  }
}

export function useVimeoVideos(options: VimeoFoldersOptions) {
  const folders: Ref<VimeoFolder[]> = ref([])
  const videos: Ref<VimeoVideo[]> = ref([])
  console.log('videos', videos)
  const filteredVideos: Ref<VimeoVideo[]> = ref([])
  const videoFilter: Ref<string> = ref('')
  const selectedVideo: Ref<VimeoVideo[]> = ref([])
  console.log(folders)
  const model = reactive({
    videos,
    filteredVideos,
    videoFilter,
    selectedVideo: '',
    vimeoHLS: '',
    vimeoMP4: '',
    vimeoMP4Mobile: '',
    isLoading: false,
  })

  async function fetchFromVimeo(
    endpoint: 'folders' | 'videos',
    videoURL: string | null,
    folderID: string | null,
    token: string,
    api: string,
    user_id: string,
  ): Promise<any> {
    const headers = {
      Authorization: `Bearer ${token}`,
    }

    try {
      let url
      switch (endpoint) {
        case 'videos':
          if (!videoURL) {
            throw new Error('Video URL is missing.')
          }
          url = `${api}${videoURL}`
          console.log('test', url)
          break
        default:
          throw new Error('Invalid endpoint')
      }
      const response = await fetch(url, {
        headers,
      })

      if (!response.ok) {
        throw new Error('Failed to fetch data from Vimeo API')
      }

      const data = await response
      return data.json()
    } catch (error) {
      console.error('Error fetching data from Vimeo API:', error)
      return Promise.reject(error)
    }
  }

  async function getVideosFromFolder(folder: VimeoFolder) {
    console.log('folder', folder)
    console.log('Running getVideosFROMFOLDER')
    if (folder) {
      try {
        model.isLoading = true // Set isLoading to true before making the API call
        const res = await fetchFromVimeo(
          'videos',
          folder.metadata.connections.videos.uri,
          folder.resource_key,
          options.token,
          options.api,
          options.userID,
        )

        if (res) {
          console.log('Results from fetched videos from folder', res)
          // res.data.map((video) => ({ ...video }))
          console.log('data', res.data)
          model.videos = res.data
          model.filteredVideos = res.data
          model.vimeoHLS = res.data[0]?.play.progressive[0]?.link
          model.vimeoMP4 =
            res[0]?.metadata?.interactions?.stream?.progressive[0]?.link
          model.vimeoMP4Mobile =
            res[0]?.metadata?.interactions?.stream?.progressive[1]?.link
        } else {
          model.videos = []
          model.filteredVideos = []
          model.selectedVideo = ''
          model.vimeoHLS = ''
          model.vimeoMP4 = ''
          model.vimeoMP4Mobile = ''
        }
        console.log('selectedVideo', model.selectedVideo)
      } catch (error) {
        console.error('Error loading videos from folder:', error)
      } finally {
        model.isLoading = false // Set isLoading to false after the API call is completed
      }
    }
  }

  function onSelectVideo(videoName: string, videoLink: string) {
    model.selectedVideo = videoName
    // model.selectedVideo.link = videoLink
    model.videoFilter = videoName
    console.log('-onSelectedVideo-', videoName)
  }

  // watchEffect(() => {
  //   model.filteredVideos = model.videos.filter((video) =>
  //     video.name.toLowerCase().includes(model.videoFilter.toLowerCase()),
  //   )
  // })

  return {
    folders, // Return folders
    model,
    getVideosFromFolder,
    onSelectVideo,
    isLoading: model.isLoading,
  }
}
