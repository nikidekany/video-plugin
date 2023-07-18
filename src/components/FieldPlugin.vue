<script setup lang="ts">
import VimeoPlayer from './VideoPlayer.vue'
import { useFieldPlugin } from '../useFieldPlugin'
import { ref, watch, watchEffect, reactive } from 'vue'
import { Asset, FieldPluginResponse } from '@storyblok/field-plugin'
import { useVimeoFolders } from '../composables/useVimeoFolders'

const plugin = useFieldPlugin()
const hasAutoplay = true
// ref<Boolean>(plugin.data.content.hasAutoplay)
const hasControls = true
// ref<Boolean>(plugin.data.content.hasControls)
const hasMute = true
// ref<Boolean>(plugin.data.content.hasMute)
const vimeoHLS = 'vimeoHLS'
// ref<Boolean>(plugin.data.content.vimeoHLS)
const vimeoMP4 = 'vimeoMP4'
// ref<Boolean>(plugin.data.content.vimeoMP4)
const vimeoMP4Mobile = 'vimeoMP4Mobile'
// ref<Boolean>(plugin.data.content.vimeoMP4Mobile)
const api = 'https://api.vimeo.com/'

const selectedFolder = 'selectedFolder'
const selectedVideo = 'selectedVideo'

const folderFilter = 'folderFilter'
const videoFilter = 'videoFilter'

const searchFolderActive = false
const searchVideoActive = false

const filteredFolders = []
const folders = []

const filteredVideos = []
const videos = []

const { model: folderModel, onSelectFolder } = useVimeoFolders({
  singleFolderID: '12345',
})

watchEffect(() => {
  plugin.actions.setContent({
    hasAutoplay: hasAutoplay,
    hasControls: hasControls,
    hasMute: hasMute,
    vimeoHLS: vimeoHLS,
    vimeoMP4: vimeoMP4,
    vimeoMP4Mobile: vimeoMP4Mobile,
  })
})

console.log(videos)
console.log(plugin.data)
console.log(hasAutoplay, 'true')
console.log(plugin.actions.setContent)
console.log(plugin.data)
console.log(folderModel, onSelectFolder)
</script>

<template>
  <pre>{{ plugin.data.content.hasAutoplay }}</pre>
  <hr />
  <pre>{{ plugin.data.content.hasControls }}</pre>
  <hr />
  <pre>{{ plugin.data.content.hasMute }}</pre>
  <hr />
  <pre>{{ plugin.data.content.audio }}</pre>
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
  </div>
</template>
