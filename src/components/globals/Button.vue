<template>
  <button 
    class="shadow rounded font-display flex items-center border-2 transition hover:shadow-xl justify-center"
    :class="{
      'text-primary-600 border-primary-600': outlined && !disabled,
      'bg-primary-600 text-neutral-100 border-primary-600': !outlined && !disabled,
      'bg-neutral-600 text-neutral-100 border-neutral-600': disabled,
      'px-3 py-2': !size,
      'px-2 py-1 text-sm': size === 'small',
      'px-4 py-3': size === 'large',
      'pointer-events-none': disabled
    }"
    :disabled="disabled || loading"
  >
    <span>{{text}}</span>
    <div class="ml-2" v-if="icon && !loading">
      <component :is="`Icon-${icon}`"></component>
    </div>
    <div class="ml-2" v-if="loading">
      <MB-Spinner color="primary-100" />
    </div>
  </button>
</template>

<script>
export default {
  props: ['text', 'icon', 'outlined', 'loading', 'disabled' , 'size'],
}
</script>