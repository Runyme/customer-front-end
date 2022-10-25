<template>
  <div class="flex items-start flex-col mb-8">
    <span class="text-3xl font-display pb-1 font-light md:text-2xl">{{text}}</span>
    <transition name="fade-left" appear>
      <span class="w-6 h-1 bg-primary-500 rounded"></span>
    </transition>
  </div>
</template>

<script>
export default {
  props: ['text']
}
</script>

<style>

</style>