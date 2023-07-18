import { ref } from 'vue';

export function useFolderSelection() {
  const selectedFolder = ref('');

  function onSelectFolder(folderName: string) {
    selectedFolder.value = folderName;
  }

  return {
    selectedFolder,
    onSelectFolder,
  };
}