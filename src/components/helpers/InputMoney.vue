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
    <money
      class="px-2 border-l-4 border-solid bg-white rounded py-1 w-full transition focus:shadow focus:border-r-4 font-light"
      :class="[error ? 'border-error-base' : 'border-primary-200', {
        'pl-8': icon && (icon.position === 'left'),
        'pr-8': icon && (!icon.position || icon.position === 'right'),
      }]"
      v-bind:value="value"
      v-on:input="onInput"
      :placeholder="placeholder"
      v-bind="{
        prefix: prefix,
        decimal: ',',
        thousands: '.',
        precision: precision
      }"
    />
  </div>
</template>

<script>

  import {Money} from 'v-money'

  export default {
    props: {
      precision: {default: 2},
      prefix: {default: 'R$ '},
      value: [String, Number],
      error: Boolean,
      placeholder: String,
      icon: Object
    },
    components: {Money},
    methods: {
      onInput(value) {
        this.$emit('input', value)
      }
    }
  }
</script>
