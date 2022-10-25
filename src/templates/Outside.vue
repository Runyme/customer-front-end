<template>
  <div class="flex h-full">
    <div class="w-1/2 lg:w-2/5 flex items-center justify-center bg-primary-500 px-8 py-8 fixed left-0 top-0 bottom-0 md:hidden">
      <transition name="fade-left" appear>
        <div class="w-full h-full max-w-lg">
          <slot name="SVG"/>
        </div>
      </transition>
    </div>
    <div class="w-1/2 lg:w-2/5 md:hidden"></div>
    <div class="w-1/2 lg:w-3/5 md:w-full flex flex-col items-center z-1">
      <div class="pt-8">
        <transition name="fade-left" appear>
          <Logo class="h-12 text-primary-500 md:h-8"/>
        </transition>
      </div>
      <div class="max-w-xl xl:max-w-md w-full font-light px-8 py-8 flex-grow flex flex-col justify-center">
        <slot name="content" />
      </div>
    </div>
    <div class="fixed bottom-0 right-0 w-56">
      <SVG-Plus-Rounded />
    </div>
  </div>
</template>

<script>

import Logo from '@/components/svgs/Logo'
import SVGPlusRounded from '@/components/svgs/PlusRounded'

export default {
  components: { Logo, SVGPlusRounded }
}
</script>