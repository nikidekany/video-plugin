import { ref } from 'vue'
import { VimeoFolder } from './useVimeoFolders'

export function useFolderSelection() {
  const selectedFolder = ref<VimeoFolder | null>(null)

  function onSelectedFolder(folder: VimeoFolder) {
    selectedFolder.value = folder
  }

  return {
    selectedFolder,
    onSelectedFolder,
  }
}
