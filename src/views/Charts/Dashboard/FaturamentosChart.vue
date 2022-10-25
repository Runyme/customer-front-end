<template>
  <div>
    <div class="flex justify-center pb-4 w-full" v-if="loadingChart">
      <MB-Spinner size="12"/>
    </div>
    <div v-else-if="!faturamentoChart.datasets[0].data.length">
      <Not-Found-Data text="Não há dados suficiente para exibir o gráfico"/>
    </div>
    <bar-chart
      :chart-data="faturamentoChart"
      :options="faturamento_chart_option"
      v-else
    />
  </div>
</template>

<script>

import BarChart from '@/components/Chart/BarChart'
import {limpaMoedaBr, moeda} from '@/utils/helpers'
import moment from 'moment'
import { mapGetters } from 'vuex'
import NotFoundData from '@/components/layout/NotFoundData'

export default {
  name: 'DashboardFaturamentosChart',
  components: { BarChart, NotFoundData },
  data() {
    return {
      loadingChart: true,
      faturamentoChartLoaded: false,
      faturamentoChart: {
        labels: [], // labels
        datasets: [
          {
            backgroundColor: '#51ccc1',
            data: [], // faturamentos
          }
        ]
      },
      faturamento_chart_option: {
        plugins: [],
        responsive: true,
        maintainAspectRatio: false,
        layout: {
          padding: {
            top: 40,
            right: 30,
            left: 30,
            botton: 0
          }
        },
        legend: {
          display: false
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero: true,
              callback: function (value) {
                if (parseInt(value) >= 1000) {
                  return moeda(value);
                } else {
                  return 'R$' + value;
                }
              }
            }
          }]
        },
        tooltips: {
          enabled: true,
          mode: 'single',
          callbacks: {
            label: function (tooltipItem, data) {
              let datasetLabel = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index];
              return moeda(datasetLabel)
            }
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'getEmpresaFaturamento',
    ])
  },
  created() {
    this.getEmpresaFaturamento
      .then(response => {
        response.data.data.reverse().map(item => {
          if (item.previsao === true) return
          this.faturamentoChart.labels.push(item.mes)
          this.faturamentoChart.datasets[0].data.push(parseInt(limpaMoedaBr(item.faturamento)))
        })
      })
      .finally(() => {
        this.faturamentoChartLoaded = true;
        this.loadingChart = false;
      })
  },
  methods: {
    getDate(date) {
      return moment(date).format('DD/MM/YYYY')
    },
  }
}
</script>