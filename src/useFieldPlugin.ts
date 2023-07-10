import { FieldPluginData, FieldPluginResponse } from '@storyblok/field-plugin'
import { inject } from 'vue'

export interface VideoContent {
  hls: string
  audio: string
}

export interface VideoData extends FieldPluginData {
  content: VideoContent
}

export interface MyFieldPluginResponse
  extends Extract<FieldPluginResponse, { type: 'loaded' }> {
  data: VideoData
}

export function useFieldPlugin() {
  const plugin = inject<FieldPluginResponse>(
    'field-plugin',
    () => {
      throw new Error(
        `You need to wrap your app with \`<FieldPluginProvider>\` component.`,
      )
    },
    true,
  )

  if (plugin.type !== 'loaded') {
    throw new Error(
      'The plugin is not loaded, yet `useFieldPlugin()` was invoked. Ensure that the component that invoked `useFieldPlugin()` is wrapped within `<FieldPluginProvider>`, and that it is placed within the default slot.',
    )
  }

  return plugin as MyFieldPluginResponse
}
