<template>
  <div
    class="spinner border-l-transparent"
    :class="[sizeClass, borderClass]"
  ></div>
</template>

<script>
export default {
  props: {
    size: {
      default: '4',
    },
    color: {
      default: 'primary-500',
    },
  },
  computed: {
    sizeClass() {
      return `w-${this.size} h-${this.size}`;
    },
    borderClass() {
      return `border-${this.color}`;
    },
  }
}
</script>