<script setup lang="ts">
import { useFieldPlugin } from '../useFieldPlugin'
import { ref, watch, watchEffect, reactive, onMounted, computed } from 'vue'
import { useVimeoFolders } from '../composables/useVimeoFolders'
import { useVimeoVideos } from '../composables/useVimeoVideos'
import { useVideoPlayer } from '../composables/useVideoPlayer'
import { useSearchFilter } from '../composables/useSearchFilters'
import { useFolderSelection } from '../composables/useFolderSelection'
import { VimeoFolder } from '../composables/useVimeoFolders'
import { VimeoVideo } from '../composables/useVimeoVideos'
import { SbTextField } from '@storyblok/design-system'
import { SbToggle } from '@storyblok/design-system'
import { SbSelect } from '@storyblok/design-system'

const plugin = useFieldPlugin()

const hasAutoplay = ref(plugin.data.options.autoplay)
const hasControls = ref(plugin.data.options.controls)
const hasMute = ref(plugin.data.options.mute)

const token = plugin.data.options.token
const user_id = plugin.data.options.user_id
const folderIDs = plugin.data.options.folderIDs
const apiA = 'https://api.vimeo.com'

const { model: folderModel, onSelectFolder } = useVimeoFolders({
  folderIDs: folderIDs,
  api: apiA,
  userID: user_id,
  token: token,
})

const {
  model: videoModel,
  getVideosFromFolder,
  onSelectVideo,
  isLoading,
  selectedVideo,
} = useVimeoVideos({
  folderIDs: folderIDs,
  api: apiA,
  userID: user_id,
  token: token,
})

const { model: videoPlayerModel } = useVideoPlayer({
  hasMute: false,
  hasAutoplay: true,
  hasControls: true,
})

const MP4 = computed(() => {
  return videoModel.vimeoMP4
})
const HLS = computed(() => {
  return videoModel.vimeoHLS
})

const { filteredList: filteredFolders, filterText: folderFilter } =
  useSearchFilter<VimeoFolder>(folderModel.folders)

const { filteredList: filteredVideos, filterText: videoFilter } =
  useSearchFilter<VimeoVideo>(videoModel.videos)

const { selectedFolder, onSelectedFolder } = useFolderSelection()

watch(selectedFolder, () => {
  if (selectedFolder.value !== null) {
    getVideosFromFolder(selectedFolder.value)
  }
})
watch(folderFilter, (newVal) => {
  filteredFolders.value = folderModel.folders.filter((folder) =>
    folder.name.toLowerCase().includes(newVal.toLowerCase()),
  )
})
console.log(filteredFolders)

watch(videoFilter, (newVal) => {
  filteredVideos.value = videoModel.videos.filter((video) =>
    video.name.toLowerCase().includes(newVal.toLowerCase()),
  )
})

watchEffect(() => {
  plugin.actions.setContent({
    folders: {
      folderIDs: folderIDs,
      userID: user_id,
    },

    vimeoMP4: videoModel.vimeoMP4,
    vimeoHLS: videoModel.vimeoHLS,
    selectedVideo: selectedVideo.value,
    filteredVideos: filteredVideos.value.map((video) => ({ ...video })),

    videoPlayerModel: {
      hasMute: hasMute.value,
      hasAutoplay: hasAutoplay.value,
      hasControls: hasControls.value,
    },
    selectedFolder: selectedFolder.value,
    filteredFolders: filteredFolders.value.map((folder) => ({ ...folder })),
    folderFilter: folderFilter.value,
    videoFilter: videoFilter.value,
    searchFolderActive: false,
    searchVideoActive: false,
    isLoading,
  })
})
function toggleFolderSearchOn() {
  plugin.data.content.searchFolderActive = true
}

function toggleFolderSearchOff() {
  setTimeout(() => {
    plugin.data.content.searchFolderActive = false
  }, 130)
}
function toggleVideoSearchOn() {
  plugin.data.content.searchVideoActive = true
}

function toggleVideoSearchOff() {
  setTimeout(() => {
    plugin.data.content.searchVideoActive = false
  }, 300)
}

const isLoadingVideos = computed(() => videoModel.isLoading)
// folderOptions
const folderOptions = computed(() => {
  return filteredFolders.value.map((folder) => ({
    label: folder.name,
    value: folder,
  }))
})

const selectedFolderValue = ref<string | null>(null)

watch(selectedFolderValue, (newVal) => {
  console.log(newVal, selectedFolderValue)
  const folderExists = folderModel.folders.find(
    (folder) => folder.name === newVal,
  )

  if (folderExists !== null && folderExists) {
    onSelectedFolder(folderExists)
  }
})
// VideoOptions
const videoOptions = computed(() => {
  return videoModel.filteredVideos.map((video) => ({
    label: video.name,
    value: video,
  }))
})
const selectedVideoValue = ref<string | null>(null)

watch(selectedVideoValue, (newVal) => {
  console.log(newVal, selectedVideoValue)
  if (newVal !== null) {
    const videoExists = videoModel.videos.find((video) => video.name === newVal)
    if (videoExists !== null && videoExists) {
      onSelectVideo(videoExists)
    }
  }
})
</script>

<template>
  <div style="height: 500px">
    <div class="input-wrapper">
      <div v-if="folderModel.folders && folderModel.folders.length !== 0">
        <SbSelect
          v-model="selectedFolderValue"
          :filterable="folderFilter"
          :options="folderOptions.map((folder) => folder.label)"
          label="Choose folder"
          clearable
        />
      </div>

      <div v-if="selectedFolderValue">
        <SbSelect
          v-model="selectedVideoValue"
          :filterable="videoFilter"
          :options="videoOptions.map((video) => video.label)"
          label="Choose video"
          clearable
        />
      </div>
    </div>

    <div
      style="margin-top: 20px"
      v-if="videoModel.videos && selectedVideoValue && selectedFolderValue"
    >
      <video
        style="width: 100%; height: 200px"
        id="my-video"
        preload="auto"
        playsinline="true"
        :key="HLS || MP4"
        :autoplay="Boolean(hasAutoplay)"
        :muted="Boolean(hasMute)"
        :controls="Boolean(hasControls)"
      >
        <source
          :src="HLS"
          type="application/x-mpegURL"
        />
        <source
          type="video/mp4"
          :src="MP4"
        />
      </video>
      <div
        class="controls-wrapper"
        v-if="HLS || MP4"
      >
        <div class="flexRow">
          <SbToggle
            id="mute"
            class="sb-toggle__native"
            type="checkbox"
            v-model="hasMute"
          />
          <label class="toggleLabel">Mute</label>
        </div>

        <div class="flexRow">
          <SbToggle
            id="autoplay"
            class="sb-toggle__native"
            type="checkbox"
            v-model="hasAutoplay"
          />
          <label class="toggleLabel">Autoplay</label>
        </div>

        <div class="flexRow">
          <SbToggle
            id="controls"
            class="sb-toggle__native"
            type="checkbox"
            v-model="hasControls"
          />

          <label class="toggleLabel">Enable Controls</label>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.input-wrapper {
  display: grid;
  gap: 15px;
}
.controls-wrapper {
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.flexRow {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 15px;
}
ul {
  list-style: none;
  padding: 0 20px 20px 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}
a {
  font-size: 16px;
}
a:hover {
  cursor: pointer;
  font-weight: bold;
}
</style>
