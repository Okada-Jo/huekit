<script setup>
import { computed, onMounted, onUnmounted, ref } from 'vue'
import ColorTile from './components/ColorTile.vue'
import SavedPaletteCard from './components/SavedPaletteCard.vue'
import { INITIAL_COLORS, generatePalette } from './lib/colors.js'

const STORAGE_KEY = 'huekit:saved-palettes:v1'
const VALID_HEX = /^#[\da-f]{6}$/i
const palette = ref([...INITIAL_COLORS])
const locks = ref(Array(5).fill(false))
const saved = ref(readSaved())
const toast = ref('')
let toastTimeout

const previewVariables = computed(() => Object.fromEntries(palette.value.map((hex, index) => [`--preview-${index + 1}`, hex])))

function readSaved() {
  try {
    const entries = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
    if (!Array.isArray(entries)) return []
    return entries.filter(entry => entry && Array.isArray(entry.colors) && entry.colors.length === 5 && entry.colors.every(color => typeof color === 'string' && VALID_HEX.test(color)))
      .slice(0, 8)
      .map(entry => ({ id: String(entry.id), colors: entry.colors, date: entry.date }))
  } catch {
    return []
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved.value))
    return true
  } catch {
    notify('Local storage is unavailable; this change may not persist.')
    return false
  }
}

function notify(message) {
  toast.value = message
  clearTimeout(toastTimeout)
  toastTimeout = setTimeout(() => { toast.value = '' }, 2200)
}

function generate() {
  if (locks.value.every(Boolean)) {
    notify('Unlock a color to generate a new palette.')
    return
  }
  const next = generatePalette()
  palette.value = palette.value.map((hex, index) => locks.value[index] ? hex : next.colors[index])
}

function toggleLock(index) {
  locks.value[index] = !locks.value[index]
  notify(locks.value[index] ? 'Color locked 🔒' : 'Color unlocked')
}

async function copyHex(hex) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(hex)
    } else {
      const textarea = document.createElement('textarea')
      textarea.value = hex
      textarea.style.position = 'fixed'
      textarea.style.opacity = '0'
      document.body.appendChild(textarea)
      textarea.select()
      const copied = document.execCommand('copy')
      textarea.remove()
      if (!copied) throw new Error('Copy failed')
    }
    notify(`${hex} copied to clipboard ✓`)
  } catch {
    notify(`Could not copy. HEX: ${hex}`)
  }
}

function savePalette() {
  if (saved.value.some(entry => entry.colors.every((hex, index) => hex === palette.value[index]))) {
    notify('This palette is already saved.')
    return
  }
  saved.value = [
    { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, colors: [...palette.value], date: new Date().toISOString() },
    ...saved.value,
  ].slice(0, 8)
  if (persist()) notify('Added to your keepers ♡')
}

function loadPalette(entry) {
  palette.value = [...entry.colors]
  locks.value = Array(5).fill(false)
  document.querySelector('.generator')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  notify('Your palette is back!')
}

function removePalette(id) {
  saved.value = saved.value.filter(entry => entry.id !== id)
  if (persist()) notify('Palette removed')
}

function exportCss() {
  const css = `:root {\n${palette.value.map((hex, index) => `  --color-${index + 1}: ${hex};`).join('\n')}\n}\n`
  const url = URL.createObjectURL(new Blob([css], { type: 'text/css;charset=utf-8' }))
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = 'huekit-palette.css'
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
  notify('CSS palette exported ↓')
}

function onKeydown(event) {
  const target = event.target
  if (event.code !== 'Space' || event.repeat || event.altKey || event.ctrlKey || event.metaKey || !(target instanceof Element)) return
  if (target.closest('input, textarea, select, button, a, [role="button"], [contenteditable="true"]')) return
  event.preventDefault()
  generate()
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  clearTimeout(toastTimeout)
})
</script>

<template>
  <div class="site-shell">
    <header class="site-header">
      <a class="brand" href="#top" aria-label="Huekit home">
        <span class="brand-mark" aria-hidden="true"><i></i><i></i><i></i><i></i></span>
        <span>huekit<span class="brand-dot">.</span></span>
      </a>
      <div class="nav-right">
        <a class="nav-link" href="#how-it-works">How it works <span aria-hidden="true">↗</span></a>
      </div>
    </header>

    <main id="top">
      <section class="hero" aria-labelledby="hero-title">
        <div class="hero-copy">
          <h1 id="hero-title">Color palettes</h1>
          <p class="hero-description">Generate palettes, lock colors, and copy or export HEX values.</p>
        </div>
      </section>

      <section class="generator" aria-labelledby="generator-title">
        <div class="section-toolbar">
          <div class="section-name">
            <h2 id="generator-title">Palette</h2>
          </div>
          <div class="toolbar-actions">
            <span class="keyboard-hint"><kbd>SPACE</kbd> to shuffle</span>
            <button class="button button-outline" type="button" @click="savePalette"><span aria-hidden="true">♡</span> Save palette</button>
            <button class="button button-dark" type="button" @click="generate"><span aria-hidden="true">↻</span> Generate new</button>
          </div>
        </div>
        <div class="palette-grid" aria-label="Current color palette">
          <ColorTile
            v-for="(hex, index) in palette"
            :key="index"
            :hex="hex"
            :index="index"
            :locked="locks[index]"
            @copy="copyHex"
            @toggle-lock="toggleLock"
          />
        </div>
      </section>

      <section class="preview-section" aria-labelledby="preview-title">
        <div class="section-toolbar section-toolbar-secondary">
          <div class="section-name">
            <h2 id="preview-title">Preview</h2>
          </div>
          <button class="button button-outline export-button" type="button" @click="exportCss"><span aria-hidden="true">↧</span> Export CSS</button>
        </div>
        <div class="preview-card" :style="previewVariables">
          <div class="preview-text">
            <h3>Palette preview</h3>
            <p>A sample layout using your current colors.</p>
          </div>
          <div class="preview-art" aria-hidden="true">
            <div class="art-frame art-frame-one"><span class="art-circle"></span><span class="art-line"></span><span class="art-small-circle"></span></div>
            <div class="art-frame art-frame-two"><span class="art-sun"></span><span class="art-orbit"></span></div>
            <div class="art-spark">✳</div>
          </div>
        </div>
      </section>

      <section class="saved-section" aria-labelledby="saved-title">
        <div class="section-toolbar section-toolbar-secondary">
          <div class="section-name">
            <h2 id="saved-title">Saved palettes <span class="saved-count">{{ saved.length }}</span></h2>
          </div>
        </div>
        <div class="saved-grid" aria-live="polite">
          <div v-if="saved.length === 0" class="saved-empty">
            <strong>No saved palettes</strong>
            <p>Save a palette to keep it here.</p>
          </div>
          <SavedPaletteCard v-for="(entry, index) in saved" :key="entry.id" :entry="entry" :index="index" @load="loadPalette" @remove="removePalette" />
        </div>
      </section>
    </main>

    <footer class="site-footer" id="how-it-works">
      <p>Generate, lock, copy, or save a palette.</p>
      <a href="#top">Back to top ↑</a>
    </footer>
  </div>
  <div class="toast" :class="{ visible: toast }" role="status" aria-live="polite" aria-atomic="true">{{ toast }}</div>
</template>
