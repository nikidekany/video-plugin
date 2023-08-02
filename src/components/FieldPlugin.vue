<script setup lang="ts">
import VimeoPlayer from './VideoPlayer.vue'
import { useFieldPlugin } from '../useFieldPlugin'
import { ref, watch, watchEffect, reactive, onMounted, computed } from 'vue'
import { useVimeoFolders } from '../composables/useVimeoFolders'
import { useVimeoVideos } from '../composables/useVimeoVideos'
import { useVideoPlayer } from '../composables/useVideoPlayer'
import { useSearchFilter } from '../composables/useSearchFilters'
import { useFolderSelection } from '../composables/useFolderSelection'
import { VimeoFolder } from '../composables/useVimeoFolders'
import { VimeoVideo } from '../composables/useVimeoVideos'
const plugin = useFieldPlugin()
const hasAutoplay = ref(plugin.data.options.autoplay)
const hasControls = ref(plugin.data.options.controls)
const hasMute = ref(plugin.data.options.mute)

const token = plugin.data.options.token
const user_id = plugin.data.options.user_id
const folderIDs = plugin.data.options.folderIDs
const apiA = 'https://api.vimeo.com/'

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

const { filteredList: filteredFolders, filterText: folderFilter } =
  useSearchFilter<VimeoFolder>(folderModel.folders)

const { filteredList: filteredVideos, filterText: videoFilter } =
  useSearchFilter<VimeoVideo>(videoModel.videos)

const { selectedFolder, onSelectedFolder } = useFolderSelection()

// function getVideoSrc(): string {
//   if (!selectedFolder.value || !videoModel.selectedVideo) {
//     return ''
//   }
//   const videoSrc = selectedFolder.value.metadata.connections.videos.find(
//     (video: VimeoVideo) => video.name === videoModel.selectedVideo,
//   )
//   return videoSrc ? videoSrc.uri : ''
// }

watch(folderFilter, (newVal) => {
  filteredFolders.value = folderModel.folders.filter((folder) =>
    folder.name.toLowerCase().includes(newVal.toLowerCase()),
  )
})

watch(videoFilter, (newVal) => {
  filteredVideos.value = videoModel.videos.filter((video) =>
    video.name.toLowerCase().includes(newVal.toLowerCase()),
  )
})

watchEffect(() => {
  // Apply the filtering based on the input in the respective fields
  // filteredFolders.value = folderModel.folders.filter((folder) =>
  //   folder.name.toLowerCase().includes(filterText.value.toLowerCase()),
  // )
  // filteredVideos.value = videoModel.videos.filter((video) =>
  //   video.name.toLowerCase().includes(filterText.value.toLowerCase()),
  // )
  plugin.actions.setContent({
    folders: {
      folderIDs: folderIDs,
      userID: user_id,
    },
    videoModel: {
      videos: videoModel.videos.map((video) => ({ ...video })),

      selectedVideo: videoModel.selectedVideo,
    },
    videoPlayerModel: {
      hasMute: hasMute.value,
      hasAutoplay: hasAutoplay.value,
      hasControls: hasControls.value,
    },
    selectedFolder: selectedFolder.value,
    filteredFolders: filteredFolders.value.map((folder) => ({ ...folder })),
    folderFilter: folderFilter.value,
    filteredVideos: filteredVideos.value.map((video) => ({ ...video })),
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

// console.log(plugin.data.content.hasMute)
// console.log(plugin.data.options)
console.log(selectedFolder.value)
console.log(filteredFolders)
console.log(filteredFolders.value)
console.log(plugin.data.content.selectedFolder)
console.log(onSelectFolder)
</script>

<template>
  <div>
    <!-- <pre>{{ plugin.data.content }}</pre> -->
    <!-- <hr />
    <pre>{{ plugin.data.options }}</pre> -->
    <div class="uk-form-controls">
      <label style="font-weight: 600">Vimeo Folder(s):</label>
      <input
        class="uk-width-1-1"
        v-model="folderFilter"
        @focus="toggleFolderSearchOn()"
        @blur="toggleFolderSearchOff()"
        placeholder="Select a folder..."
      />
    </div>

    <div
      v-if="plugin.data.content.searchFolderActive"
      class="select__dropdown"
      infinite-scroll-disabled="loading"
      infinite-scroll-distance="100"
      style="position: relative"
    >
      <ul>
        <li
          v-for="folder in filteredFolders"
          :key="folder.name"
        >
          <a @click="onSelectedFolder(folder)">{{ folder.name }}</a>
        </li>
      </ul>
    </div>
    <div style="margin-top: 20px">
      <label style="font-weight: 600"
        >Selected Folder: {{ selectedFolder?.name }}</label
      >
    </div>

    <div
      style="margin-top: 20px"
      class="uk-form-controls"
    >
      <label style="font-weight: 600">Videos:</label>
      <input
        class="uk-width-1-1"
        v-model="videoFilter"
        placeholder="Select a video..."
        @focus="toggleVideoSearchOn()"
        @blur="toggleVideoSearchOff()"
      />
    </div>
    <div
      class="select__dropdown"
      infinite-scroll-disabled="loading"
      infinite-scroll-distance="100"
      style="position: relative"
    >
      <!-- <ul>
        <li
          v-for="video in selectedFolder"
          :key="video"
        >
          <a @click="onSelectVideo(video)">{{ video }}</a>
        </li>
      </ul> -->
      <div>{{ selectedFolder }}</div>
    </div>

    <div style="margin-top: 20px">
      <label style="font-weight: 600"
        >Preview: {{ videoModel.selectedVideo }}</label
      >
      <video
        style="margin-top: 10px"
        id="my-video"
        preload="auto"
        width="100%"
        height="360"
        playsinline="true"
      >
        <source type="application/x-mpegURL" />
        <source type="video/mp4" />
      </video>
    </div>
    <div style="display: flex; flex-direction: row; margin-top: 10px">
      <div class="sb-toggle sb-toggle--primary">
        <input
          id="mute"
          class="sb-toggle__native"
          type="checkbox"
          v-model="hasMute"
        />
        <label
          class="sb-toggle__label"
          for="mute"
          >Mute</label
        >
      </div>
      <div
        style="margin-left: 15px"
        class="sb-toggle sb-toggle--primary"
      >
        <input
          id="autoplay"
          class="sb-toggle__native"
          type="checkbox"
          v-model="hasAutoplay"
        />
        <label
          class="sb-toggle__label"
          for="autoplay"
          >Autoplay</label
        >
      </div>
      <div
        style="margin-left: 15px"
        class="sb-toggle sb-toggle--primary"
      >
        <input
          id="controls"
          class="sb-toggle__native"
          type="checkbox"
          v-model="hasControls"
        />
        <label
          class="sb-toggle__label"
          for="controls"
          >Controls</label
        >
      </div>
    </div>
  </div>
</template>
