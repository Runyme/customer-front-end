<template>
  <label class="flex items-center cursor-pointer">
    <span 
      class="w-4 h-4 border-2 rounded border-primary-500 transition"
      :class="{ 'bg-primary-500': checked }"
    ></span>
    <input class="hidden" type="checkbox" @change="onChange">
  </label>
</template>

<script>
export default {
  props: {
    autoCheck: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      checked: false
    }
  },
  methods: {
    onChange(e) {
      this.checked = !this.checked;
      this.$emit('input', this.checked);
    }
  },
  mounted() {
    this.checked = this.autoCheck
  }
}
</script>