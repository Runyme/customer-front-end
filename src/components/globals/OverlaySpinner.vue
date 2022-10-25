<template>
  <div class="inset-0 fixed bg-white-75 z-100 flex items-center justify-center lg:ml-48 xl:ml-56 ml-64 h-screen md:ml-0 md:min-h-screen" v-if="loading">
    <MB-Spinner size="16"/>
  </div>
</template>

<script>
export default {
  props: ['loading']
}
</script>