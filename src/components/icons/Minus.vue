<template>
  <Icon-Template :size="size">
    <svg viewBox="0 0 127 10" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="127" height="10" rx="5"/>
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