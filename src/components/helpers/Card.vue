<template>
  <div class="flex flex-col shadow hover:shadow-xl transition rounded">
    <div
      class="px-4 flex rounded rounded-b-none items-center"
      :class="[
        `bg-${color}`,
        { 'py-2': header.title, 'h-1': !header.title }
      ]"
    >
      <div class="mr-4" v-if="header.icon">
        <component :is="`Icon-${header.icon}`" size="small"/>
      </div>
      <h2 class="text-xl md:text-base font-bold text-neutral-700" v-if="header.title">{{header.title}}</h2>
    </div>
    <div class="bg-white flex rounded rounded-t-none">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    header: {
      type: Object,
      default() {
        return {}
      }
    },
    color: {
      type: String,
      default: 'neutral-300'
    }
  }

}
</script>