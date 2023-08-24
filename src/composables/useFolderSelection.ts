import { ref } from 'vue'
import { useVimeoFolders } from './useVimeoFolders'
import { useVimeoVideos, VimeoVideo } from './useVimeoVideos'
import { VimeoFolder } from './useVimeoFolders'

export function useFolderSelection() {
  const selectedFolder = ref<VimeoFolder | null>(null)
  const { getVideosFromFolder } = useVimeoVideos({
    folderIDs: '', // Add the folder IDs here as needed
    api: '',
    userID: '',
    token: '',
  })

  function onSelectedFolder(folder: VimeoFolder) {
    selectedFolder.value = folder
    getVideosFromFolder(folder)
  }

  return {
    selectedFolder,
    onSelectedFolder,
  }
}
