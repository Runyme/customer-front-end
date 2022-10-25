<template>
  <div>
    <div class="w-full justify-between flex items-center">
      <MB-Title text="Dashboard" />
      <!-- <a href="#" class="z-1 flex pb-8 items-center">
        <MB-Button text="Certidão Negativa" class="pr-5" :outlined="true" size="small" />
        <div class="bg-primary-500 rounded-full p-3 text-neutral-100 shadow -ml-4">
          <Icon-DownloadCloud size="large"/>
        </div>
      </a> -->
    </div>
    <div class="flex flex-wrap">
      <div class="w-1/2 pr-3 mb-6 lg:w-full lg:pr-0">
        <Card
          :header="{
            title: 'Faturamento e Impostos',
            icon: 'Taxes'
          }"
        >
          <div class="p-4 w-full">
            <Faturamento-Impostos-Chart />
          </div>
        </Card>
      </div>
      <div class="w-1/2 mb-6 pl-3 lg:w-full lg:pl-0">
        <Card
          :header="{
            title: 'Guias',
            icon: 'Document'
          }"
        >
          <div class="flex flex-col p-4 pb-0 w-full">
            <div class="flex justify-center pb-4" v-if="loadingGuias">
              <MB-Spinner size="12"/>
            </div>
            <div class="pb-4" v-if="!guias.length && !loadingGuias">
              <Not-Found-Data />
            </div>
            <a
              href="#"
              class="rounded hover:bg-neutral-700 transition hover:text-neutral-100 border-neutral-700 border-2 px-2 py-1 flex justify-between w-full mb-4 flex-grow items-center"
              v-for="guia in guias"
              v-bind:key="guia.id"
              @click.prevent="onDownloadGuia(guia)"
            >
              <span>{{guia.tipo}} - {{moment(guia.data_vencimento).format('MM/YYYY')}}</span>
              <Icon-Download class="ml-4"/>
            </a>
          </div>
        </Card>
      </div>
      <div class="mb-6 w-full">
        <Card
          :header="{
            title: 'Faturamentos',
            icon: 'Money'
          }"
        >
          <div class="p-4 w-full">
            <Faturamentos-Chart />
          </div>
        </Card>
      </div>
    </div>
    <Modal :opened="popup" v-on:close-modal="onCloseModal">
      <template v-slot:target>
        <div class="px-8 flex flex-col">
          <div class="w-full px-24 pt-16 sm:px-12 xs:px-4">
            <SVG-Popup-Credit-Card />
          </div>
          <p class="py-8 text-3xl font-display font-bold text-center leading-tight text-primary-700 sm:text-2xl xs:text-xl">Agora você poderá pagar os honorários no cartão de crédito e ganhar <span class="bg-primary-700 p-1 text-neutral-100">milhas.</span></p>
          <router-link to="/payment/tokenize" class="self-center">
            <MB-Button text="Cadaste-se já" class="text-xl sm:text-lg xs:text-base"/>
          </router-link>
          <p class="py-8 text-lg font-light xs:text-base"><span class="font-bold">Obs: </span>o débito só irá ocorrer no próximo mês</p>
        </div>
      </template>
    </Modal>
  </div>
</template>

<script>

import Card from '../components/helpers/Card'
import { mapGetters } from 'vuex'
import Modal from '../components/helpers/Modal'
import SVGPopupCreditCard from '../components/svgs/PopupCreditCard'
import FaturamentosChart from '@/views/Charts/Dashboard/FaturamentosChart'
import FaturamentoImpostosChart from '@/views/Charts/Dashboard/FaturamentoImpostosChart'
import http from '@/services/http'
import NotFoundData from '@/components/layout/NotFoundData'
import moment from 'moment'

export default {
  name: 'Dashboard',
  components: { Card, Modal, SVGPopupCreditCard, FaturamentosChart, FaturamentoImpostosChart, NotFoundData },
  data() {
    return {
      popup: false,
      loadingGuias: true,
      guias: [],
    }
  },
  computed: {
    ...mapGetters([
      'getEmpresa',
    ])
  },
  beforeCreate(){
    !function(f,b,e,v,n,t,s)
    {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
    fbq('init', '1037533976609845');
    fbq('track', 'PageView');
  },
  created() {
    this.popup = localStorage.getItem('mb-popup') !== 'closed'
    this.loadingChart = true;
    this.fetchGuias()
  },
  methods: {
    moment,
    fetchGuias() {
      this.loadingGuias = true;
      http
        .get(`guias/${this.getEmpresa.id}`)
        .then(res => this.guias = res.data.data.guias)
        .catch(() => {
          this.$snack.error({
            text: 'Ocorreu um erro na listagem de guias, tente novamente mais tarde.',
            button: 'X',
          })
        })
        .finally(() => this.loadingGuias = false)
    },
    onDownloadGuia(guia) {
      window.open(`${process.env.VUE_APP_API_URL}/arquivos/${guia.arquivo_id}/open?token=${localStorage.getItem('mb-token')}`)
    },
    onCloseModal() {
      localStorage.setItem('mb-popup', 'closed')
    },
  },
}
</script>
