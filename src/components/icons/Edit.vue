<template>
  <Icon-Template :size="size">
    <svg viewBox="0 0 529 527" xmlns="http://www.w3.org/2000/svg">
      <path d="M328.883 88.125L436.473 195.714L164.133 468.054L56.6039 360.465L328.883 88.125ZM518.113 62.177L470.132 14.196C451.589 -4.34699 421.479 -4.34699 402.873 14.196L356.912 60.157L464.502 167.747L518.113 114.136C532.495 99.753 532.495 76.559 518.113 62.177ZM0.299886 511.69C-1.65811 520.502 6.29789 528.398 15.1109 526.255L135.002 497.186L27.4729 389.597L0.299886 511.69Z"/>
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