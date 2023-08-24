import { ref, reactive, watchEffect, Ref } from 'vue'
import { VimeoFoldersOptions } from './useVimeoFolders'
import { VimeoFolder } from './useVimeoFolders'

export interface VimeoVideo {
  name: string
  resource_key: string
  metadata: {
    interactions: {
      stream: {
        hls: string
        progressive: {
          link: string
        }[]
      }
    }
  }
}

export function useVimeoVideos(options: VimeoFoldersOptions) {
  const folders: Ref<VimeoFolder[]> = ref([])
  const videos: Ref<VimeoVideo[]> = ref([])
  const filteredVideos: Ref<VimeoVideo[]> = ref([])
  const videoFilter: Ref<string> = ref('')
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
          url = `${api}/users/${user_id}/projects/${folderID}/videos`
          console.log(url)
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

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Error fetching data from Vimeo API:', error)
      return Promise.reject(error)
    }
  }

  async function getVideosFromFolder(folder: VimeoFolder) {
    const found = folders.value.find((folder) => folder.name === folder.name)
    console.log(found)
    console.log(folder)
    if (found) {
      try {
        model.isLoading = true // Set isLoading to true before making the API call
        const res = await fetchFromVimeo(
          'videos',
          found.metadata.connections.videos.uri,
          found.resource_key,
          options.token,
          options.api,
          options.userID,
        )
        if (res && res.length > 0) {
          model.videos = res
          model.filteredVideos = res
          model.selectedVideo = res[0]?.name || '' // Update the selectedVideo property
          model.vimeoHLS = res[0]?.metadata?.interactions?.stream?.hls
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
      } catch (error) {
        console.error('Error loading videos from folder:', error)
      } finally {
        model.isLoading = false // Set isLoading to false after the API call is completed
      }
    }
  }

  function onSelectVideo(videoName: string) {
    model.selectedVideo = videoName
    model.videoFilter = videoName
    console.log(model)
  }

  watchEffect(() => {
    model.filteredVideos = model.videos.filter((video) =>
      video.name.toLowerCase().includes(model.videoFilter.toLowerCase()),
    )
  })

  return {
    folders, // Return folders
    model,
    getVideosFromFolder,
    onSelectVideo,
    isLoading: model.isLoading,
  }
}
