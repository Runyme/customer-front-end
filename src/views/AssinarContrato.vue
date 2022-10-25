<template>
  <div class="bg-neutral-200 py-8">
    <div class="container max-w-4xl px-8">
      <Logo class="text-primary-600 w-56 mb-8"/>

      <div v-if="step == 1">
        <MB-Title text="Escolha a forma de pagamento"/>

        <form class="flex flex-col items-start" @submit.prevent="onSubmit">
          <div class="w-full flex mb-8 sm:flex-col">
            <label
                class="w-1/2 sm:w-full flex items-center justify-center p-4 mr-2 sm:mr-0 sm:mb-4 border-2 border-primary-500 rounded cursor-not-allowed"
                :class="{ 'opacity-25': formaDePagamento != 'cartaoDeCredito' }">
              <input class="hidden" type="radio" name="forma_de_pagamento" disabled value="cartaoDeCredito"
                     v-model="formaDePagamento">
              <Icon-CreditCard class="text-primary-600 mr-2"/>
              <span class="text-primary-600 text-xl">Cartão de Crédito</span>
            </label>

            <label
                class="w-1/2 sm:w-full flex items-center justify-center p-4 ml-2 sm:ml-0 border-2 border-primary-500 rounded cursor-pointer"
                :class="{ 'opacity-25': formaDePagamento != 'boleto' }">
              <input class="hidden" type="radio" name="forma_de_pagamento" value="boleto" v-model="formaDePagamento">
              <Icon-Document class="text-primary-600 mr-2"/>
              <span class="text-primary-600 text-xl">Boleto</span>
            </label>
          </div>

          <div v-if="formaDePagamento == 'cartaoDeCredito'" class="w-full flex flex-col items-start">
            <div class="w-full flex flex-wrap">
              <label class="flex flex-col w-1/3 pb-6 pr-3 sm:w-full sm:pr-0">
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

              <label class="flex flex-col w-2/3 pb-6 pl-3 sm:w-full sm:pl-0">
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
            </div>

            <div class="w-full flex flex-wrap">
              <label class="flex flex-col w-3/6 pb-6 pr-3 sm:w-full sm:pr-0">
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

              <label class="flex flex-col w-2/6 pb-6 px-3 sm:w-2/3 sm:pl-0">
                <div class="flex justify-between items-center pb-2">
                  <span>Validade</span>
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

              <label class="flex flex-col w-1/6 pb-6 pl-3 sm:w-1/3">
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
          </div>

          <div class="flex justify-between mt-4 self-end">
            <MB-Button type="submit" text="Salvar e Continuar" icon="Check" :disabled="loading" :loading="loading"/>
          </div>
        </form>
      </div>

      <div v-if="step == 2">
        <MB-Title text="Assine o contrato"/>

        <div id="clicksign" style="height: 600px;"></div>
      </div>
    </div>
  </div>
</template>

<script>

import axios from 'axios'
import Logo from '@/components/svgs/Logo'
import {required, requiredIf} from 'vuelidate/lib/validators'
import InputMask from '@/components/helpers/InputMask'
import {Clicksign} from '@/services/clicksign'
import OverlaySpinner from "@/components/globals/OverlaySpinner";

export default {
  name: 'AssinarContrato',
  components: {OverlaySpinner, InputMask, Logo},
  data() {
    return {
      loading: false,
      step: 2,
      token: this.$route.query.token,
      empresaId: this.$route.query.empresaId,
      clicksign_key: '',
      tokenCartaoDeCredito: null,
      formaDePagamento: 'boleto',
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
      cardNumber: {
        required: requiredIf(function () {
          return this.formaDePagamento == 'cartaoDeCredito'
        })
      },
      nome: {
        required: requiredIf(function () {
          return this.formaDePagamento == 'cartaoDeCredito'
        })
      },
      sobrenome: {
        required: requiredIf(function () {
          return this.formaDePagamento == 'cartaoDeCredito'
        })
      },
      cardValidade: {
        required: requiredIf(function () {
          return this.formaDePagamento == 'cartaoDeCredito'
        })
      },
      cardCvv: {
        required: requiredIf(function () {
          return this.formaDePagamento == 'cartaoDeCredito'
        })
      },
    }
  },
  methods: {
    validateCard(card) {
      let errors = [];

      const brand = Iugu.utils.getBrandByCreditCardNumber(card.cardNumber)

      if (!Iugu.utils.validateCreditCardNumber(card.cardNumber)) {
        errors.push('Número do cartão de crédito inválido');
      }

      if (!Iugu.utils.validateExpiration(card.validadeMes, card.validadeAno)) {
        errors.push('Data de validade inválida');
      }

      if (!Iugu.utils.validateCVV(card.cardCvv, brand)) {
        errors.push('CVV Inválido');
      }

      return errors;
    },
    async onSubmit() {
      if (this.$v.$invalid) {
        this.$snack.error({
          text: 'Preencha corretamente o formulário',
          button: 'X',
        })
        return
      }

      this.loading = true

      if (this.formaDePagamento == 'cartaoDeCredito') {
        const validadeString = this.card.cardValidade.toString()
        this.card.validadeMes = validadeString.substr(0, 2)
        this.card.validadeAno = validadeString.substr(2, 6)

        const cardErrors = this.validateCard(this.card);
        if (cardErrors.length) {
          this.$snack.error(cardErrors[0]);
          return;
        }

        try {
          const iuguTokenResponse = await this.tokenizeIugu(Iugu.CreditCard(
              this.card.cardNumber, // numero cartao
              this.card.validadeMes, // mes vencimento
              this.card.validadeAno, // ano vencimento
              this.card.nome, // nome
              this.card.sobrenome, // sobre nome
              this.card.cardCvv, // cvv
          ))

          this.tokenCartaoDeCredito = iuguTokenResponse.id
        } catch (error) {
          this.$snack.error({
            text: 'Sistema de pagamento temporariamente indisponível. Tente novamente mais tarde.',
            button: 'X',
          })
          this.loading = false;
          return;
        }
      }

      await axios({
        method: 'put',
        url: `${process.env.VUE_APP_API_URL}/assinatura-contrato`,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.token}`
        },
        data: {
          empresa_id: this.empresaId,
          forma_pagamento_id: this.formaDePagamento == 'cartaoDeCredito' ? 2 : 1,
          token_cartao_credito: this.tokenCartaoDeCredito,
        }
      })

      this.loading = false

      this.step = 2
      this.$nextTick(() => this.initializeClicksign())
    },
    tokenizeIugu(cartao_credito) {
      this.initializeIugu()

      return new Promise((resolve, reject) => {
        return Iugu.createPaymentToken(cartao_credito, function (response) {
          if (response.errors) reject()
          resolve(response)
        })
      })
    },
    initializeIugu() {
      Iugu.setAccountID(process.env.VUE_APP_IUGU_ACCOUNT_ID)
      Iugu.setTestMode(process.env.VUE_APP_IUGU_PRODUCAO === 'false')
    },
    initializeClicksign() {
      const widget = new Clicksign(this.clicksign_key)
      widget.endpoint = process.env.VUE_APP_CLICKSIGN_URL
      widget.origin = process.env.VUE_APP_URL
      widget.mount('clicksign')
    }
  },
  beforeMount() {
    let IuguScript = document.createElement('script')
    IuguScript.setAttribute('src', 'https://js.iugu.com/v2')
    IuguScript.setAttribute('type', 'text/javascript')
    document.head.appendChild(IuguScript)
  },
  mounted() {
    this.loading = true
    axios({
      method: 'get',
      url: `${process.env.VUE_APP_API_URL}/assinatura-contrato/${this.empresaId}`,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`
      }
    })
        .then(response => {
          this.clicksign_key = response.data.request_signature_key
          if (this.step === 2) {
            this.initializeClicksign()
          }
        }).finally(() => this.loading = false);
  },
}
</script>
