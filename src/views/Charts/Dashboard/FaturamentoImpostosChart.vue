<template>
  <div>
    <div class="flex justify-center pb-4 w-full" v-if="loadingChart">
      <MB-Spinner size="12"/>
    </div>
    <div class="flex flex-col" v-else>
      <div class="flex flex-col items-center pt-2 pb-8">
        <p class="font-bold">Data de competência</p>
        <span class="font-light" v-text="dataCompetencia" v-if="getEmpresa.regime_tributario === 'SN'"/>
        <span class="font-light" v-text="trimestre" v-else/>
      </div>
      <div class="pb-8 flex justify-center max-w-full">
        <transition name="fade" mode="out-in">
          <Not-Found-Data :text="notFoundMessage" v-if="notFoundData"/>
          <Pie-Chart 
            :chart-data="chartData"
            :options="chartOptions"
            v-else
          />
        </transition>
      </div>
      <div class="flex justify-center">
        <div class="flex pb-4 flex-col font-light items-center">
          <div class="flex pb-4" v-if="getEmpresa.regime_tributario === 'SN'">
            <p class="pr-3">
              Último mês
            </p>
            <b-switch v-model="mesOrTrimestre" false-value="mes" true-value="trimestre" outlined>
              Último trimestre
            </b-switch>
          </div>
          <div class="flex">
            <p class="pr-3">
              Porcentagem
            </p>
            <b-switch v-model="isValor" outlined>
              Valor
            </b-switch>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

import PieChart from '@/components/Chart/PieChart'
import { twColors, twFonts } from '@/services/tailwindConfig'
import { mapGetters } from 'vuex'
import NotFoundData from '@/components/layout/NotFoundData'
import { moeda } from '@/utils/helpers'

export default {
  name: 'DashboardFaturamentoImpostosoChart',
  components: { PieChart, NotFoundData },
  data() {
    return {
      loadingChart: true,
      notFoundData: false,
      notFoundMessage: '',
      isTrimestre: false,
      isValor: false,
      mesOrTrimestre: 'mes',
      values: {},
      chartOptions: {
        responsive: true,
        legend: {
          position: 'bottom',
          labels: {
            fontSize: 16,
            fontColor: twColors.neutral[700],
            fontFamily: twFonts.body[0],
            padding: 20,
          }
        },
        tooltips: {
          callbacks: {
            label(tooltipItem, data) {
              return moeda(data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index])
            }
          }
        }
      }
    }
  },
  computed: {
    ...mapGetters(['getEmpresa','getEmpresaFaturamentoImpostos']),
    faturamento() {
      return this.values[this.mesOrTrimestre] ? this.values[this.mesOrTrimestre].faturamento : 0
    },
    imposto() {
      return this.values[this.mesOrTrimestre] ? this.values[this.mesOrTrimestre].impostos : 0
    },
    dataCompetencia() {
      return this.values[this.mesOrTrimestre] ? this.values[this.mesOrTrimestre].data_competencia : ''
    },
    trimestre() {
      return this.values.trimestre ? this.values.trimestre.trimestre : ''
    },
    formatter() {
      if(this.isValor) return value => moeda(Number(value))
      return (value, ctx) => {
        let sum = 0;
        let dataArr = ctx.chart.data.datasets[0].data;
        dataArr.map(data => {
            sum += data
        });
        let percentage = (value*100 / sum).toFixed(2)+"%";
        return percentage
      }
    },
    chartData() {
      return {
        labels: ['Valor Líquido', 'Impostos'],
        datasets: [{
          data: [this.faturamento, this.imposto],
          backgroundColor: [twColors.primary[500], twColors.primary[200]],
          datalabels: {
            formatter: this.formatter,
            backgroundColor: `rgba(0, 0, 0, .5)`,
            borderRadius: 4,
            color: twColors.neutral[100],
            padding: 8,
            font: {
              family: twFonts.body,
            }
          }
        }]
      }
    },
  },
  beforeMount() {
    this.getEmpresaFaturamentoImpostos
      .then(res => this.values = res.data.data)
      .catch(err => {
        this.notFoundData = true
        this.notFoundMessage = err.response.data.message
      })
      .finally(() => this.loadingChart = false)
    if(this.getEmpresa.regime_tributario === 'presumido') this.isTrimestre = true
  },
}
</script>