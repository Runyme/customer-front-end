<template>
  <div class="flex flex-col items-start">
    <MB-OverlaySpinner :loading="loading"/>
    <MB-Title text="Emitir NFS-e"/>
    <form class="flex flex-col w-full font-light" @submit.prevent="submitNfse">
      <div class="flex flex-col pb-6">
        <span class="pb-2">Quem vai te pagar?</span>
        <div class="flex">
          <b-autocomplete
            v-model="tomadorCpfCnpj"
            :data="tomador_options"
            placeholder="Digite o Nome/CNPJ"
            class="flex-grow"
            field="nome_cnpj"
            @typing="fetchOptions"
            @select="option => form.tomador = option"
          >
            <template slot="empty">{{searchMessage}}</template>
          </b-autocomplete>
          <Novo-Tomador v-if="addButton" v-on:novo-tomador="onNovoTomador"/>
        </div>
      </div>
      <div class="flex flex-wrap">
        <div class="w-1/2 md:w-full md:pr-0 pr-3">
          <label class="flex flex-col pb-6">
            <div class="flex justify-between items-center pb-2">
              <span>Valor</span>
              <div v-if="$v.form.valor.$error">
                <MB-TooltipIcon
                  :content="validationsMessage.form.valor.required"
                  v-if="!$v.form.valor.required"
                  theme="error"
                />
                <MB-TooltipIcon
                  :content="validationsMessage.form.valor.minValue"
                  v-if="!$v.form.valor.minValue"
                  theme="error"
                />
              </div>
            </div>
            <Input-Money v-model.trim="$v.form.valor.$model" :error="$v.form.valor.$error"/>
          </label>
        </div>
        <div class="w-1/2 md:w-full md:pl-0 pl-3">
          <label class="flex flex-col pb-6">
            <span class="pb-2">Previsão Recebimento</span>
            <Input-Mask
              mask="##/##/####"
              placeholder="Informe a data da previsão"
              v-model="form.previsao_recebimento"
              :masked="true"
            />
          </label>
        </div>
      </div>
      <label class="flex flex-col pb-6">
        <div class="flex justify-between items-center pb-2">
          <span>Descrição</span>
          <div v-if="$v.form.discriminacao.$error">
            <MB-TooltipIcon
              :content="validationsMessage.form.discriminacao.required"
              v-if="!$v.form.discriminacao.required"
              theme="error"
            />
          </div>
        </div>
        <MB-Textarea
          placeholder="Descrição do serviço prestado" 
          v-model.trim="$v.form.discriminacao.$model"
          :error="$v.form.discriminacao.$error"
        />
      </label>
      <label class="flex flex-col pb-6">
        <div class="flex justify-between items-center pb-2">
          <span>Email para envio da nota</span>
          <div class="flex" v-if="$v.form.email_envio.$error">
            <MB-TooltipIcon
              :content="validationsMessage.form.email_envio.required"
              v-if="!$v.form.email_envio.required"
              theme="error"
            />
            <MB-TooltipIcon
              :content="validationsMessage.form.email_envio.email"
              v-if="!$v.form.email_envio.email"
              theme="error"
              class="ml-4"
            />
          </div>
        </div>
        <MB-Input 
          placeholder="Informe um email válido para receber a nota" 
          v-model.trim="$v.form.email_envio.$model"
          :error="$v.form.email_envio.$error"
        />
      </label>
      <a href="#" class="mb-6 self-start" @click.prevent="showDetails = !showDetails">
        <span class="flex items-center" v-if="showDetails">
          <Icon-Minus size="smaller" class="text-primary-500"/>
          <span class="pl-2">Menos detalhes</span>
        </span>
        <span class="flex items-center" v-if="!showDetails">
          <Icon-Plus size="smaller" class="text-primary-500"/>
          <span class="pl-2">Mais detalhes</span>
        </span>
      </a>
      <div v-if="showDetails">
        <div class="flex items-center">
          <label class="flex flex-col pb-6 w-1/2 pr-3 md:w-full md:pr-0">
            <div class="flex justify-between items-center pb-2">
              <span>Aliquota</span>
              <div v-if="$v.form.aliquota.$error">
                <MB-TooltipIcon
                  :content="validationsMessage.form.aliquota.required"
                  v-if="!$v.form.aliquota.required"
                  theme="error"
                />
              </div>
            </div>
            <Input-Mask
              :masked="true"
              :mask="['#,##', '#,####']"
              placeholder="Informe a alíquota"
              v-model.trim="$v.form.aliquota.$model" :error="$v.form.aliquota.$error"
            />
          </label>
        </div>
        <div class="flex flex-wrap pb-8">
          <label class="flex pr-3 w-1/2 md:w-full md:pr-0">
            <Input-Checkbox v-model="form.iss_retido" :error="form.iss_retido"/>
            <span class="pl-4">Imposto municipal retido</span>
          </label>
          <label class="flex w-1/2 md:w-full pl-3 md:pl-0 md:pt-4 items-center" v-if="presumido">
            <span class="w-4 h-4 border-2 rounded border-primary-500 transition bg-primary-500"></span>
            <span class="pl-4">Impostos federais retido</span>
          </label>
        </div>
        <div class="pb-2" v-if="presumido">
          <div class="flex flex-wrap">
            <div class="w-1/2 xs  :w-full xs:pr-0 pr-3">
              <label class="flex flex-col pb-6">
                <div class="flex justify-between items-center pb-2">
                  <span>PIS</span>
                  <div v-if="$v.form.retencao.pis.aliquota.$error">
                    <MB-TooltipIcon
                      :content="validationsMessage.form.retencao.pis.aliquota"
                      v-if="!$v.form.retencao.pis.aliquota.required"
                      theme="error"
                    />
                  </div>
                </div>
                <Input-Mask 
                  :masked="true"
                  :mask="['#,##', '#,####']" 
                  v-model.trim="$v.form.retencao.pis.aliquota.$model"
                  :error="$v.form.retencao.pis.aliquota.$error"
                />
              </label>
            </div>
            <div class="w-1/2 xs  :w-full xs:pl-0 pl-3">
              <label class="flex flex-col pb-6">
                <div class="flex justify-between items-center pb-2">
                  <span>COFINS</span>
                  <div v-if="$v.form.retencao.cofins.aliquota.$error">
                    <MB-TooltipIcon
                      :content="validationsMessage.form.retencao.cofins.aliquota"
                      v-if="!$v.form.retencao.cofins.aliquota.required"
                      theme="error"
                    />
                  </div>
                </div>
                <Input-Mask 
                  :masked="true"
                  :mask="['#,##', '#,####']" 
                  v-model.trim="$v.form.retencao.cofins.aliquota.$model"
                  :error="$v.form.retencao.cofins.aliquota.$error"
                />
              </label>
            </div>
          </div>
          <div class="flex flex-wrap">
            <div class="w-1/2 pr-3 xs :w-full xs:pr-0">
              <label class="flex flex-col pb-6">
                <div class="flex justify-between items-center pb-2">
                  <span>IRRF</span>
                  <div v-if="$v.form.retencao.irrf.aliquota.$error">
                    <MB-TooltipIcon
                      :content="validationsMessage.form.retencao.irrf.aliquota"
                      v-if="!$v.form.retencao.irrf.aliquota.required"
                      theme="error"
                    />
                  </div>
                </div>
                <Input-Mask 
                  :masked="true"
                  :mask="['#,##', '#,####']" 
                  v-model.trim="$v.form.retencao.irrf.aliquota.$model"
                  :error="$v.form.retencao.irrf.aliquota.$error"
                />
              </label>
            </div>
            <div class="w-1/2 pl-3 xs :w-full xs:pl-0">
              <label class="flex flex-col pb-6">
                <div class="flex justify-between items-center pb-2">
                  <span>CSLL</span>
                  <div v-if="$v.form.retencao.csll.aliquota.$error">
                    <MB-TooltipIcon
                      :content="validationsMessage.form.retencao.csll.aliquota"
                      v-if="!$v.form.retencao.csll.aliquota.required"
                      theme="error"
                    />
                  </div>
                </div>
                <Input-Mask 
                  :masked="true"
                  :mask="['#,##', '#,####']" 
                  v-model.trim="$v.form.retencao.csll.aliquota.$model"
                  :error="$v.form.retencao.csll.aliquota.$error"
                />
              </label>
            </div>
          </div>
          <div class="flex flex-wrap">
            <div class="w-1/2 pr-3 xs :w-full xs:pr-0">
              <label class="flex flex-col pb-6">
                <div class="flex justify-between items-center pb-2">
                  <span>INSS</span>
                  <div v-if="$v.form.retencao.inss.aliquota.$error">
                    <MB-TooltipIcon
                      :content="validationsMessage.form.retencao.inss.aliquota"
                      v-if="!$v.form.retencao.inss.aliquota.required"
                      theme="error"
                    />
                  </div>
                </div>
                <Input-Mask 
                  :masked="true"
                  :mask="['#,##', '#,####']" 
                  v-model.trim="$v.form.retencao.inss.aliquota.$model"
                  :error="$v.form.retencao.inss.aliquota.$error"
                />
              </label>
            </div>
            <div class="w-1/2 pl-3 xs :w-full xs:pl-0">
              <label class="flex flex-col pb-6">
                <span class="pb-2">Outros</span>
                <Input-Mask 
                  :masked="true"
                  :mask="['#,##', '#,####']" 
                  v-model.trim="form.retencao.outros"
                />
              </label>
            </div>
          </div>
        </div>
      </div>
      <div class="flex w-full justify-between">
        <MB-Button class="self-start" text="Voltar" icon="ArrowLeft" outlined="true" @click.native="handleBack" type="button"/>
        <MB-Button class="self-start" text="Emitir" icon="Check" type="submit"/>
      </div>
    </form>
  </div>
</template>

<script>

import { required, requiredIf, minValue, email } from 'vuelidate/lib/validators'
import vueSelect from 'vue-select'
import { mapGetters, mapActions } from 'vuex'
import NovoTomador from '@/views/NotaFiscal/NovoTomador'
import InputMoney from '@/components/helpers/InputMoney'
import InputMask from '@/components/helpers/InputMask'
import InputCheckbox from '@/components/helpers/InputCheckbox'
import http from "@/services/http"
import MBTextarea from '@/components/helpers/Textarea'

export default {
  components: { vueSelect, InputMoney, InputMask, InputCheckbox, NovoTomador, MBTextarea },
  data() {
    return {
      showDetails: false,
      addButton: false,
      tomador_options: [],
      searchMessage: '',
      loading: false,
      form: {
        discriminacao: null,
        previsao_recebimento: null,
        email_envio: null,
        valor: 0,
        iss_retido: false,
        aliquota: null,
        tomador: {},
        retencao: {
          pis: {aliquota: ''},
          cofins: {aliquota: ''},
          csll: {aliquota: ''},
          inss: {aliquota: ''},
          irrf: {aliquota: ''},
          outrasRetencoes: ''
        },
      },
      validationsMessage: {
        form: {
          valor: {
            required: 'Insira um valor para o serviço prestado',
            minValue: 'O valor deve ser maior que R$ 1,00'
          },
          discriminacao: {required: 'Insira uma descrição do serviço prestado'},
          email_envio: {
            required: 'Insira um email para o envio',
            email: 'Insira um email válido'
          },
          aliquota: {required: 'Insira uma aliquota'},
          retencao: {
            pis: {aliquota: 'Insira uma aliquota para o PIS'},
            cofins: {aliquota: 'Insira uma aliquota para o COFINS'},
            csll: {aliquota: 'Insira uma aliquota para o CSLL'},
            inss: {aliquota: 'Insira uma aliquota para o INSS'},
            irrf: {aliquota: 'Insira uma aliquota para o IRRF'},
          }
        }
      }
    }
  },
  validations() {
    return {
      form: {
        valor: {
          required,
          minValue: minValue(1)
        },
        discriminacao: {required},
        email_envio: {
          required,
          email
        },
        aliquota: {required},
        retencao: {
          pis: {
            aliquota: {
              requiredIf: requiredIf(() => this.presumido)
            }
          },
          cofins: {
            aliquota: {
              requiredIf: requiredIf(() => this.presumido)
            }
          },
          csll: {
            aliquota: {
              requiredIf: requiredIf(() => this.presumido)
            }
          },
          inss: {
            aliquota: {
              requiredIf: requiredIf(() => this.presumido)
            }
          },
          irrf: {
            aliquota: {
              requiredIf: requiredIf(() => this.presumido)
            }
          },
        }
      },
    }
  },
  computed: {
    ...mapGetters([
      'getEmpresa',
      'getServico',
      'getTomador'
    ]),
    presumido() {
      return this.getEmpresa.regime_tributario === 'Presumido'
    },
    tomadorCpfCnpj: {
      get() {
        return this.form.tomador ? this.form.tomador.nome_cnpj : ''
      },
      set() {
        return
      }
    },
    payload() {
      return {
        ...this.form,
        tomador_id: this.form.tomador.id,
        servico_id: this.form.id,
      }
    }
  },
  mounted() {
    this.form = {
      ...this.form,
      ...this.getServico
    }
    this.form.tomador = this.getTomador
    this.showDetails = !this.getServico.aliquota || this.presumido
  },
  methods: {
    ...mapActions(['setTomador', 'setServico']),
    handleBack() {
      this.$emit('set-step', 1)
    },
    fetchOptions(search) {
      if (!isNaN(search.replace(/[,./-]/g, ''))) search = search.replace(/[^0-9]/g, '')
      this.searchMessage = 'Pesquisando...'
      if (search.length < 4) return
      this.loading = true
      this.searchMessage = 'Nenhum resultado encotrado, clique em adicionar para cadastrar um novo tomador'
      http
        .get(`nfse/tomador/${search}`)
        .then(response => {
          this.tomador_options = response.data.map(item => {
            item.nome_cnpj = `${item.razao_social} - ${item.cpf_cnpj}`
            return item
          })
          this.addButton = !this.tomador_options.length
        })
        .finally(() => this.loading = false)
    },
    submitNfse() {
      if (this.$v.$invalid || !this.form.tomador.cpf_cnpj) {
        this.$snack.error({
          text: 'Preencha corretamente o formulário',
          button: 'X',
        })
        return
      }
      this.loading = true
      http
        .post(`nfse/${this.getEmpresa.id}/emitir`, this.payload)
        .then(response => {
          this.$snack.success({
            text: response.data.message,
            button: 'X'
          })
          this.$router.push({ name: 'NotaFiscal' })
        })
        .catch(error => {
          this.$snack.error({
            text: error.response.data.message,
            button: 'X'
          })
        })
        .finally(() => this.loading = false)
    },
    onNovoTomador() {
      this.form.tomador = this.getTomador
    }
  },
  destroyed() {
    this.setTomador(null)
    this.setServico(null)
  }
}
</script>