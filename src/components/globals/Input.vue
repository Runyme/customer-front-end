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
        size="smallest"
        :class="icon.color ? `text-${icon.color}` : 'text-neutral-700'"
      />
    </div>
    <input
      class="px-2 border-l-4 border-solid bg-white rounded py-1 w-full transition focus:border-r-4 focus:shadow font-light"
      :class="[error ? 'border-error-base' : 'border-primary-200', {
        'pl-8': icon && (icon.position === 'left'),
        'pr-8': icon && (!icon.position || icon.position === 'right'),
      }]"
      v-bind:value="value"
      v-on:input="$emit('input', $event.target.value)"
      :placeholder="placeholder"
      :type="type"
      :inputmode="inputMode"
    >
  </div>
</template>

<script>
export default {
  props: {
    value: String,
    error: Boolean,
    type: {
      type: String,
      default: 'text'
    },
    placeholder: String,
    icon: Object,
    inputMode: String
  },
}
</script>
