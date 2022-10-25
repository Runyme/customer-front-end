<template>
  <div id="app" class="h-full border-primary-200 border-t-4">
    <transition name="fade" mode="out-in" appear>
      <Global-Spinner v-if="loading" :loading="loading" />
      <div class="w-full h-full" v-else>
        <transition name="fade" mode="out-in" appear>
          <router-view />
        </transition>
      </div>
    </transition>
  </div>
</template>

<script>
import GlobalData from '@/services/globalData'
import GlobalSpinner from '@/components/helpers/GlobalSpinner'
export default {
  components: { GlobalSpinner },
  computed: {
    loading() {
      return GlobalData.loading
    }
  }
}
</script>
