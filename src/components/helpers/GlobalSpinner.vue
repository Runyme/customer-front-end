<template>
  <div class="inset-0 fixed bg-primary-400 z-100 flex items-center justify-center h-screen md:ml-0 md:min-h-screen" v-if="loading">
    <MB-Spinner color="white" size="16"/>
  </div>
</template>

<script>
export default {
  props: ['loading']
}
</script>