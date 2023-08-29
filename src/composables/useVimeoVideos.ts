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
  files: {
    quality: string
    rendition: string
    type: string
    width?: number
    height?: number
    link: string
    created_time: string
    fps: number
    size: number
    md5: any
    public_name: string
    size_short: string
  }[]
  play: {
    hls: {
      link: string
    }
    progressive: {
      [key: string]: {
        type: string
        codec: string
        width: number
        height: number
        link_expiration_time: string
        link: string
        created_time: string
        fps: number
        size: number
        md5: any
        rendition: string
      }
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

interface Model {
  videos: Ref<VimeoVideo[]>
  filteredVideos: Ref<VimeoVideo[]>
  videoFilter: Ref<string>
  selectedVideo: string
  vimeoHLS: string | undefined
  vimeoMP4: string | undefined
  vimeoMP4Mobile: string
  isLoading: boolean
}

export function useVimeoVideos(options: VimeoFoldersOptions) {
  const folders: Ref<VimeoFolder[]> = ref([])
  const videos: Ref<VimeoVideo[]> = ref([])
  console.log('videos', videos)
  const filteredVideos: Ref<VimeoVideo[]> = ref([])
  const videoFilter: Ref<string> = ref('')
  const selectedVideo: Ref<VimeoVideo | undefined> = ref()

  console.log(folders)

  const model = reactive<Model>({
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
          console.log('data', res.data)
          model.videos = res.data
        } else {
          model.videos = []
          model.filteredVideos = []
        }
      } catch (error) {
        console.error('Error loading videos from folder:', error)
      } finally {
        model.isLoading = false // Set isLoading to false after the API call is completed
      }
    }
  }

  function onSelectVideo(video: VimeoVideo) {
    console.log(video)
    selectedVideo.value = video

    let hlsLink = null
    let highestRenditionMP4Link = null

    // Find the HLS link
    if (video && video.play && video.play.hls) {
      hlsLink = video.play.hls.link
    }

    // Find the highest available rendition (1080p or 720p)
    let highestRendition = null
    for (const file of video.files) {
      if (file.rendition === '1080p' || file.rendition === '720p') {
        highestRendition = file
        break // Break once we find the first match
      }
    }

    if (highestRendition) {
      highestRenditionMP4Link = highestRendition.link
    }

    model.vimeoHLS = hlsLink ?? undefined
    model.vimeoMP4 = highestRenditionMP4Link ?? undefined

    // console.log('-onSelectedVideo-', video)
    // console.log('model', model)
    console.log('highestRenditionMP4Link', highestRenditionMP4Link)
    console.log('vimeoHLS', model.vimeoHLS)
    console.log('vimeoMP4', model.vimeoMP4)
  }

  watchEffect(() => {
    console.log('videoFilter', videoFilter)
    model.filteredVideos = model.videos.filter((video) =>
      video.name.toLowerCase().includes(model.videoFilter.toLowerCase()),
    )
    console.log('search')
  })

  return {
    folders,
    model,
    getVideosFromFolder,
    onSelectVideo,
    isLoading: model.isLoading,
    selectedVideo,
  }
}
