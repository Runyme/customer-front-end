<template>
  <Layout-Outside class="hidden">
    <template #SVG>
      <SVG-Auth class="w-full h-full max-w-lg"/>
    </template>
    <template #content>
      <transition name="fade-right" mode="out-in" appear>
        <router-view/>
      </transition>
    </template>
  </Layout-Outside>
</template>

<script>

import SVGAuth from '@/components/svgs/Auth'
import LayoutOutside from '@/templates/Outside'

export default {
  name: 'AuthLogin',
  components: {SVGAuth, LayoutOutside},
  beforeCreate() {
    window.location.href = 'https://medb.com.br'
  }
}
</script>