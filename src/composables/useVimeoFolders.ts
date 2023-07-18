import { ref, reactive, watchEffect, Ref } from 'vue';

interface VimeoFolder {
  name: string;
  resource_key: string;
  metadata: object; 
}

interface VimeoFoldersOptions {
  singleFolderID?: string;
  folderIDs?: string;

}

export function useVimeoFolders(options: VimeoFoldersOptions) {
  const folders: Ref<VimeoFolder[]> = ref([]);
  const filteredFolders: Ref<VimeoFolder[]> = ref([]);
  const folderFilter: Ref<string> = ref('');

  const model = reactive({
    folders,
    filteredFolders,
    folderFilter,
    selectedFolder: '',
  });

  async function fetchFromVimeo(
    endpoint: 'folders' | 'videos',
  videoURL: string | null,
  folderID: string,
  token: string,
  api: string,
  userID: string
): Promise<any> {
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  try {
    let url;
    switch (endpoint) {
      case 'folders':
        url = `${api}users/${userID}/projects/${folderID}`;
        break;
      case 'videos':
        if (!videoURL) {
          throw new Error('Video URL is missing.');
        }
        url = `${api}${videoURL}`;
        break;
      default:
        throw new Error('Invalid endpoint');
    }

    const response = await fetch(url, {
      headers,
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data from Vimeo API');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data from Vimeo API:', error);
    return Promise.reject(error);
  }
  }

  function loadFolder(folderID: string) {
    fetchFromVimeo('folders', null, folderID).then((res) => {
      const { name, metadata, resource_key } = res;
      model.folders = [{ name, resource_key, metadata }];
      model.filteredFolders = [{ name, resource_key, metadata }];
      onSelectFolder(name);
    });
  }

  function loadAllFolders(folders: string[]) {
    model.folders = [];
    model.filteredFolders = [];
    for (let i = 0; i < folders.length; i++) {
      fetchFromVimeo('folders', null, folders[i]).then((res) => {
        const { name, metadata, resource_key } = res;
        model.folders.push({ name, resource_key, metadata });
        model.filteredFolders.push({ name, resource_key, metadata });
      });
    }
  }

  function onSelectFolder(folderName: string) {
    model.selectedFolder = folderName;
    model.folderFilter = folderName;
  }

  watchEffect(() => {
    model.filteredFolders = model.folders.filter((folder) =>
      folder.name.toLowerCase().includes(model.folderFilter.toLowerCase())
    );
  });

  // Call the loading method based on provided options
  if (options.singleFolderID !== undefined) {
    loadFolder(options.singleFolderID);
  } else if (options.folderIDs !== undefined) {
    loadAllFolders(options.folderIDs.split(','));
  }

  return {
    model,
    onSelectFolder,
  };
}