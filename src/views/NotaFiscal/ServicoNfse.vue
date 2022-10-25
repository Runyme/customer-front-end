<template>
  <div class="flex flex-col items-start">
    <MB-Title text="Selecione um serviço" />
    <MB-OverlaySpinner :loading="loading" />
    <MB-Input
      v-model="search" 
      :icon="{ name: 'Search' }"
      placeholder="Digite o nome do serviço"
      class="w-1/2 sm:w-full"
    />
    <div class="flex flex-col pt-8 font-light w-full">
      <Card 
        class="cursor-pointer mb-4"
        :color="isServicoSelecionado(servico.id) ? 'neutral-700' : 'neutral-400'"
        v-for="servico in fliteredServicos"
        v-bind:key="servico.id"
        @click.native="selectServico(servico)"
      >
        <div 
          class="p-4 flex w-full rounded-b"
          :class="{ 'bg-neutral-700 text-white transition': isServicoSelecionado(servico.id) }"
        >
          <div class="pr-2 flex-grow">
            <p class="font-display text-lg pb-2 xs:text-base">
              <span class="font-bold pr-2">{{servico.codigo ? servico.codigo : servico.servico.codigo}}</span>
              {{servico.nome ? servico.nome : servico.servico.nome}}
            </p>
            <p class="pb-2 xs:text-sm">{{servico.discriminacao ? servico.discriminacao : servico.servico.discriminacao}}</p>
            <div class="text-sm flex xs:text-xs sm:flex sm:flex-col">
              <p>
                <span class="font-semibold">CNAE</span>: {{servico.cnae ? servico.cnae : servico.servico.cnae}}
              </p>
              <p>
                <span class="sm:ml-0 ml-3 font-semibold">Cod. Tributação</span>: {{servico.servico ? servico.servico.codigoTributacao : (servico.codigoTributacao ? servico.codigoTributacao : 'N/A') }}
              </p>
            </div>
            <p class="text-sm pt-2 xs:text-xs" v-if="servico.tomador">
              <span class="font-semibold">Tomador</span>: {{servico.tomador.razao_social}} - {{servico.tomador.cpf_cnpj}} 
            </p>
          </div>
          <div class="flex items-center pl-2 sm:hidden">
            <div 
              class="p-1 rounded-full border-2"
              :class="isServicoSelecionado(servico.id) ? 'text-neutral-700 border-neutral-700 bg-white' : 'text-white border-primary-500'"
            >
              <Icon-Check 
                size="smallest"
                class="transition"
              />
            </div>
          </div>
        </div>
      </Card>
      <Not-Found-Data v-if="!fliteredServicos.length"/>
    </div>
    <div class="w-full flex xs:flex-col">
      <MB-Button
        class="mt-4 xs:order-1"
        text="Adicionar Serviço"
        icon="Plus"
        :outlined="true"
        @click.native="addServicos"
        v-if="temHistorico"
      />
      <div class="flex-grow"></div>
      <MB-Button
        class="mt-4"
        text="Continuar"
        icon="ArrowRight"
        @click.native="nextStep"
      />
    </div>
  </div>
</template>

<script>

import Card from '../../components/helpers/Card'
import { mapGetters, mapActions } from 'vuex'
import http from '../../services/http'
import NotFoundData from '../../components/layout/NotFoundData'

export default {
  components: { Card, NotFoundData },
  data() {
    return {
      servicoSelecionado: {},
      idTest: 1,
      temHistorico: false,
      servicos: [],
      servicosHistorico: [],
      loading: false,
      search: ''
    }
  },
  computed: {
    ...mapGetters(['getEmpresa']),
    renderedServicos() {
      return this.temHistorico ? this.servicosHistorico : this.servicos
    },
    fliteredServicos() {
      return this.renderedServicos.filter((servico) => {
        const nome = servico.nome ? servico.nome.toLowerCase() : servico.servico.nome.toLowerCase()
        const search = this.search.toLowerCase()
        return nome.match(search)
      });
    },
    normalizeServicoSelecionado() {
      return this.temHistorico ? {
        aliquota: this.servicoSelecionado.aliquota,
        email_envio: this.servicoSelecionado.email_envio,
        valor: this.servicoSelecionado.valor,
        iss_retido: this.servicoSelecionado.iss_retido,
        discriminacao: this.servicoSelecionado.discriminacao,
        retencao: this.servicoSelecionado.retencao,
      } : {}
    }
  },
  mounted(){
    this.fetchServicos()
  },
  methods: {
    ...mapActions([
      'setServico',
      'setTomador'
    ]),
    nextStep() {
      if(!this.servicoSelecionado.id) {
        this.$snack.error({
          text: 'Selecione um serviço antes de avançar',
          button: 'X'
        })
        return
      }
      this.setServico({
        ...this.temHistorico ? this.servicoSelecionado.servico : this.servicoSelecionado,
        ...this.normalizeServicoSelecionado,
      })
      if(this.temHistorico) this.setTomador(this.servicoSelecionado.tomador)
      this.$emit('set-step', 2)
    },
    isServicoSelecionado(id) {
      return this.servicoSelecionado.id === id
    },
    async fetchServicos(){
      this.loading = true

      // servios historico
      await http
        .get(`nfse/${this.getEmpresa.id}/servico-vinculado`)
        .then(response => {
          if(response.data.data.length) {
            this.servicosHistorico = response.data.data
            this.temHistorico = true
          }
        })
        .catch(error => {
          this.$snack.error({
            message: error.response.data.message,
            button: 'X'
          })
        })

      // servicos
      await http
        .get(`nfse/servicos`)
        .then(response => this.servicos = response.data.data)
        .catch(error => {
          this.$snack.error({
            message: error.response.data.message,
            button: 'X'
          })
        })
      this.loading = false
    },
    selectServico(servico) {
      this.servicoSelecionado = servico
    },
    addServicos() {
      return this.temHistorico = false
    }
  },
}
</script>