<template>
  <div class="w-full">
    <MB-Title text="Escolha uma empresa"/>
    <div class="w-full flex justify-center pb-8" v-if="loading">
      <MB-Spinner size="10"/>
    </div>
    <div class="flex flex-col" v-if="!loading">
      <div v-for="empresa in empresas" v-bind:key="empresa.id">
        <div
          @click="() => onSelectEmpresa(empresa)"
          class="bg-white rounded shadow flex border-t-2 p-4 justify-between mb-8 cursor-pointer transition hover:shadow-lg"
          :class="tokenizeOrCongelada(empresa) ? 'border-warning-base' : 'border-primary-500'"
        >
          <div class="flex flex-col flex-grow pr-4">
            <span class="font-medium font-display pb-2" v-text="empresa.nome" />
            <span class="text-neutral-700 text-sm" v-text="empresa.cnpj" />
          </div>
          <div 
            class="flex flex-col justify-center"
            v-if="tokenizeOrCongelada(empresa)"
          >
            <MB-TooltipIcon 
              content="Empresa Congelada" 
              theme="warning" 
              icon="Warning"
              v-if="empresa.congelada"
              class="my-1"
            />
            <MB-TooltipIcon 
              content="Cartão de crédito não cadastrado"
              theme="warning"
              icon="CreditCard"
              class="my-1"
              :show="true"
              v-if="empresa.forma_pagamento === 'cartao' && !empresa.tem_cartao"
            />
          </div>
        </div>
      </div>
    </div>
    <MB-Button text="Voltar" icon="ArrowLeft" outlined="true" @click.native="handleBack"/>
  </div>
</template>

<script>

import { mapActions } from 'vuex'

export default {
  data() {
    return {
      loading: false,
      empresas: []
    }
  },
  mounted() {
    this.fetchEmpresa()
  },
  methods: {
    ...mapActions([
      'setEmpresa',
      'logout'
    ]),
    handleBack() {
      this.$router.push({ name: 'AuthLogin' })
    },
    fetchEmpresa() {
      this.loading = true
      this.$http
        .get('empresas')
        .then(res => this.empresas = res.data.data)
        .catch(() => this.$snack.error('Ocorreu algum erro, tente mais tarde'))
        .finally(() => this.loading = false)
    },
    onSelectEmpresa(empresa) {
      this.setEmpresa(empresa)
      this.$router.push({ name: 'Dashboard' })
    },
    needTokenize(empresa) {
      return empresa.forma_pagamento === 'cartao' && !empresa.tem_cartao
    },
    tokenizeOrCongelada(empresa) {
      return empresa.congelada || this.needTokenize(empresa)
    }
  },
}
</script>