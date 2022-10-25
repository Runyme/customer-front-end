<template>
  <div>
    <MB-OverlaySpinner :loading="loading"/>
    <MB-Title text="Perfil"/>
    <Card color="primary-200">
      <div class="p-4 w-full flex sm:flex-col sm:items-center sm:py-6">
        <div class="cursor-pointer" @click="openPicInput">
          <User-Avatar :sexo="getCliente.sexo" :avatar="avatarUrl" :base64="imgPrev"/>
        </div>
        <div class="pl-4 font-thin sm:pl-0 sm:pt-6 text-center">
          <p class="text-neutral-700 text-xl">{{getCliente.nome}}</p>
          <div class="pt-2 text-neutral-600">
            <p><span class="font-normal">Email:</span> {{getCliente.email}}</p>
          </div>
        </div>
      </div>
    </Card>
    <form class="pt-8 flex flex-col font-thin" @submit.prevent="onSubmit">
      <input type="file" class="hidden" ref="avatarInput" @change="onPicInputChange">
      <label class="flex flex-col w-full pb-6">
        <div class="flex justify-between items-center pb-2">
          <span>Nome Completo</span>
          <div v-if="$v.form.nome_completo.$error">
            <MB-TooltipIcon 
              :content="validationsMessage.form.nome_completo.required" 
              v-if="!$v.form.nome_completo.required" 
              theme="error"
            />
          </div>
        </div>
        <MB-Input
          placeholder="Insira seu nome completo"
          :error="$v.form.nome_completo.$error"
          v-model.trim="$v.form.nome_completo.$model"
        />
      </label>
      <label class="flex flex-col w-full pb-6">
        <div class="flex justify-between items-center pb-2">
          <span>Email</span>
          <div v-if="$v.form.email.$error">
            <MB-TooltipIcon 
              :content="validationsMessage.form.email.email" 
              v-if="!$v.form.email.email" 
              theme="error"
            />
          </div>
        </div>
        <MB-Input
          placeholder="Insira seu email"
          :error="$v.form.email.$error"
          v-model.trim="$v.form.email.$model"
          type="email"
        />
      </label>
      <a href="#" class="mb-6 self-start" @click.prevent="toggleMudarSenha">
        <span class="flex items-center" v-if="mudarSenha">
          <Icon-Minus size="smaller" class="text-primary-500"/>
          <span class="pl-2">Esconder Senha</span>
        </span>
        <span class="flex items-center" v-if="!mudarSenha">
          <Icon-Locker size="smaller" class="text-primary-500"/>
          <span class="pl-2">Mudar Senha</span>
        </span>
      </a>
      <div v-if="mudarSenha">
        <label class="flex flex-col w-full pb-6">
          <div class="flex justify-between items-center pb-2">
            <span>Senha Atual</span>
            <div v-if="$v.form.senha_atual.$error">
              <MB-TooltipIcon 
                :content="validationsMessage.form.senha_atual.requiredIf" 
                v-if="!$v.form.senha_atual.requiredIf" 
                theme="error"
              />
            </div>
          </div>
          <MB-Input
            placeholder="Insira sua senha atual"
            :error="$v.form.senha_atual.$error"
            v-model.trim="$v.form.senha_atual.$model"
            type="password"
          />
        </label>
        <div class="w-full flex flex-wrap">
          <label class="flex flex-col w-1/2 sm:w-full sm:pr-0 pb-6 pr-3">
            <div class="flex justify-between items-center pb-2">
              <span>Nova Senha</span>
              <div v-if="$v.form.senha.$error">
                <MB-TooltipIcon 
                  :content="validationsMessage.form.senha.requiredIf" 
                  v-if="!$v.form.senha.requiredIf" 
                  theme="error"
                />
              </div>
            </div>
            <MB-Input
              placeholder="Insira sua nova senha"
              :error="$v.form.senha.$error"
              v-model.trim="$v.form.senha.$model"
              type="password"
            />
          </label>
          <label class="flex flex-col w-1/2 sm:w-full sm:pl-0 pb-6 pl-3">
            <div class="flex justify-between items-center pb-2">
              <span>Confirme a nova senha</span>
              <div v-if="$v.form.senha_confirmacao.$error">
                <MB-TooltipIcon 
                  :content="validationsMessage.form.senha_confirmacao.sameAs" 
                  v-if="!$v.form.senha_confirmacao.sameAs" 
                  theme="error"
                />
              </div>
            </div>
            <MB-Input
              placeholder="Repita sua nova senha"
              :error="$v.form.senha_confirmacao.$error"
              v-model.trim="$v.form.senha_confirmacao.$model"
              type="password"
            />
          </label>
        </div>
      </div>
      <MB-Button 
        type="submit" 
        icon="Check" 
        text="Atualizar" 
        class="self-end mt-2"
      />
    </form>
  </div>
</template>

<script>

import Card from '../components/helpers/Card'
import UserAvatar from '../components/layout/UserAvatar'
import { mapGetters, mapActions } from 'vuex'
import { required, email, sameAs, requiredIf } from 'vuelidate/lib/validators'
import http from '../services/http'

export default {
  components: { Card, UserAvatar },
  name: 'Profile',
  data() {
    return {
      loading: false,
      form: {
        nome_completo: '',
        email: '',
        senha_atual: '',
        senha: '',
        senha_confirmacao: '',
        avatar: ''
      },
      validationsMessage: {
        form: {
          nome_completo: { required: 'Insira o seu nome completo' },
          email: { email: 'Insira um e-mail válido' },
          senha_atual : { required: 'Insira sua senha atual' },
          senha : { required: 'Insira uma nova senha' },
          senha_confirmacao: { sameAs: 'As senhas devem ser identicas' }
        }
      },
      avatarUrl: '',
      imgPrev: false,
      mudarSenha: false,
      disableMudarSenha: false
    }
  },
  validations() {
    return {
      form: {
        nome_completo: { required },
        email: { email },
        senha_atual : { requiredIf: requiredIf(() => this.mudarSenha) },
        senha : { requiredIf: requiredIf(() => this.mudarSenha) },
        senha_confirmacao: { 
          sameAs: sameAs('senha')
        }
      }
    }
  },
  computed: {
    ...mapGetters([
      'getCliente',
      'getClienteFirstAcess'
    ])
  },
  mounted() {
    this.form.nome_completo = this.getCliente.nome
    this.form.email = this.getCliente.email
    this.avatarUrl = this.getCliente.avatar
    this.mudarSenha = this.getClienteFirstAcess
  },
  methods: {
    ...mapActions([
      'setCliente',
      'setClienteFirstAcess'
    ]),
    onSubmit() {
      if (this.$v.$invalid) {
        this.$snack.error({
          text: 'Preencha corretamente o formulário',
          button: 'X',
        });
        return;
      }
      this.loading = true
      const formData = new FormData()
      for(var key in this.form) {
        formData.append(key, this.form[key])
      }
      http.post(`/clientes/${this.getCliente.id}`, formData ,{
        headers: { 'Content-Type': 'multipart/form-data' },
      }).then(res => {
        this.setCliente(res.data.data)
        this.setClienteFirstAcess(true)
        this.loading = false
        this.$snack.success({
          text: 'Dados atualizados com sucesso',
          button: 'X',
        });
        this.$router.push('/')
      }).catch(error => {
        this.$snack.error({
          text: error.response.data.message,
          button: 'X',
        });
        this.loading = false
      })
    },
    openPicInput() {
      const avatarInput = this.$refs.avatarInput;
      avatarInput.click();
    },
    onPicInputChange(e) {
      if (!e.target.files.length) return;
      this.form.avatar = e.target.files[0]
      const reader = new FileReader();
      const self = this;
      reader.onload = function(e) {
        self.avatarUrl = e.target.result;
      }
      reader.readAsDataURL(e.target.files[0]);
      this.imgPrev = true;
    },
    toggleMudarSenha() {
      if(this.getClienteFirstAcess) {
        this.$snack.error({
          text: 'Você precisa alterar sua senha',
          button: 'X'
        })
        return
      }
      this.mudarSenha = !this.mudarSenha
    }
  }
}
</script>