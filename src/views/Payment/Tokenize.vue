<template>
  <Layout-Outside> 
    <template #SVG>
      <SVG-CreditCard class="w-full h-full max-w-lg"/>
    </template>
    <template #content>
      <transition name="fade-right" mode="out-in" appear>
        <div>
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
                  mask="####"
                />
              </label>
            </div>
            <div class="w-full flex justify-between mt-4">
              <router-link to="/auth/login">
                <MB-Button type="button" text="Voltar" icon="ArrowLeft" :outlined="true"/>
              </router-link>
              <MB-Button type="submit" text="Salvar" icon="Check" :disabled="loading" :loading="loading"/>
            </div>
          </form>
        </div>
      </transition>
    </template> 
  </Layout-Outside>
</template>

<script>

import { mapActions } from 'vuex'
import { required } from 'vuelidate/lib/validators'
import SVGCreditCard from '@/components/svgs/CreditCard'
import InputMask from '@/components/helpers/InputMask'
import http from '@/services/http'
import LayoutOutside from '@/templates/Outside'

export default {
  name: 'PaymentTokenize',
  components: { LayoutOutside, SVGCreditCard, InputMask },
  data() {
    return {
      loading: false,
      card: {
        cardNumber: '',
        nome: '',
        sobrenome: '',
        cardValidade: '',
        cardCvv: '',
      },
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
    ...mapActions(['setTemCartao']),
    validateCard(card) {
      return new Promise((resolve, reject) => {
        const brand = Iugu.utils.getBrandByCreditCardNumber(card.cardNumber)
        if(!Iugu.utils.validateCreditCardNumber(card.cardNumber)) reject('Número do cartão de crédito inválido')
        if(!Iugu.utils.validateExpiration(card.validadeMes, card.validadeAno)) reject('Data de validade inválida')
        if(!Iugu.utils.validateCVV(card.cardCvv, brand)) reject('CVV Inválido')
        resolve()
      })
    },
    onSubmit() {
      if(this.$v.$invalid) {
        this.$snack.error({
          text: 'Preencha corretamente o formulário',
          button: 'X',
        })
        return
      }

      const validadeString = this.card.cardValidade.toString()
      this.card.validadeMes = validadeString.substr(0, 2)
      this.card.validadeAno = validadeString.substr(2, 6)

      this.loading = true

      this.validateCard(this.card)
        .then(() => {
          let cartao_credito = Iugu.CreditCard(
            this.card.cardNumber, // numero cartao
            this.card.validadeMes, // mes vencimento
            this.card.validadeAno, // ano vencimento
            this.card.nome, // nome
            this.card.sobrenome, // sobre nome
            this.card.cardCvv, // cvv
          )
          this.initializeIugu()
          this.tokenizeIugu(cartao_credito)
            .then((res) => this.cadastraToken(res))
            .catch(() => {
              this.$snack.error({
                text: 'Sistema de pagamento temporariamente indisponível. Tente novamente mais tarde.',
                button: 'X',
              })
            })
        })
        .catch(err => this.$snack.error(err))
        .finally(() => this.loading = false)
    },
    tokenizeIugu(cartao_credito) {
      return new Promise((resolve, reject) => {
        return Iugu.createPaymentToken(cartao_credito, function (response) {
          if (response.errors) reject()
          resolve(response)
        })
      }) 
    },
    cadastraToken(cartao){
      http
        .post('cartao-credito/cadastrar', {
          token_cartao: cartao.id,
          empresa_id: localStorage.getItem('mb-empresa-id'),
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
        .finally(() => this.loading = false)
    },
    initializeIugu() {
      Iugu.setAccountID(process.env.VUE_APP_IUGU_ACCOUNT_ID)
      Iugu.setTestMode(process.env.VUE_APP_IUGU_PRODUCAO === 'false')
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