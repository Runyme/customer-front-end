<template>
  <Layout-Outside> 
    <template #SVG>
      <SVG-Check-List class="w-full h-full max-w-lg" />
    </template>
    <template #content>
      <transition name="fade-right" mode="out-in" appear>
        <div>
          <MB-Title text="Questionario" />
          <div class="w-full flex justify-center" v-if="loading">
            <MB-Spinner size="12"/>
          </div>
          <form
            class="flex items-start flex-col font-body"
            @submit.prevent="handleSubmit"
            v-else
          >
            <label class="flex flex-col w-full py-6 border-b-2 border-neutral-300" v-for="(pergunta, index) in perguntas" :key="pergunta.id">
              <div class="flex justify-between items-center">
                <div class="flex items-start">
                  <span class="bg-primary-500 text-neutral-100 font-bold px-3 py-1 rounded-full">{{index + 1}}</span>
                  <div class="flex flex-col pl-2">
                    <p>{{pergunta.pergunta}}</p>
                    <div class="flex pt-2">
                      <label class="flex">
                        <Input-Radio :mb-value="true" :mb-name="`pergunta-${pergunta.id}`" v-model="perguntas[index].resposta"/>
                        <span class="pl-2">Sim</span>
                      </label>
                      <label class="flex pl-4">
                        <Input-Radio :mb-value="false" :mb-name="`pergunta-${pergunta.id}`" v-model="perguntas[index].resposta"/>
                        <span class="pl-2">Não</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </label>
            <MB-Button class="mt-8 self-end" type="submit" text="Enviar" icon="Check" :loading="loadingButton"/>
          </form>
        </div>
      </transition>
    </template> 
  </Layout-Outside>
</template>

<script>

import { mapGetters } from 'vuex'
import http from '@/services/http'
import SVGCheckList from '@/components/svgs/CheckList'
import InputRadio from '@/components/helpers/InputRadio'
import LayoutOutside from '@/templates/Outside'

export default {
  components: { LayoutOutside, SVGCheckList, InputRadio },
  data() {
    return {
      perguntas: [],
      loading: false,
      loadingButton: false
    }
  },
  mounted() {
    this.fetchPerguntas()
  },
  computed: {
    ...mapGetters(['getCliente'])
  },
  methods: {
    fetchPerguntas() {
      this.loading = true
      http
        .get(`irpf/${this.getCliente.id}/questionario`)
        .then(res => this.perguntas = res.data)
        .finally(() => this.loading = false)
    },
    handleSubmit() {
      const naoRespondidas = this.perguntas.filter((pergunta) => !pergunta.hasOwnProperty('resposta'))
      if(naoRespondidas.length) {
        this.$snack.error({
          text: 'Por favor responda todas as perguntas',
          button: 'X'
        })
        return
      }
      this.loadingButton = true
      http
        .post(`irpf/${this.getCliente.id}/questionario`, this.perguntas)
        .catch(() => {
          this.$snack.error({
            text: 'Ocorreu um erro, tente novamente mais tarde',
            button: 'X'
          })
        })
        .finally(() => this.loadingButton = false)
    }
  },
}
</script>
