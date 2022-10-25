<template>
  <label class="flex items-center cursor-pointer">
    <input class="hidden input-radio" type="radio" :value="mbValue" @change="onChange" :name="mbName" ref="input">
    <span 
      class="w-4 h-4 border-2 rounded-full border-primary-500 transition span-radio"
    ></span>
  </label>
</template>

<script>
export default {
  props: {
    autoCheck: {
      type: Boolean,
      default: false
    },
    mbValue: { required: true },
    mbName: { required: true }
  },
  data() {
    return {
      checked: false
    }
  },
  methods: {
    onChange(e) {
      this.checked = !this.checked
      this.$emit('input', this.mbValue)
    },
  },
  mounted() {
    this.checked = this.autoCheck
  }
}
</script>

<style lang="scss" scoped>
  .input-radio:checked {
    & ~ .span-radio {
      @apply bg-primary-500;
    }
  }
</style>