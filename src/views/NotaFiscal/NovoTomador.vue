<template>
  <Modal ref="modal">
    <template v-slot:trigger>
      <MB-Button class="ml-6" size="small" text="Adicionar"/>
    </template>
    <template v-slot:target>
      <div class="fixed inset-0 bg-white-75 flex items-center justify-center z-10" v-if="loading">
        <MB-Spinner size="16"/>
      </div>
      <div class="p-6">
        <MB-Title text="Tomador"/>
        <form class="flex flex-col" @submit.prevent="onSubmit">
          <div class="flex flex-col pb-6">
            <div class="flex justify-between items-center pb-2">
              <span>Quem vai te pagar?</span>
              <div class="flex" v-if="$v.form.cpf_cnpj.$error || invalidCnpj">
                <MB-TooltipIcon
                  :content="validationsMessage.form.cpf_cnpj.required" 
                  v-if="!$v.form.cpf_cnpj.required" 
                  theme="error"
                />
                <MB-TooltipIcon 
                  :content="validationsMessage.form.cpf_cnpj.minLength"
                  v-if="!$v.form.cpf_cnpj.minLength || invalidCnpj" 
                  theme="error"
                  class="pl-4"
                />
              </div>
            </div>
            <Input-Mask 
              placeholder="CNPJ do Tomador" 
              v-model.trim="$v.form.cpf_cnpj.$model" 
              :error="$v.form.cpf_cnpj.$error || invalidCnpj" 
              mask="##.###.###/####-##"
              @input="onInputCnpj"
            />
          </div>
          <label class="flex flex-col pb-6">
            <div class="flex justify-between items-center pb-2">
              <span>Razão Social</span>
              <div class="flex" v-if="$v.form.razao_social.$error">
                <MB-TooltipIcon 
                  :content="validationsMessage.form.razao_social.required" 
                  v-if="!$v.form.razao_social.required" 
                  theme="error"
                />
              </div>
            </div>
            <MB-Input placeholder="Razão social" v-model.trim="$v.form.razao_social.$model" :error="$v.form.razao_social.$error"/>
          </label>
          <div class="w-full flex flex-wrap">
            <label class="flex flex-col pb-6 w-1/2 pr-3 sm:w-full sm:pr-0">
              <div class="flex justify-between items-center pb-2">
                <span>CEP</span>
                <div class="flex" v-if="$v.form.cep.$error || invalidCep">
                  <MB-TooltipIcon 
                    :content="validationsMessage.form.cep.required"
                    v-if="!$v.form.cep.required || invalidCep"
                    theme="error"
                  />
                  <MB-TooltipIcon 
                    :content="validationsMessage.form.cep.minLength"
                    v-if="!$v.form.cep.minLength" 
                    theme="error"
                    class="pl-4"
                  />
                </div>
              </div>
              <Input-Mask 
                mask="#####-###" 
                placeholder="CEP" 
                v-model.trim="$v.form.cep.$model" 
                :error="$v.form.cep.$error || invalidCep"
                @input="onInputCep"
              />
            </label>
            <label class="flex flex-col pb-6 w-1/2 pl-3 sm:w-full sm:pl-0">
              <div class="flex justify-between items-center pb-2">
                <span>Logradouro</span>
                <div class="flex" v-if="$v.form.logradouro.$error">
                  <MB-TooltipIcon 
                    :content="validationsMessage.form.logradouro.required" 
                    v-if="!$v.form.logradouro.required" 
                    theme="error"
                  />
                </div>
              </div>
              <MB-Input placeholder="Logradouro" v-model.trim="$v.form.logradouro.$model" :error="$v.form.logradouro.$error"/>
            </label>
          </div>
          <div class="w-full flex flex-wrap">
            <label class="flex flex-col pb-6 w-1/2 pr-3 sm:w-full sm:pr-0">
              <div class="flex justify-between items-center pb-2">
                <span>Número</span>
                <div class="flex" v-if="$v.form.numero.$error">
                  <MB-TooltipIcon 
                    :content="validationsMessage.form.numero.required" 
                    v-if="!$v.form.numero.required" 
                    theme="error"
                  />
                </div>
              </div>
              <MB-Input placeholder="Numero" type="number" v-model.trim="$v.form.numero.$model" :error="$v.form.numero.$error"/>
            </label>
            <label class="flex flex-col pb-6 w-1/2 pl-3 sm:w-full sm:pl-0">
              <span class="pb-2">Complemento</span>
              <MB-Input placeholder="Complemento" v-model="form.complemento"/>
            </label>
          </div>
          <label class="flex flex-col pb-6">
            <div class="flex justify-between items-center pb-2">
              <span>Bairro</span>
              <div class="flex" v-if="$v.form.bairro.$error">
                <MB-TooltipIcon 
                  :content="validationsMessage.form.bairro.required" 
                  v-if="!$v.form.bairro.required" 
                  theme="error"
                />
              </div>
            </div>
            <MB-Input placeholder="Bairro" v-model.trim="$v.form.bairro.$model" :error="$v.form.bairro.$error"/>
          </label>
          <div class="w-full flex flex-wrap">
            <label class="flex flex-col pb-6 w-1/2 pr-3 sm:w-full sm:pr-0">
              <div class="flex justify-between items-center pb-2">
                <span>Cidade</span>
                <div class="flex" v-if="$v.form.descricao_cidade.$error">
                  <MB-TooltipIcon 
                    :content="validationsMessage.form.descricao_cidade.required" 
                    v-if="!$v.form.descricao_cidade.required" 
                    theme="error"
                  />
                </div>
              </div>
              <MB-Input placeholder="Cidade" v-model.trim="$v.form.descricao_cidade.$model" :error="$v.form.descricao_cidade.$error"/>
            </label>
            <label class="flex flex-col pb-6 w-1/3 px-3 sm:w-1/2 sm:px-0 sm:pr-3">
              <div class="flex justify-between items-center pb-2">
                <span>Código Cidade</span>
                <div class="flex" v-if="$v.form.codigo_cidade.$error">
                  <MB-TooltipIcon 
                    :content="validationsMessage.form.codigo_cidade.required" 
                    v-if="!$v.form.codigo_cidade.required" 
                    theme="error"
                  />
                  <MB-TooltipIcon 
                    :content="validationsMessage.form.codigo_cidade.minLength"
                    v-if="!$v.form.codigo_cidade.minLength" 
                    theme="error"
                    class="pl-4"
                  />
                </div>
              </div>
              <MB-Input placeholder="Código Cidade" v-model.trim="$v.form.codigo_cidade.$model" :error="$v.form.codigo_cidade.$error"/>
            </label>
            <label class="flex flex-col pb-6 w-1/6 pl-3 sm:w-1/2">
              <div class="flex justify-between items-center pb-2">
              <span>Estado</span>
                <div class="flex" v-if="$v.form.estado.$error">
                  <MB-TooltipIcon 
                    :content="validationsMessage.form.estado.required" 
                    v-if="!$v.form.estado.required" 
                    theme="error"
                  />
                </div>
              </div>
              <MB-Input placeholder="Estado" v-model.trim="$v.form.estado.$model" :error="$v.form.estado.$error"/>
            </label>
          </div>
          <label class="flex flex-col pb-6">
            <span class="pb-2">Email</span>
            <MB-Input placeholder="Email" v-model="form.email"/>
          </label>
          <MB-Button text="Adicionar" class="self-start mt-2" icon="Plus"/>
        </form>
      </div>
    </template>
  </Modal>
</template>

<script>

import Modal from '../../components/helpers/Modal'
import vueSelect from 'vue-select'
import InputMask from '../../components/helpers/InputMask'
import http from '../../services/http'
import { required, minLength } from 'vuelidate/lib/validators'
import { mapActions } from 'vuex'

export default {
  components: { Modal, vueSelect, InputMask },
  data() {
    return {
      loading: false,
      form: {
        cpf_cnpj: '',
        razao_social: '',
        logradouro: '',
        numero: '',
        complemento: '',
        bairro: '',
        codigo_cidade: '',
        descricao_cidade: '',
        estado: '',
        cep: '',
        email: '',
      },
      validationsMessage: {
        form: {
          cpf_cnpj: {
            required: 'Insira um CNPJ',
            minLength: 'Insira um CNPJ válido'
          },
          razao_social: { required: 'Insira uma razão social' },
          logradouro: { required: 'Insira um logradouro para o endereço' },
          numero: { required: 'Insira uma número para o endereço' },
          bairro: { required: 'Insira o bairro' },
          codigo_cidade: { 
            required: 'Insira o código IBGE da cidade',
            minLength: 'O código IBGE da cidade deve ter no mínimo 4 caractéres'
          },
          descricao_cidade: { required: 'Insira a cidade' },
          estado: { required: 'Insira o estado' },
          cep: {
            required: 'Insira o CEP',
            minLength: 'Insira um CEP válido'
          },
        }
      },
      invalidCnpj: false,
      invalidCep: false
    }
  },
  validations() {
    return {
      form: {
        cpf_cnpj: {
          required,
          minLength: minLength(14)
        },
        razao_social: { required },
        logradouro: { required },
        numero: { required },
        bairro: { required },
        codigo_cidade: { 
          required,
          minLength: minLength(4)
        },
        descricao_cidade: { required },
        estado: { required },
        cep: {
          required,
          minLength: minLength(8)
        },
      }
    }
  },
  methods: {
    ...mapActions(['setTomador']),
    onSubmit() {
      if(this.$v.$invalid || this.invalidCep || this.invalidCnpj) {
        this.$snack.error({
          text: 'Preencha corretamente o formulário',
          button: 'X',
        })
        return
      }
      http
        .post('nfse/tomador', this.form)
        .then(res => {
          this.setTomador(res.data)
          this.$emit('novo-tomador')
          this.$snack.success({
            text: 'Tomador cadastrado com sucesso',
            button: 'X'
          })
        })
        .catch(err => {
          this.$snack.error({
            text: err.response.data.message,
            button: 'X'
          })
        })
      this.$refs.modal.isOpen = false
    },
    onInputCnpj(query) {
      if(query.length === 14) {
        this.loading = true
        http
          .get(`auxiliar/cnpj?cnpj=${this.form.cpf_cnpj}`)
          .then(res => {
            const data = res.data.data
            this.form.razao_social = data.razao_social
            this.form.nome_fantasia = data.nome_fantasia
            this.form.cep = data.endereco.cep
            this.fetchCep();
            this.form.numero = data.endereco.numero
            this.form.complemento = data.endereco.complemento
            this.form.email = data.email
            this.invalidCnpj = false
          })
          .catch(err => {
            if(err.response.data.errors){
              this.$snack.error({
                text: err.response.data.errors.cnpj[0],
                button: 'X'
              });
            } else {
              this.$snack.error({
                text: err.response.data.message,
                button: 'X'
              });
              this.invalidCnpj = true
            }
          })
          .finally(() => this.loading = false)
      }
    },
    onInputCep(query) {
      if(query.length === 8) this.fetchCep()
    },
    fetchCep() {
      this.loading = true;
      http
        .get(`auxiliar/cep/${this.form.cep}`)
        .then(res => {
          const data = res.data.data
          if(!this.form.logradouro && data.logradouro) this.form.logradouro = data.logradouro;
          this.form.bairro = data.bairro
          this.form.descricao_cidade = data.localidade ? data.localidade : data.municipio
          this.form.codigo_cidade = data.ibge
          this.form.estado = data.uf
          this.invalidCep = false
        })
        .catch(err => {
          this.$snack.error({
            text: 'Confira os dados de endereço',
            button: 'X'
          })
          this.invalidCep = true
        })
        .finally(() => this.loading = false)
    }
  },
}
</script>