<template>
  <div class="w-20 h-20 rounded-full border-2 border-primary-600 overflow-hidden flex items-center justify-center">
    <div v-if="!avatar" class="w-full h-full flex items-center justify-center">
      <Avatar-Male v-if="sexo === 'M'" class="w-full" />
      <Avatar-Female v-if="sexo === 'F'" class="h-full" />
    </div>
    <div v-if="avatar" class="w-full h-full flex items-center justify-center">
      <img class="object-cover w-full h-full" :src="avatarUrl">
    </div>
  </div>
</template>

<script>

import AvatarFemale from '../svgs/AvatarFemale'
import AvatarMale from '../svgs/AvatarMale'

export default {
  props: ['sexo', 'avatar', 'base64'],
  components: { AvatarFemale, AvatarMale },
  computed: {
    avatarUrl() {
      return this.base64 ? this.avatar : `${process.env.VUE_APP_STORAGE_URL}${this.avatar}`;
    }
  }
}

</script>