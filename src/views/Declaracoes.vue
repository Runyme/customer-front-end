<template>
  <div>
    <MB-Title text="Declarações"/>
    <div class="flex mb-8 flex-wrap">
      <div class="w-1/2 pr-4 sm:mb-8 sm:pr-0 sm:w-full">
        <Card
          :header="{
            title: 'Faturamento',
            icon: 'Money'
          }"
        >
          <div class="p-4 w-full font-light flex justify-center">
            <MB-Spinner size="8" v-if="faturamento.loading"/>
            <div class="flex items-center flex-col w-full" v-if="!faturamento.loading">
              <p><span class="font-semibold">{{qtdPrevisao}}</span> meses de previsão</p>
              <MB-Button 
                @click.native="downloadDeclaracaoFaturamento" 
                class="text-sm mt-4 w-full"
                text="Gerar Declaração"
              />
              <Float-List class="w-full mt-4">
                <template v-slot:trigger>
                  <MB-Button class="text-sm w-full" text="Enviar por Email"/>
                </template>
                <template v-slot:target>
                  <div class="bg-neutral-200 shadow-xl flex p-6" style="width: 20rem;">
                    <form @submit.prevent="sendDeclaracaoFaturamentoEmail" class="w-full flex">
                      <MB-Input placeholder="Insira o e-mail" class="flex mr-4" v-model="faturamento.email"/>
                      <MB-Button text="Enviar" class="py-1" size="small" :loading="faturamento.loadingEmail"/>
                    </form>
                  </div>
                </template>
              </Float-List>
            </div>
          </div>
        </Card>
      </div>
      <div class="w-1/2 pl-4 sm:pl-0 sm:w-full">
        <Card
          :header="{
            title: 'Renda',
            icon: 'Money'
          }"
        >
          <div class="flex p-4 w-full items-center flex-col font-light">
            <MB-Spinner size="8" v-if="renda.loading"/>
            <div class="flex items-center flex-col w-full" v-if="!renda.loading">
              <p class="font-semibold">{{renda.valor || 'Indisponivel'}}</p>
              <MB-Button 
                class="text-sm mt-4 w-full" 
                @click.native="downloadDeclaracaoRenda" 
                text="Gerar Declaração"
                :disabled="renda.indisponivel"
              />
              <Float-List 
                class="w-full mt-4" 
                position="top-right"
                :class="{ 'pointer-events-none': renda.indisponivel}"
              >
                <template v-slot:trigger>
                  <MB-Button class="text-sm w-full" text="Enviar por Email" :disabled="renda.indisponivel"/>
                </template>
                <template v-slot:target>
                  <div class="bg-neutral-200 shadow-xl flex p-6" style="width: 20rem;">
                    <form class="w-full flex" @submit.prevent="sendDeclaracaoRendaEmail">
                      <MB-Input placeholder="Insira o e-mail" class="flex mr-4" v-model="renda.email"/>
                      <MB-Button text="Enviar" class="py-1" size="small" :loading="renda.loadingEmail"/>
                    </form>
                  </div>
                </template>
              </Float-List>
            </div>
          </div>
        </Card>
      </div>
    </div>
    <table class="mb-table" v-if="!faturamento.loading">
      <thead class="mb-table__header">
        <tr>
          <th>Mês</th>
          <th>Faturamento</th>
        </tr>
      </thead>
      <tbody class="mb-table__body">
        <tr v-for="faturamento in faturamento.items" v-bind:key="faturamento.id">
          <td>{{faturamento.mes}}</td>
          <td>{{faturamento.faturamento}}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>

import Card from '../components/helpers/Card'
import FloatList from '../components/helpers/FloatList'
import { mapGetters } from 'vuex'
import http from '../services/http'

export default {
  components: {Card, FloatList},
  data() {
    return {
      faturamento: {
        items: [],
        email: '',
        loading: false,
        loadingEmail: false,
      },
      renda: {
        valor: '',
        indisponivel: false,
        email: '',
        loading: false,
        loadingEmail: false,
      }
    }
  },
  computed: {
    ...mapGetters([
      'getCliente',
      'getEmpresa',
      'getEmpresaFaturamento',
    ]),
    qtdPrevisao() {
      const previsoes = this.faturamento.items.filter(faturamento => faturamento.previsao)
      return previsoes.length
    }
  },
  mounted() {
    this.fetchFaturamento()
    this.fetchRenda()
  },
  methods: {
    fetchFaturamento() {
      this.faturamento.loading = true
      this.getEmpresaFaturamento
        .then(res => this.faturamento.items = res.data.data)
        .catch(error => {
          this.$snack.error({
            text: error.response.data.message,
            button: 'X',
          })
        })
        .finally(() => this.faturamento.loading = false)
    },
    fetchRenda() {
      this.renda.loading = true
      http
        .get(`faturamento/renda/${this.getEmpresa.id}?empresa_id=${this.getEmpresa.id}&cliente_id=0`)
        .then(res => {
          this.renda.valor = res.data.data.renda_media
          this.renda.indisponivel = false
        })
        .catch(error => this.renda.indisponivel = true)
        .finally(() => this.renda.loading = false)
    },
    downloadDeclaracaoFaturamento() {
      window.open(`${process.env.VUE_APP_API_URL}/declaracao/faturamento/?empresa_id=${this.getEmpresa.id}&token=${localStorage.getItem('mb-token')}`);
    },
    sendDeclaracaoFaturamentoEmail() {
      this.faturamento.loadingEmail = true;
      const form = {
        sendEmail: true,
        nome: this.getCliente.nome_completo,
        email: this.faturamento.email,
        empresa_id: this.getEmpresa.id
      }
      http
        .post('declaracao/faturamento/', form)
        .then(() => this.$snack.success('Email enviado com sucesso'))
        .catch(error => this.$snack.error(error.response.data.message))
        .finally(() => this.faturamento.loadingEmail = false)
    },
    downloadDeclaracaoRenda() {
      window.open(`${process.env.VUE_APP_API_URL}/declaracao/renda/?cliente_id=${this.getCliente.id}&empresa_id=${this.getEmpresa.id}&token=${localStorage.getItem('mb-token')}`)
    },
    sendDeclaracaoRendaEmail() {
      const form = {
        sendEmail: true,
        email: this.renda.email,
        empresa_id: this.getEmpresa.id,
        cliente_id: this.getCliente.id
      }
      http
        .post('declaracao/renda', form)
        .then(() => this.$snack.success('Email enviado com sucesso'))
        .catch(error => this.$snack.error(error.response.data.message))
        .finally(() => this.renda.loadingEmail = false)
    },
  },
}
</script>