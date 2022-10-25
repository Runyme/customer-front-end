<template>
  <Icon-Template :size="size">
    <svg viewBox="0 0 12 9" xmlns="http://www.w3.org/2000/svg">
      <path d="M11.8243 0.172304C11.59 -0.0574348 11.2101 -0.0574348 10.9757 0.172304L3.78737 7.21997L1.02428 4.51099C0.789972 4.28125 0.410097 4.28127 0.175746 4.51099C-0.058582 4.74071 -0.058582 5.11314 0.175746 5.34288L3.3631 8.46777C3.59734 8.69749 3.97749 8.69733 4.21163 8.46777L11.8243 1.00422C12.0586 0.774502 12.0586 0.402043 11.8243 0.172304Z"/>
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