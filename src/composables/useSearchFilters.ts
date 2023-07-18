import { ref, watchEffect } from 'vue';

export function useSearchFilter<T extends { name: string }>(list: T[]) {
  const filteredList = ref(list);
  const filterText = ref('');

  watchEffect(() => {
    filteredList.value = list.filter((item) =>
      item.name.toLowerCase().includes(filterText.value.toLowerCase())
    );
  });

  return {
    filteredList,
    filterText,
  };
}