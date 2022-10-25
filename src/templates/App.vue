<template>
  <div class="z-1 relative">
    <div class="w-full h-full z-10 relative">
      <Sidebar ref="sidebar"/>
      <Header v-on:open-sidebar="openSidebar"/>
      <div class="z-1 h-full pl-64 xl:pl-56 lg:pl-48 md:pl-0">
        <div class="w-full max-w-5xl mx-auto text-neutral-800 py-8 px-8 xl:max-w-4xl lg:max-w-3xl md:pt-24 relative h-full">
          <transition name="fade" mode="out-in">
            <router-view />
          </transition>
        </div>
      </div>
    </div>
    <div class="fixed bottom-0 right-0 w-56 z-1">
      <SVG-Plus-Rounded />
    </div>
  </div>
</template>

<script>

import Sidebar from '@/components/layout/Sidebar'
import Header from '@/components/layout/Header'
import SVGPlusRounded from '@/components/svgs/PlusRounded'

export default {
  components: { Sidebar, Header, SVGPlusRounded },
  methods: {
    openSidebar() {
      const sidebar = this.$refs.sidebar;
      sidebar.openSidebar();
    }
  },
}
</script>
