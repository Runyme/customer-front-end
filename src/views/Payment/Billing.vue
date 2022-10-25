<template>
  <Layout-Outside> 
    <template #SVG>
      <SVG-Billing class="w-full h-full max-w-lg"/>
    </template>
    <template #content>
      <transition name="fade" mode="out-in" appear>
        <div class="w-full flex justify-center" v-if="loading">
          <MB-Spinner size="20" />
        </div>
        <div class="flex flex-col" v-else>
          <MB-Title text="Inadimplências"/>
          <div class="max-w-full overflow-x-auto mb-8 shadow hover:shadow-xl transition">
            <table class="mb-table mb-table--error">
              <thead class="mb-table__header">
                <tr>
                  <th>Valor</th>
                  <th>Mês</th>
                  <th>Vencimento</th>
                </tr>
              </thead>
              <tbody class="mb-table__body">
                <tr v-for="inadimplencia in getEmpresa.fatura" v-bind:key="inadimplencia.id">
                  <td data-title="Valor">R$ {{inadimplencia.subtotal}}</td>
                  <td data-title="Mês">{{inadimplencia.mes}}</td>
                  <td data-title="Vencimento">{{getDate(inadimplencia.data_vencimento)}}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="mb-8 bg-white text-error-base px-4 py-2 shadow transition hover:shadow-xl font-light font-display rounded self-end">
            <p>Total: <span class="font-medium">R$ {{total}}</span></p>
          </div>
          <MB-Title text="Cadastre seu cartão"/>
          <form class="flex flex-col items-start" @submit.prevent="onSubmit">
            <input type="hidden" name="pjbank-token" class="pjbank-token" ref="inputToken">
            <div class="w-full flex">
              <label class="flex flex-col w-full pb-6">
                <div class="flex justify-between items-center pb-2">
                  <span>Numero do cartão</span>
                  <div v-if="$v.card.cardNumber.$error">
                    <MB-TooltipIcon
                      :content="validationsMessage.card.cardNumber.required"
                      v-if="!$v.card.cardNumber.required"
                      theme="error"
                    />
                  </div>
                </div>
                <input-mask
                  placeholder="Insira o numero do cartão"
                  v-model.trim="$v.card.cardNumber.$model"
                  :error="$v.card.cardNumber.$error"
                  :mask="['#### #### #### ####', '#### ###### #####']"
                />
              </label>
            </div>

            <label class="flex flex-col w-full pb-6">
              <div class="flex justify-between items-center pb-2">
                <span>Nome do Titular</span>
                <div v-if="$v.card.nome.$error">
                  <MB-TooltipIcon
                    :content="validationsMessage.card.nome.required"
                    v-if="!$v.card.nome.required"
                    theme="error"
                  />
                </div>
              </div>
              <MB-Input
                placeholder="Informe o nome como está no cartão"
                v-model.trim="$v.card.nome.$model"
                :error="$v.card.nome.$error"
              />
            </label>

            <label class="flex flex-col w-full pb-6">
              <div class="flex justify-between items-center pb-2">
                <span>Sobrenome do titular</span>
                <div v-if="$v.card.sobrenome.$error">
                  <MB-TooltipIcon
                    :content="validationsMessage.card.sobrenome.required"
                    v-if="!$v.card.sobrenome.required"
                    theme="error"
                  />
                </div>
              </div>
              <MB-Input
                placeholder="Informe o sobrenome como está no cartão"
                v-model.trim="$v.card.sobrenome.$model"
                :error="$v.card.sobrenome.$error"
              />
            </label>

            <div class="w-full flex">
              <label class="flex flex-col w-2/3 pb-6 pr-3">
                <div class="flex justify-between items-center pb-2">
                  <span>Data de validade</span>
                  <div v-if="$v.card.cardValidade.$error">
                    <MB-TooltipIcon
                      :content="validationsMessage.card.cardValidade.required"
                      v-if="!$v.card.cardValidade.required"
                      theme="error"
                    />
                  </div>
                </div>
                <input-mask
                  placeholder="MM/AAAA"
                  v-model.trim="$v.card.cardValidade.$model"
                  :error="$v.card.cardValidade.$error"
                  mask="##/####"
                />
              </label>
              <label class="flex flex-col w-1/3 pb-6 pl-3">
                <div class="flex justify-between items-center pb-2">
                  <span>CVV</span>
                  <div v-if="$v.card.cardCvv.$error">
                    <MB-TooltipIcon
                      :content="validationsMessage.card.cardCvv.required"
                      v-if="!$v.card.cardCvv.required"
                      theme="error"
                    />
                  </div>
                </div>
                <input-mask
                  placeholder="xxx"
                  v-model.trim="$v.card.cardCvv.$model"
                  :error="$v.card.cardCvv.$error"
                  mask="###"
                />
              </label>
            </div>
            <label class="flex w-full mb-8">
              <Input-Checkbox v-model="reuseCard" :autoCheck="true"/>
              <span class="pl-4">Utilizar cartão para débito automático</span>
            </label>
            <div class="w-full flex justify-between">
              <router-link to="/auth/login">
                <MB-Button type="button" text="Voltar" icon="ArrowLeft" :outlined="true"/>
              </router-link>
              <MB-Button type="submit" text="Salvar" icon="Check" :loading="submitLoading"/>
            </div>
          </form>
        </div>
      </transition>
    </template> 
  </Layout-Outside>
</template>

<script>

import { mapGetters, mapActions } from 'vuex'
import { required } from 'vuelidate/lib/validators'
import moment from 'moment'
import SVGBilling from '@/components/svgs/Billing'
import InputMask from '@/components/helpers/InputMask'
import http from '@/services/http'
import InputCheckbox from '@/components/helpers/InputCheckbox'
import LayoutOutside from '@/templates/Outside'

export default {
  name: 'PaymentBilling',
  components: { LayoutOutside, SVGBilling, InputMask, InputCheckbox },
  data() {
    return {
      submitLoading: false,
      empresa: {},
      creditCardIugu: null,
      card: {
        cardNumber: '',
        nome: '',
        sobrenome: '',
        cardValidade: '',
        cardCvv: '',
      },
      reuseCard: true,
      validationsMessage: {
        card: {
          cardNumber: {
            required: "Informe o número do cartão de crédito",
          },
          nome: {
            required: "Informe o nome do titular",
          },
          sobrenome: {
            required: "Informe o sobrenome do titular",
          },
          cardValidade: {
            required: "Informe a validad do cartão",
          },
          cardCvv: {
            required: "Informe o código de segurança",
          },
        }
      }
    }
  },
  validations: {
    card: {
      cardNumber: {required},
      nome: {required},
      sobrenome: {required},
      cardValidade: {required},
      cardCvv: {required},
    }
  },
  methods: {
    ...mapActions([
      'setTemCartao',
      'setFaturas'
    ]),
    onSubmit() {
      if (this.submitLoading) return
      // this.submitLoading = true
      // setTimeout(() => {
      //   console.log('enviou')
      //   this.submitLoading = false
      // }, 2000)
      // return
      if(this.$v.$invalid) {
        this.$snack.error({
          text: 'Preencha corretamente o formulário',
          button: 'X',
        })
        return
      }
      this.submitLoading = true
      let validadeString = this.card.cardValidade.toString();
      this.creditCardIugu = Iugu.CreditCard(
        this.card.cardNumber, // numero cartao
        validadeString.substr(0, 2), // mes vencimento
        validadeString.substr(2, 6), // ano vencimento
        this.card.nome, // nome
        this.card.sobrenome, // sobre nome
        this.card.cardCvv, // cvv
      );
      this.initializeIugu()
      this.tokenizeIugu(this.creditCardIugu)
        .then(res => {
          this.cadastraToken(res)
        })
        .catch(() => {
          this.$snack.error({
            text: 'Sistema de pagamento temporariamente indisponível. tente novamente mais tarde.',
            button: 'X',
          })
        })
        .finally(() => this.submitLoading = false)
    },
    tokenizeIugu(cartao_credito) {
      return new Promise((resolve, reject) => {
        Iugu.createPaymentToken(cartao_credito, function (response) {
          if (response.errors) {
            return reject()
          }
          return resolve(response)
        })
      })
    },
    cadastraToken(cartao){
      http
        .post('cartao-credito/recebimento', {
          token_cartao: cartao.id,
          empresa_id: this.getEmpresa.id,
          valor: this.total,
          extra_info: cartao.extra_info
        })
        .then((res) => {
          this.$snack.success({
            text: res.data.message,
            button: 'X',
          });
          if(this.reuseCard) this.saveCard()
          this.setFaturas(null)
          this.$router.push({ name: 'Dashboard' })
        })
        .catch(error => {
          this.$snack.error({
            text: error.response.data.message,
            button: 'X',
          })
        })
        .finally(() => this.submitLoading = false)
    },
    initializeIugu() {
      Iugu.setAccountID(process.env.VUE_APP_IUGU_ACCOUNT_ID)
      Iugu.setTestMode(process.env.VUE_APP_IUGU_PRODUCAO === 'false')
    },
    getDate(date) {
      return moment(date).format('DD/MM/YYYY')
    },
    saveCard(){
      this.tokenizeIugu(this.creditCardIugu)
        .then(cartao => {
          http
            .post('cartao-credito/cadastrar', {
              token_cartao: cartao.id,
              empresa_id: this.getEmpresa.id,
              extra_info: cartao.extra_info
            })
            .then(() => {
              this.setTemCartao(true)
              this.$snack.success({
                text: 'Suas Configurações de pagamento foram atualizadas com sucesso.',
                button: 'X',
              })
              this.$router.push({ name: 'Dashboard' })
            })
            .catch(error => {
              this.$snack.error({
                text: error.response.data.message,
                button: 'X',
              })
            })
        })
    },
  },
  computed: {
    ...mapGetters(['getEmpresa']),
    loading() {
      return !this.getEmpresa
    },
    total() {
      if(this.loading) return ''
      const subtotals = this.getEmpresa.fatura.map(curr => Number(curr.subtotal))
      return subtotals.reduce((acc, curr) => acc + curr)
    }
  },
  beforeMount() {
    let IuguScript = document.createElement('script')
    IuguScript.setAttribute('src', 'https://js.iugu.com/v2')
    IuguScript.setAttribute('type', 'text/javascript')
    document.head.appendChild(IuguScript)
  },
}
</script>

<style scoped lang="scss">
  // @screen xs {
  //   .mb-table {
  //     background: transparent;
  //     box-shadow: none;
  //     &:hover {
  //       box-shadow: none;
  //     }
  //     thead {
  //       display: none;
  //     }
  //     tr {
  //       display: block;
  //       margin: 1rem 0;
  //       @apply shadow rounded overflow-hidden;
  //     }
  //     td {
  //       display: flex;
  //       &::before {
  //         content: attr(data-title) ":";
  //         padding-right: 1rem;
  //       }
  //     }
  //   }
  // }
</style>