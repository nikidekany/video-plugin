<script setup lang="ts">
import VimeoPlayer from './VideoPlayer.vue'
import { useFieldPlugin } from '../useFieldPlugin'
import { ref, onMounted, watchEffect, reactive } from 'vue'
import { Asset } from '@storyblok/field-plugin'

const plugin = useFieldPlugin()
const hls = ref<String>()
const audio = ref<String>()
const hasAutoplay = true
const hasControls = true
const hasMute = true
const vimeoHLS = ''
const vimeoMP4 = ''
const vimeoMP4Mobile = ''
const api = 'https://api.vimeo.com/'
const selectedFolder = ref<String>()
const selectedVideo = ref('')
const folderFilter = ref('')
const videoFilter = ref('')
const searchFolderActive = ref(false)
const searchVideoActive = ref(false)
const filteredFolders = ref([])
const folders = reactive([])
const filteredVideos = ref([])
const videos = reactive([])

// function orderVideosByRendition(videos) {
//   return videos.sort((a, b) => {
//     const getPScale = (video) => {
//       const rendition = video.rendition || ''
//       const pScale = rendition.split('p')[0]
//       return parseInt(pScale) || 0
//     }

//     const pScaleA = getPScale(a)
//     const pScaleB = getPScale(b)

//     return pScaleB - pScaleA
//   })
// }

// async function fetchFromVimeo(endpoint, videoURL, folderID) {
//   switch (endpoint) {
//     case 'folders':
//       try {
//         const response = await fetch(
//           `${model.value.api}users/${model.value.userID}/projects/${folderID}`,
//           {
//             headers: {
//               Authorization: `Bearer ${model.value.token}`,
//             },
//           },
//         )
//         return await response.json()
//       } catch (err) {
//         console.log(err)
//       }
//       break

//     case 'videos':
//       try {
//         const response = await fetch(`${model.value.api}${videoURL}`, {
//           headers: {
//             Authorization: `Bearer ${model.value.token}`,
//           },
//         })
//         return await response.json()
//       } catch (err) {
//         console.log(err)
//       }
//       break

//     default:
//       return
//   }
// }

// function updateSelectedVideoURLS(videoName) {
//   const foundVideo = model.value.videos.find(
//     (video) => video.name === videoName,
//   )
//   if (foundVideo) {
//     const orderedVideosMP4 = orderVideosByRendition(foundVideo.play.progressive)
//     model.value.vimeoHLS = foundVideo.play.hls.link
//     model.value.vimeoMP4 = orderedVideosMP4[0].link
//     model.value.vimeoMP4Mobile = orderedVideosMP4[1].link
//   }
// }

// async function loadFolder(folderID) {
//   console.log('Starting loadFolder with ID:', folderID)
//   if (model.value.api) {
//     try {
//       const res = await fetchFromVimeo('folders', null, folderID)
//       console.log(res)
//       const { name, metadata, resource_key } = res
//       // Clear previous request for videos/folders
//       model.value.videos = []
//       model.value.folders = []
//       // Map over "data" objects
//       model.value.folders.push({
//         name: name,
//         resource_key: resource_key,
//         metadata: metadata,
//       })

//       model.value.filteredFolders.push({
//         name: name,
//         resource_key: resource_key,
//         metadata: metadata,
//       })

//       onSelectFolder(name)
//     } catch (error) {
//       console.log(error)
//     }
//   }
// }

// async function loadAllFolders(folders) {
//   console.log('Starting loadAllFolders')
//   console.log('loadAllFolders parameter: ', folders)
//   if (folders !== undefined && model.value.api && folders.length >= 1) {
//     model.value.folders = []
//     model.value.videos = []
//     for (let i = 0; i < folders.length; i++) {
//       console.log('Start fetch of allFolders folder')
//       try {
//         const res = await fetchFromVimeo('folders', null, folders[i])
//         console.log(res)
//         console.log('Fetched folder with name: ', res.name)
//         const { name, metadata, resource_key } = res
//         // Map over "data" objects
//         model.value.folders.push({
//           name: name,
//           resource_key: resource_key,
//           metadata: metadata,
//         })

//         model.value.filteredFolders.push({
//           name: name,
//           resource_key: resource_key,
//           metadata: metadata,
//         })
//       } catch (error) {
//         console.log(error)
//       }
//     }
//   }
// }

// function getVideosFromFolder(folderName) {
//   const found = model.value.folders.find((folder) => folder.name === folderName)
//   fetchFromVimeo('videos', found.metadata.connections.videos.uri).then(
//     (res) => {
//       if (res.data && res.data.length === 1) {
//         model.value.videos = []
//         model.value.videos.push(res.data[0])
//         onSelectVideo(res.data[0].name)
//       } else {
//         model.value.videos = []
//         for (let i = 0; i < res.data.length; i++) {
//           model.value.videos.push(res.data[i])
//         }
//       } // folderIDs if no singleFolderID - preview toggle
//     },
//   )
// }

// function toggleFolderSearchOn() {
//   model.value.searchFolderActive = true
// }

// function toggleFolderSearchOff() {
//   setTimeout(() => {
//     model.value.searchFolderActive = false
//   }, 130)
// }

// function toggleVideoSearchOn() {
//   model.value.searchVideoActive = true
// }

// function toggleVideoSearchOff() {
//   setTimeout(() => {
//     model.value.searchVideoActive = false
//   }, 300)
// }

// function onSelectFolder(folderName) {
//   model.value.selectedFolder = folderName
//   model.value.folderFilter = folderName
// }

// function onSelectVideo(videoName) {
//   model.value.selectedVideo = videoName
//   model.value.videoFilter = videoName
// }

// function load() {
//   console.log('singleFolderID on load:', options.singleFolderID)
//   console.log('multiple folders on load:', options.folderIDs)
//   if (options.singleFolderID !== undefined) {
//     console.log(
//       'requesting load single folder with model.value.singleFolderID ',
//       options.singleFolderID,
//     )
//     loadFolder(options.singleFolderID)
//   } else if (options.folderIDs !== undefined) {
//     console.log(
//       'requesting load multiple folder with model.value.folders.length: ',
//       options.folderIDs.split(','),
//     )
//     loadAllFolders(options.folderIDs.split(','))
//   }
// }

// watch(
//   [model.value],
//   (value) => {
//     emit('changed-model', value)
//   },
//   { deep: true },
// )

// watch(
//   [model.value.selectedFolder],
//   (newValue, oldValue) => {
//     if (newValue !== oldValue && newValue.length > 0) {
//       getVideosFromFolder(newValue)
//       model.value.selectedVideo = ''
//       model.value.videoFilter = ''
//     }
//   },
//   { deep: true },
// )

// watch(
//   [model.value.selectedVideo],
//   (newValue, oldValue) => {
//     if (newValue !== oldValue && newValue.length > 0) {
//       const video = document.getElementById('my-video')
//       if (video) {
//         video.load()
//         video.play()
//       }
//       updateSelectedVideoURLS(newValue)
//     }
//   },
//   { deep: true },
// )

// const filteredFolders = computed(() => {
//   return model.value.folders.filter((folder) =>
//     folder.name.toLowerCase().includes(model.value.folderFilter.toLowerCase()),
//   )
// })

// const filteredVideos = computed(() => {
//   return model.value.videos.filter((video) =>
//     video.name.toLowerCase().includes(model.value.videoFilter.toLowerCase()),
//   )
// })

// onMounted(() => {
//   setTimeout(() => {
//     if (
//       options.folderIDs !== undefined ||
//       options.singleFolderID !== undefined
//     ) {
//       load()
//     }
//   }, 3000)
//   load()
// })
watchEffect(() => {
  plugin.actions.setContent({
    hls: hls,
    audio: audio,
  })
})

console.log(plugin.data)
</script>

<!-- <template>
  <pre>
    {{ JSON.stringify(plugin, null, 2) }}
  </pre>
</template> -->
<template>
  <pre>{{ plugin.data.story.content }}</pre>
  <hr />

  <!-- <div>
    <div
      class="uk-form-controls"
      v-if="model.folders && model.folders.length !== 0"
    >
      <label style="font-weight: 600">Vimeo Folder(s):</label>
      <input
        class="uk-width-1-1"
        placeholder="Select a folder..."
        @focus="toggleFolderSearchOn()"
        @blur="toggleFolderSearchOff()"
        v-model="model.folderFilter"
        :disabled="model.folders && model.folders.length <= 1"
      />
    </div>

    <div
      v-if="model.searchFolderActive"
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
          <a @click="onSelectFolder(folder.name)">
            {{ folder.name }}
          </a>
        </li>
      </ul>
    </div>

    <div
      style="margin-top: 20px"
      class="uk-form-controls"
      v-if="model.selectedFolder"
    >
      <label style="font-weight: 600"
        >Videos in: {{ model.folderFilter }}</label
      >
      <input
        class="uk-width-1-1"
        placeholder="Select a video..."
        @focus="toggleVideoSearchOn()"
        @blur="toggleVideoSearchOff()"
        v-model="model.videoFilter"
        :disabled="model.videos && model.videos.length === 0"
      />
    </div>

    <div
      v-if="model.searchVideoActive"
      class="select__dropdown"
      infinite-scroll-disabled="loading"
      infinite-scroll-distance="100"
      style="position: relative"
    >
      <ul>
        <li
          v-for="video in filteredVideos"
          :key="video.name"
        >
          <a @click="onSelectVideo(video.name)">
            {{ video.name }}
          </a>
        </li>
      </ul>
    </div>

    <div
      style="margin-top: 20px"
      v-if="
        model.videos && model.selectedVideo && model.selectedVideo.length > 0
      "
    >
      <label style="font-weight: 600">Preview: {{ model.selectedVideo }}</label>
      <video
        style="margin-top: 10px"
        v-if="model.vimeoHLS && model.vimeoMP4"
        id="my-video"
        preload="auto"
        width="100%"
        height="360"
        playsinline="true"
        :muted="model.hasMute"
        :autoplay="model.hasAutoplay"
        :controls="model.hasControls"
      >
        <source
          :src="model.vimeoHLS"
          type="application/x-mpegURL"
        />
        <source
          type="video/mp4"
          :src="model.vimeoMP4"
        />
      </video>
    </div>
    <div
      style="display: flex; flex-direction: row; margin-top: 10px"
      v-if="model.vimeoHLS && model.vimeoMP4"
    >
      <div
        v-if="this.options.canMute"
        class="sb-toggle sb-toggle--primary"
      >
        <input
          id="test-2eb9bf5f-c53e-44ff-9814-c3f2060dfbcf"
          class="sb-toggle__native"
          type="checkbox"
          v-model="model.hasMute"
        />
        <label
          for="test-2eb9bf5f-c53e-44ff-9814-c3f2060dfbcf"
          class="sb-toggle__label"
          >Mute</label
        >
      </div>
      <div
        v-if="this.options.canAutoplay"
        style="margin-left: 15px"
        class="sb-toggle sb-toggle--primary"
      >
        <input
          id="test-2eb9bf5f-c53e-44ff-9814-c3f2060dfbcf"
          class="sb-toggle__native"
          type="checkbox"
          v-model="model.hasAutoplay"
        />
        <label
          for="test-2eb9bf5f-c53e-44ff-9814-c3f2060dfbcf"
          class="sb-toggle__label"
          >Autoplay</label
        >
      </div>
      <div
        v-if="this.options.canControls"
        style="margin-left: 15px"
        class="sb-toggle sb-toggle--primary"
      >
        <input
          id="test-2eb9bf5f-c53e-44ff-9814-c3f2060dfbcf"
          class="sb-toggle__native"
          type="checkbox"
          v-model="model.hasControls"
        />
        <label
          for="test-2eb9bf5f-c53e-44ff-9814-c3f2060dfbcf"
          class="sb-toggle__label"
          >Controls</label
        >
      </div>
    </div>
  </div> -->
</template>
