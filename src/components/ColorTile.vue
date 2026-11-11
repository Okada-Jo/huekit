<script setup>
import { computed } from 'vue'
import { nameColor, textColorFor } from '../lib/colors.js'

const props = defineProps({
  hex: { type: String, required: true },
  index: { type: Number, required: true },
  locked: { type: Boolean, default: false },
})
const emit = defineEmits(['copy', 'toggle-lock'])
const marks = ['✳', '◒', '✦', '○', '✳']
const colorName = computed(() => nameColor(props.hex))
const foreground = computed(() => textColorFor(props.hex))
</script>

<template>
  <div class="color-tile">
    <div
      class="swatch"
      :style="{ background: hex, color: foreground }"
    >
      <button
        class="swatch-copy"
        type="button"
        :aria-label="`Copy ${hex}, ${colorName}`"
        @click="emit('copy', hex)"
      >
        <span
          class="swatch-top"
          aria-hidden="true"
          >0{{ index + 1 }} / 05</span
        >
        <span
          class="swatch-mark"
          aria-hidden="true"
          >{{ marks[index] }}</span
        >
        <span
          class="swatch-bottom"
          aria-hidden="true"
          ><span>{{ locked ? 'LOCKED' : 'TAP TO COPY' }}</span
          ><span class="swatch-copy-icon">↗</span></span
        >
      </button>
      <button
        class="lock-button"
        type="button"
        :aria-label="`${locked ? 'Unlock' : 'Lock'} color ${index + 1}`"
        :aria-pressed="locked"
        @click.stop="emit('toggle-lock', index)"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.7"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <rect
            x="5"
            y="10"
            width="14"
            height="11"
            rx="2"
          />
          <path :d="locked ? 'M8 10V7a4 4 0 0 1 8 0v3' : 'M8 10V7a4 4 0 0 1 8 0'" />
        </svg>
      </button>
    </div>
    <div class="tile-info">
      <div>
        <span class="tile-hex">{{ hex }}</span><span class="tile-name">{{ colorName }}</span>
      </div>
      <span
        class="tile-copy"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.7"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <rect
            x="8"
            y="8"
            width="12"
            height="12"
            rx="2"
          />
          <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
        </svg>
      </span>
    </div>
  </div>
</template>
