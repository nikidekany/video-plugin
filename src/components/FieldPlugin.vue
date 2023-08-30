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
import { SbTextField } from '@storyblok/design-system'
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
    videoModel: {
      vimeoMP4: videoModel.vimeoMP4,
      vimeoHLS: videoModel.vimeoHLS,
      selectedVideo: selectedVideo.value,
      filteredVideos: filteredVideos.value.map((video) => ({ ...video })),
    },
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
//        <!-- v-if="plugin.data.content.searchFolderActive" -->
</script>

<template>
  <div style="height: 500px">
    <div
      style="min-height: 100px"
      class="uk-form-controls"
      v-if="folderModel.folders && folderModel.folders.length !== 0"
    >
      <SbTextField
        class="square sb-pt-7"
        style="height: 50px"
        v-model="folderFilter"
        @focus="toggleFolderSearchOn()"
        @blur="toggleFolderSearchOff()"
        placeholder="Select a folder..."
        :disabled="folderModel.folders && folderModel.folders.length <= 1"
        id="vimeoFolder"
        name="vimeoFolder"
        label="Vimeo Folder(s):"
        required
        clearable
      />

      <div
        v-if="plugin.data.content.searchFolderActive"
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
    </div>

    <div
      style="margin-top: 20px"
      class="uk-form-controls"
      v-if="selectedFolder"
    >
      <label style="font-weight: 600"
        >Selected folder: {{ selectedFolder?.name }}</label
      >
      <SbTextField
        class="square sb-pt-7"
        v-model="videoModel.videoFilter"
        placeholder="Select a video..."
        @focus="toggleVideoSearchOn()"
        @blur="toggleVideoSearchOff()"
        :disabled="videoModel.videos && videoModel.videos.length === 0"
        id="vimeoVideo"
        name="vimeoVideo"
        label="Video(s):"
        required
        clearable
      />
    </div>
    <div
      v-if="plugin.data.content.searchVideoActive"
      class="select__dropdown"
      infinite-scroll-disabled="loading"
      infinite-scroll-distance="100"
      style="position: relative"
    >
      <ul>
        <li
          v-for="video in videoModel.filteredVideos"
          :key="video.name"
        >
          <a @click="onSelectVideo(video)">{{ video.name }}</a>
        </li>
      </ul>
    </div>

    <div
      style="margin-top: 20px"
      v-if="videoModel.videos && selectedVideo"
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
    </div>

    <div
      style="display: flex; flex-direction: column; margin-top: 10px; gap: 15px"
      v-if="HLS || MP4"
    >
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
      <div class="sb-toggle sb-toggle--primary">
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
      <div class="sb-toggle sb-toggle--primary">
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

<style>
ul {
  list-style: none;
  padding-bottom: 20px;
}
a {
  font-size: 16px;
}
a:hover {
  cursor: pointer;
}
</style>
