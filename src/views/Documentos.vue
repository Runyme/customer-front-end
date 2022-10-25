<template>
  <div>
    <MB-OverlaySpinner :loading="loading" />
    <transition name="fade">
      <div v-if="!loading">
        <div class="w-full justify-between flex items-center">
          <MB-Title text="Documentos" />
          <!-- <a href="#" class="z-1 flex pb-8 items-center">
            <MB-Button text="Adicionar Arquivo" class="pr-5" :outlined="true" size="small" />
            <div class="bg-primary-500 rounded-full p-4 text-neutral-100 shadow -ml-4">
              <Icon-Plus />
            </div>
          </a> -->
        </div>
        <MB-Input 
          placeholder="Digite o nome do arquivo" 
          class="mb-4 max-w-md" 
          :icon="{ name: 'Search'}"
          v-model="search"
        />
        <div class="flex flex-wrap w-full font-light">
          <Not-Found-Data class="w-full flex justify-center py-8" v-if="!documentos.length" />
          <a 
            href="#"
            @click.prevent="downloadDocument(documento.id)"
            class="flex justify-center items-center w-1/3 md:w-1/2 xs:w-full p-4"
            v-for="documento in filteredDocumentos"
            v-bind:key="documento.id"
          >
            <MB-Tooltip class="w-full" :content="documento.nome" theme="neutral">
              <div class="shadow border-t-2 border-primary-500 hover:shadow-xl bg-white px-3 py-4 md:px-6 xs:px-8 flex flex-col items-center transition overflow-hidden rounded w-full">
                <Icon-Document size="large"/>
                <p class="py-4 text-xl leading-tight text-center truncate max-w-full">{{documento.nome}}</p>
                <p class="flex flex-col text-center text-neutral-600 text-sm">
                  <span>Adicionado:</span>
                  <span>{{getDate(documento.created_at)}}</span>
                </p>
              </div>
            </MB-Tooltip>
          </a>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>

import http from '../services/http'
import { mapGetters } from 'vuex'
import moment from 'moment'
import NotFoundData from '../components/layout/NotFoundData'

export default {
  components: { NotFoundData },
  data() {
    return {
      documentos: [],
      loading: false,
      search: ''
    }
  },
  methods: {
    fetchDocumentos() {
      this.loading = true
      http
        .get(`/files/${this.getEmpresa.id}`)
        .then(res => this.documentos = res.data.data)
        .catch(error => {
          this.$snack.error({
            text: 'Ocorreu um erro, tente mais tarde.',
            button: 'X',
          })
        })
        .finally(() => this.loading = false)
    },
    getDate(date) {
      return moment(date).format('DD/MM/YYYY')
    },
    downloadDocument(id) {
      window.open(`${process.env.VUE_APP_API_URL}/files/download/${id}?token=${localStorage.getItem('mb-token')}`)
    }
  },
  computed: {
    ...mapGetters(['getEmpresa']),
    filteredDocumentos() {
      return this.documentos.filter((documento) => {
        const nome = documento.nome.toLowerCase()
        const search = this.search.toLowerCase()
        return nome.match(search)
      });
    },
  },
  mounted() {
    this.fetchDocumentos()
  }
}
</script>