import { ref, reactive, watchEffect, Ref } from 'vue'
import { useVimeoVideos, VimeoVideo } from './useVimeoVideos'
export interface VimeoFolder {
  name: string
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

export interface VimeoFoldersOptions {
  folderIDs?: string
  api: string
  userID: string
  token: string
}

export function useVimeoFolders(options: VimeoFoldersOptions) {
  const folders: Ref<VimeoFolder[]> = ref([])
  const filteredFolders: Ref<VimeoFolder[]> = ref([])
  const folderFilter: Ref<string> = ref('')
  const selectedFolder = ref<VimeoFolder | null>(null)

  const model = reactive({
    folders,
    filteredFolders,
    folderFilter,
    selectedFolder: '',
    filteredVideos: [] as VimeoVideo[],
    videoFilter: '',
    selectedVideo: '',
  })

  async function fetchFromVimeo(
    endpoint: 'folders' | 'videos',
    videoURL: string | null,
    folderID: string,
    token: string,
    api: string,
    user_id: string,
  ) {
    const headers = {
      Authorization: `Bearer ${token}`,
    }

    try {
      let url
      switch (endpoint) {
        case 'folders':
          url = `${api}/users/${user_id}/projects/${folderID}`
          // console.log(url)
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
  async function loadFolder(
    folderID: string,
    user_id: string,
    api: string,
    token: string,
  ) {
    try {
      const res = await fetchFromVimeo(
        'folders',
        null,
        folderID,
        token,
        api,
        user_id,
      )
      const { name, metadata, resource_key } = res
      folders.value = []
      model.folders.push({
        name,
        resource_key,
        metadata,
      })
      model.filteredFolders.push({
        name,
        resource_key,
        metadata,
      })
      onSelectFolder(name)
    } catch (error) {
      console.error('Error loading folder:', error)
    }
  }

  async function loadAllFolders(
    folders: string[],
    user_id: string,
    api: string,
    token: string,
  ) {
    model.folders = []
    model.filteredFolders = []
    for (let i = 0; i < folders.length; i++) {
      try {
        const res = await fetchFromVimeo(
          'folders',
          null,
          folders[i],
          token,
          api,
          user_id,
        )
        const { name, metadata, resource_key } = res
        model.folders.push({
          name,
          resource_key,
          metadata,
        })
        model.filteredFolders.push({
          name,
          resource_key,
          metadata,
        })
      } catch (error) {
        console.error('Error loading folder:', error)
      }
    }
  }
  const { getVideosFromFolder } = useVimeoVideos(options)

  function onSelectFolder(folder: VimeoFolder) {
    selectedFolder.value = folder
    getVideosFromFolder(folder)
  }
  watchEffect(() => {
    model.filteredFolders = model.folders.filter((folder) =>
      folder.name.toLowerCase().includes(model.folderFilter.toLowerCase()),
    )
    console.log('FILTEREDFOLDERS IN FOLDERS', filteredFolders)
  })

  // Call the loading method based on provided options

  if (options.folderIDs !== undefined && options.folderIDs.length > 1) {
    loadAllFolders(
      options.folderIDs.split(','),
      options.userID,
      options.api,
      options.token,
    )
  } else if (
    options.folderIDs !== undefined &&
    options.folderIDs.length === 1
  ) {
    loadFolder(options.folderIDs, options.userID, options.api, options.token)
  }
  return {
    model,
    onSelectFolder,
    getVideosFromFolder,
    filteredFolders: model.filteredFolders,
    videoFilter: model.videoFilter,
    selectedFolder: model.selectedFolder,
  }
}
