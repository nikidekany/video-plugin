import { ref } from 'vue'
import { VimeoFolder } from './useVimeoFolders'

export function useFolderSelection() {
  const selectedFolder = ref('')
  const folderS = ref<VimeoFolder | null>(null)

  function onSelectedFolder(folderName: string, folder: VimeoFolder) {
    selectedFolder.value = folderName
    folderS.value = folder
  }

  return {
    selectedFolder,
    onSelectedFolder,
  }
}
