<template>
  <Icon-Template :size="size">
    <svg viewBox="0 0 12 9" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.08066 0.126897C7.91718 -0.0422991 7.64509 -0.0422991 7.4759 0.126897C7.31242 0.290378 7.31242 0.562464 7.4759 0.725564L10.5424 3.79206H0.423372C0.187488 3.79244 0 3.97993 0 4.21581C0 4.4517 0.187488 4.64528 0.423372 4.64528H10.5424L7.4759 7.70607C7.31242 7.87526 7.31242 8.14773 7.4759 8.31083C7.64509 8.48003 7.91756 8.48003 8.08066 8.31083L11.8731 4.51839C12.0423 4.35491 12.0423 4.08282 11.8731 3.91972L8.08066 0.126897Z"/>
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