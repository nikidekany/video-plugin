import { Ref, ref, watch } from 'vue'

export function useSearchFilter<T extends { name: string }>(list: T[]) {
  const filteredList: Ref<T[]> = ref(list) as Ref<T[]>
  const filterText: Ref<string> = ref('')

  watch(filterText, (newVal) => {
    const filtered = list.filter((item) =>
      item.name.toLowerCase().includes(newVal.toLowerCase()),
    )
    filteredList.value = filtered as T[]
  })

  return {
    filteredList,
    filterText,
  }
}
