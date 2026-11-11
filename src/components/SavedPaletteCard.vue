<script setup>
import { computed } from 'vue'
const props = defineProps({
  entry: { type: Object, required: true },
  index: { type: Number, required: true },
})
const emit = defineEmits(['load', 'remove'])
const dateLabel = computed(() => {
  const date = new Date(props.entry.date)
  return Number.isNaN(date.getTime()) ? 'Saved palette' : date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
})
</script>

<template>
  <div class="saved-card">
    <button class="saved-colors" type="button" :aria-label="`Load saved palette ${index + 1}`" @click="emit('load', entry)">
      <span v-for="(color, i) in entry.colors" :key="i" :style="{ background: color }" />
    </button>
    <div class="saved-card-bottom">
      <button class="load-saved" type="button" @click="emit('load', entry)">
        Palette {{ String(index + 1).padStart(2, '0') }}
        <small>{{ dateLabel }} · Click to load</small>
      </button>
      <button class="remove-saved" type="button" :aria-label="`Delete saved palette ${index + 1}`" title="Remove palette" @click="emit('remove', entry.id)">×</button>
    </div>
  </div>
</template>
