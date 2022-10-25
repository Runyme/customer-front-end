<template>
  <textarea
    class="mb-textarea px-2 border-l-4 border-solid bg-white rounded py-1 w-full focus:border-r-4 focus:shadow font-light shadow rounded border-t-0 border-b-0 border-primary-500"
    :class="[error ? 'border-error-base' : 'border-primary-200']"
    v-bind:value="value"
    v-on:input="$emit('input', $event.target.value)"
    :placeholder="placeholder"
    :type="type"
  >
  </textarea>
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
  },
}
</script>

<style scoped>
  .mb-textarea {
    transition:
      border-right-width .3s ease;
  }
</style>