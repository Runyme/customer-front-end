<template>
  <div class="w-full h-full flex items-center justify-center flex-col">
    <div class="w-full flex justify-center pt-8">
      <SVG-Page-Not-Found class="w-96"/>
    </div>
    <span class="text-lg font-display font-bold py-8">Nenhuma página foi encontrada</span>
    <router-link :to="{ name: 'Dashboard' }">
      <MB-Button text="Voltar" icon="ArrowLeft"/>
    </router-link>
  </div>
</template>

<script>

import SVGPageNotFound from '@/components/svgs/PageNotFound'

export default {
  name: 'PageNotFound',
  components: { SVGPageNotFound }
}
</script>