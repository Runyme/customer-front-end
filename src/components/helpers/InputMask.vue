<template>
  <div class="shadow rounded relative">
    <div
      class="absolute-center-y"
      v-if="icon"
      :class="{
        'left-0 pl-2': icon.position === 'left',
        'right-0 pr-2': !icon.position || icon.position === 'right'
      }"
    >
      <component
        :is="`Icon-${icon.name}`"
        :class="icon.color ? `text-${icon.color}` : 'text-neutral-700'"
        size="smallest"
      />
    </div>
    <the-mask
      class="px-2 border-l-4 border-solid bg-white rounded py-1 w-full transition focus:shadow focus:border-r-4 font-light"
      :class="[error ? 'border-error-base' : 'border-primary-200', {
        'pl-8': icon && (icon.position === 'left'),
        'pr-8': icon && (!icon.position || icon.position === 'right'),
      }, inputClass]"
      v-bind:value="value"
      v-on:input="onInput"
      :mask="mask"
      :placeholder="placeholder"
      :masked="masked"
      :inputmode="inputMode"
    />
  </div>
</template>

<script>

  import {TheMask} from 'vue-the-mask'

  export default {
    props: {
      masked: {default: false},
      value: String,
      error: Boolean,
      mask: {
        type: [String, Array],
        required: true
      },
      placeholder: String,
      icon: Object,
      inputClass: String,
      inputMode: String,
    },
    components: {TheMask},
    methods: {
      onInput(value) {
        this.$emit('input', value)
      }
    }
  }
</script>
