<script setup lang="ts">
import VimeoPlayer from './VideoPlayer.vue'
import { useFieldPlugin } from '../useFieldPlugin'
import { ref, watch, watchEffect, reactive } from 'vue'
import { Asset, FieldPluginResponse } from '@storyblok/field-plugin'
import { useVimeoFolders } from '../composables/useVimeoFolders'
import { useVimeoVideos } from '../composables/useVimeoVideos'
import { useVideoPlayer } from '../composables/useVideoPlayer'
import { useSearchFilter } from '../composables/useSearchFilters'
import { useFolderSelection } from '../composables/useFolderSelection'

const plugin = useFieldPlugin()
const hasAutoplay = plugin.data.options.autoplay
const hasControls = plugin.data.options.controls
const hasMute = plugin.data.options.mute
const folderID = plugin.data.options.folderIDs
const userID = plugin.data.options.userID
const api = 'https://api.vimeo.com/'

const { model: folderModel, onSelectFolder } = useVimeoFolders({
  singleFolderID: '12345',
  folderIDs: '123456',
})

const {
  model: videoModel,
  getVideosFromFolder,
  onSelectVideo,
} = useVimeoVideos()

const { model: videoPlayerModel } = useVideoPlayer({
  canMute: 'true',
  canAutoplay: 'true',
  canControls: 'true',
})

// const { filteredFolders, folderFilter } = useSearchFilter<VimeoFolder>(
//   folderModel.folders,
// )

// const { filteredVideos, videoFilter } = useSearchFilter<VimeoVideo>(
//   videoModel.videos,
// )

const { selectedFolder } = useFolderSelection()
console.log(plugin.data)

watchEffect(() => {
  plugin.actions.setContent({
    folder: { folderModel, singleFolderID: folderID, folderIDs: folderID },

    videoModel,

    videoPlayerModel: {
      canMute: hasMute,
      canAutoplay: hasAutoplay,
      canControls: hasControls,
    },
  })
})
console.log(plugin.data)
</script>

<template>
  <!-- <pre>{{ plugin.data.content.hasAutoplay }}</pre>
  <hr />
  <pre>{{ plugin.data.content.hasControls }}</pre>
  <hr />
  <pre>{{ plugin.data.content.hasMute }}</pre> -->
  <hr />
  <!-- <pre>{{ plugin.data.content.audio }}</pre> -->
  <div>
    <div class="uk-form-controls">
      <label style="font-weight: 600">Vimeo Folder(s):</label>
      <input
        class="uk-width-1-1"
        placeholder="Select a folder..."
      />
    </div>

    <div
      class="select__dropdown"
      infinite-scroll-disabled="loading"
      infinite-scroll-distance="100"
      style="position: relative"
    >
      <!-- <ul>
        <li v-for="folder in filteredFolders" :key="folder.name">
            <a
              @click="onSelectFolder(folder.name)"
            >
              {{ folder.name }}
            </a>
        </li>
      </ul> -->
    </div>
    <div
      style="margin-top: 20px"
      class="uk-form-controls"
    >
      <label style="font-weight: 600">Videos in: </label>
      <input
        class="uk-width-1-1"
        placeholder="Select a video..."
      />
    </div>

    <div
      class="select__dropdown"
      infinite-scroll-disabled="loading"
      infinite-scroll-distance="100"
      style="position: relative"
    >
      <ul>
        <!-- <li v-for="video in filteredVideos" :key="video.name">
            <a
              @click="onSelectVideo(video.name)"
            >
              {{ video.name }}
            </a>
        </li> -->
      </ul>
    </div>
    <div style="margin-top: 20px">
      <label style="font-weight: 600">Preview: </label>
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
          class="sb-toggle__native"
          type="checkbox"
        />
        <label class="sb-toggle__label">Mute</label>
      </div>
      <div
        style="margin-left: 15px"
        class="sb-toggle sb-toggle--primary"
      >
        <input
          class="sb-toggle__native"
          type="checkbox"
        />
        <label class="sb-toggle__label">Autoplay</label>
      </div>
      <div
        style="margin-left: 15px"
        class="sb-toggle sb-toggle--primary"
      >
        <input
          class="sb-toggle__native"
          type="checkbox"
        />
        <label class="sb-toggle__label">Controls</label>
      </div>
    </div>
  </div>
</template>
