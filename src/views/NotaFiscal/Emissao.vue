<template>
  <div>
    <servico-nfse v-on:set-step="onSetStep" v-if="step === 1"/>
    <form-emissao v-on:set-step="onSetStep" v-if="step === 2"/>
  </div>
</template>

<script>

import ServicoNfse from './ServicoNfse'
import FormEmissao from './FormEmissao'
import { mapGetters } from 'vuex'

export default {
  name: 'EmitirNfse',
  components: {FormEmissao, ServicoNfse },
  data() {
    return {
      step: 1,
      servicos: [],
    }
  },
  methods: {
    onSetStep(step) {
      this.step = step;
    }
  },
  computed: {
    ...mapGetters(['getServico'])
  },
  mounted() {
    this.step = this.getServico ? 2 : 1
  }
}
</script>