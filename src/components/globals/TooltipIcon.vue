<template>
  <div class="flex" ref="tooltip">
    <component
      :is="`Icon-${icon}`"
      :class="{
        'text-info-base': theme == 'default',
        'text-warning-base': theme == 'warning',
        'text-error-base': theme == 'error'
      }"
    />
  </div>
</template>

<script>

import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';

export default {
  props: {
    content: {
      type: String,
      required: true
    },
    theme: {
      type: String,
      default: 'default'
    },
    icon: {
      type: String,
      default: 'Info'
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  mounted() {
    const target = this.$refs.tooltip
    const instance = tippy(target);
    instance.setProps({
      content: this.content,
      theme: this.theme
    });
    if(this.show) instance.show();
  }
}
</script>