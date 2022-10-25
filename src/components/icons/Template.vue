<template>
  <div class="icon-box" :class="sizeClass">
    <slot />
  </div>
</template>

<script>
export default {
  props: ['size'],
  computed: {
    sizeClass() {
      return !this.size ? this.size : `w-${this.size} h-${this.size}`
    }
  }
}
</script>