<template>
  <div>
    <a href="#" @click.prevent="openModal">
      <slot name="trigger"></slot>
    </a>
    <div 
      class="fixed inset-0 flex items-center justify-center z-100 transition py-8"
      :class="{
        'pointer-events-none opacity-0': !isOpen,
        'pointer-events-auto opacity-100': isOpen
      }"
    >
      <div class="fixed inset-0 z-1" style="background-color: rgba(0, 0, 0, .5)" @click="closeModal"></div>
      <transition name="fade" appear="">
        <div class="flex flex-col bg-neutral-300 z-10 rounded shadow-xl w-full max-w-2xl max-h-full overflow-y-auto mx-8">
          <div class="relative">
            <div class="p-2 bg-neutral-800 rounded absolute close-button cursor-pointer top-0 mt-6 mr-6 right-0 transition hover:bg-neutral-600" @click="closeModal">
              <Icon-Cross class="text-neutral-100" size="smallest"/>
            </div>
            <slot name="target" />
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return { isOpen: false }
  },
  props: {
    opened: {
      default: false,
      type: Boolean
    }
  },
  methods: {
    openModal() {
      this.isOpen = true;
      document.body.classList.add('overflow-hidden');
    },
    closeModal() {
      this.isOpen = false;
      document.body.classList.remove('overflow-hidden');
      this.$emit('close-modal');
    }
  },
  mounted() {
    this.isOpen = this.opened;
    if(this.opened) document.body.classList.add('overflow-hidden');
  }
}
</script>