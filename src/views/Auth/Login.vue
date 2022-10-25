<template>
  <div class="w-full">
    <MB-Title text="Login"/>
    <form 
      class="flex items-start flex-col" 
      @submit.prevent="handleSubmit"
    >
      <label class="flex flex-col w-full pb-6">
        <div class="flex justify-between items-center pb-2">
          <span>CPF</span>
          <div v-if="$v.cpf.$error">
            <MB-TooltipIcon 
              :content="validationsMessage.cpf.required" 
              v-if="!$v.cpf.required" 
              theme="error"
            />
            <MB-TooltipIcon 
              :content="validationsMessage.cpf.minLength" 
              v-if="!$v.cpf.minLength" 
              theme="error"
            />
          </div>
        </div>
        <input-mask
          placeholder="Insira um CPF"
          :error="$v.cpf.$error"
          v-model.trim="$v.cpf.$model"
          mask="###.###.###-##"
          type="number"
        />
      </label>
      <label class="flex flex-col w-full pb-8">
        <div class="flex justify-between items-center pb-2">
          <span>Senha</span>
          <div v-if="$v.senha.$error">
            <MB-TooltipIcon 
              :content="validationsMessage.senha.required" 
              v-if="!$v.senha.required" 
              theme="error"
            />
            <MB-TooltipIcon 
              :content="validationsMessage.senha.minLength" 
              v-if="!$v.senha.minLength" 
              theme="error"
            />
          </div>
        </div>
        <MB-Input
          type="password"
          placeholder="Digite a senha"
          v-model="$v.senha.$model"
          :error="$v.senha.$error"
        />
      </label>
      <button type="submit">
        <MB-Button 
          text="Entrar" 
          class="tese" 
          icon="ArrowRight"
          :loading="loading"
          :disabled="loading"
        />
      </button>
    </form>
  </div>
</template>

<script>

import { mapActions } from 'vuex'
import { required, minLength } from 'vuelidate/lib/validators'
import InputMask from '@/components/helpers/InputMask'

export default {
  name: 'AuthLoginForm',
  components: { InputMask },
  data() {
    return {
      cpf: '',
      senha: '',
      loading: false,
      validationsMessage: {
        cpf: {
          required: "Informe um CPF",
          minLength: "Informe um CPF válido"
        },
        senha: {
          required: "Informe sua senha",
          minLength: `A senha precisa ter pelo menos 4 dígitos`
        }
      },
    }
  },
  validations: {
    cpf: {
      required,
      minLength: minLength(11)
    },
    senha: {
      required,
      minLength: minLength(4)
    }
  },
  methods: {
    ...mapActions(['login']),
    handleSubmit() {
      if(this.$v.$invalid) {
        this.$snack.error({
          text: 'Preencha corretamente o formulário',
          button: 'X',
        })
        return
      }
      this.loading = true;
      this
        .login({ 
          cpf: this.cpf, 
          senha: this.senha 
        })
        .finally(() => this.loading = false)
    },
  },
}
</script>