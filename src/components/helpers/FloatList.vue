<template>
  <div class="relative">
    <a href="#" @click.prevent="onTrigger">
      <slot name="trigger"></slot>
    </a>
    <transition name="fade">
      <div 
        class="transition z-10 absolute"
        :class="[{ 
          'opacity-0': !opened,
          'top-0 left-0 mt-4': !position || position === 'top-left',
          'top-0 right-0 mt-4': position === 'top-right',
        }, floatClasses]"
        v-if="opened"
        @click.stop
      >
        <slot name="target"></slot>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  props: ['position', 'floatClasses'],
  data() {
    return {
      opened: false
    }
  },
  methods: {
    onTrigger(e) {
      if(!this.opened) e.stopPropagation();
      this.opened = true;
    }
  },
  mounted() {
    document.body.addEventListener('click', () => {
      this.opened = false;
    });
  },
  watch: {
    '$route' () {
      this.opened = false;
    }
  }
}
</script>