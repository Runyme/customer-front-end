<template>
  <div>
    <MB-OverlaySpinner :loading="loading"/>
    <transition name="fade">
      <div v-if="!loading">
        <div class="w-full justify-between flex items-center xs:flex-col xs:items-start">
          <MB-Title text="Notas Fiscais"/>
          <router-link to="nota-fiscal/emitir" class="z-1 flex pb-8 items-center">
            <MB-Button text="Gerar NFS-e" class="pr-5 md:text-xs xs:text-base" :outlined="true" size="small" />
            <div class="bg-primary-500 rounded-full p-4 md:p-2 text-neutral-100 shadow -ml-4 xs:hidden">
              <Icon-Plus />
            </div>
          </router-link>
        </div>
        <b-table
          class="mb-table"
          :data="notasFiscais"
          paginated
          backend-pagination
          @page-change="onPageChange"
          :per-page="perPage"
          :total="total"
        >
          <template slot="empty">
            <Not-Found-Data />
          </template>
          <template slot-scope="props">
            <b-table-column class="whitespace-no-wrap" field="valor" label="Valor">
              R$ {{props.row.valor_nota}}
            </b-table-column>
            <b-table-column field="data_emissao" label="Data de Emissão">
              {{props.row.data_emissao ? getDate(props.row.data_emissao) : getDate(props.row.created_at) }}
            </b-table-column>
            <b-table-column field="previsao" label="Previsão">
              {{props.row.previsao_recebimento ? getDate(props.row.previsao_recebimento) : '-'}}
            </b-table-column>
            <b-table-column field="status" label="Status">
              <div 
                class="p-1 border rounded text-center"
                :class="{
                  'text-primary-500 border-primary-500': props.row.status.toLowerCase() === 'concluido',
                  'text-error-base border-error-base': props.row.status.toLowerCase() === 'rejeitado'
                }"
              >
                {{props.row.status}}
              </div>
            </b-table-column>
            <b-table-column>
              <div 
                class="flex justify-center" 
                :class="{
                  'hidden pointer-events-none': props.row.status.toLowerCase() !== 'concluido',
                }
              ">
                <button @click="cancelarNfse(props.row.id)"><Icon-Trash /></button>
                <button @click="getNfse(props.row.id)"><Icon-Document /></button>
              </div>
            </b-table-column>
          </template>
        </b-table>
      </div>
    </transition>
  </div>
</template>

<script>

import http from '../../services/http'
import { mapGetters } from 'vuex'
import moment from 'moment'
import NotFoundData from '../../components/layout/NotFoundData'

export default {
  name: 'NotaFiscal',
  components: { NotFoundData },
  data() {
    return {
      notasFiscais: [],
      perPage: 10,
      loading: false,
      total: null,
      page: 1
    }
  },
  methods: {
    fetchNotasFiscais() {
      http
        .get(`${process.env.VUE_APP_API_URL}/nfse/${this.getEmpresa.id}?page=${this.page}?per_page=${this.perPage}`)
        .then(res => {
          this.notasFiscais = res.data.data
          this.total = res.data.data.length
        })
        .catch(error => {
          this.$snack.error({
            text: 'Ocorreu um erro, tente novamente em alguns instantes.',
            button: 'X',
          })
        })
        .finally(() => this.loading = false)
    },
    getDate(date) {
      return moment(date).format('DD/MM/YYYY')
    },
    onPageChange(page) {
      this.page = page
      this.fetchNotasFiscais()
    },
    cancelarNfse(id){
      if(!confirm('Deseja realmente cancelar esta nota?')) return
      http
        .delete(`/nfse/${id}`)
        .then(response => {
          this.$snack.success({
            text: response.data.message,
            button: 'X'
          });
        })
        .catch(error => {
          this.$snack.error({
            text: error.response.data.message,
            button: 'X'
          })
        })
    },
    getNfse(id){
      window.open(`${process.env.VUE_APP_API_URL}/nfse/pdf?nfse_id=${id}&token=${localStorage.getItem('mb-token')}`)
    }
  },
  computed: {
    ...mapGetters(['getEmpresa'])
  },
  mounted() {
    this.loading = true
    this.fetchNotasFiscais()
    this.autoRefresh = setInterval(this.fetchNotasFiscais, 13000)
  },
  destroyed() {
    clearInterval(this.autoRefresh)
  }
}
</script>