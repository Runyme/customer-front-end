<template>
  <Icon-Template :size="size">
    <svg viewBox="0 0 14 14" xmlns="http://www.w3.org/2000/svg">
      <rect y="11.3137" width="16" height="3" rx="1.5" transform="rotate(-45 0 11.3137)"/>
      <rect x="11.3137" y="13.7488" width="16" height="3" rx="1.5" transform="rotate(-135 11.3137 13.7488)"/>
    </svg>
  </Icon-Template>
</template>

<script>

import IconTemplate from '@/components/icons/Template'

export default {
  props: ['size'],
  components: { IconTemplate }
}
</script>
