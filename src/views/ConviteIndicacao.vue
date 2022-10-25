<template>
  <div class="">
    <div class="absolute-center-x "><img
        src="https://d335luupugsy2.cloudfront.net/cms/files/239701/1607023566/$b2vqs5jxrpo"/></div>
    <div class="min-h-screen pt-56 flex justify-center sm:pt-16 mt-10">
      <div class="relative py-3 sm:max-w-xl sm:mx-auto">
        <div class="px-4 mt-10 max-w-xl md:mx-5 mx-4">
          <div class="flex items-center space-x-5 text-3xl self-start text-primary-900 font-bold">
            Olá!
            Você foi indicado para ser nosso medbestie ❤️!
           

          </div>
          <div class="flex items-center space-x-5 mt-10">
            <div class="block font-semibold text-xl self-start text-neutral-800">
              <h2 class="leading-relaxed">
           
               preencha os campos abaixo que um de nossos consultores entrarão em contato para te explicar tudinho!
              </h2>
            </div>
          </div>
        </div>

        <div class="relative bg-white shadow rounded-3xl my-10 md:p-8 p-10 md:mx-5 mx-4">
          <div class="mx-auto">
            <div>
              <div class="pb-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7">
                <div class="flex flex-col">
                  <label class="leading-loose">Nome</label>
                  <input
                      class="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                      type="text" v-model="nome">
                  <label class="error" v-show="!nomeValid">Nome Completo é obrigatório</label>
                </div>
                <div class="flex flex-col">
                  <label class="leading-loose">Email</label>
                  <input
                      class="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                      type="text" v-model="email">
                  <label class="error" v-show="!emailValid">E-Mail é obrigatório ou está em formato incorreto</label>
                </div>
                    <div class="flex flex-col">
                  <label class="leading-loose">Cpf</label>
                  <input
                      class="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                      type="text" v-model="cpf" v-mask="['###.###.###-##']">
                  <label class="error" v-show="!cpfValid">Cpf é obrigatório ou está em formato incorreto</label>
                </div>
                <div class="flex flex-col">
                  <label class="leading-loose">Telefone</label>
                  <input
                      class="px-4 py-2 border focus:ring-gray-500 focus:border-gray-900 w-full sm:text-sm border-gray-300 rounded-md focus:outline-none text-gray-600"
                      type="text" v-mask="['(##) ####-####', '(##) #####-####']" v-model="telefone">
                  <label class="error" v-show="!telefoneValid">Telefone é obrigatório</label>
                </div>
              </div>
              <div class="flex items-center space-x-4 mb-4">
                <button @click="submit" class="bg-purple text-white bg-black px-3 py-2 rounded w-full mt-4">Enviar
                </button>
              </div>
              <p class="sendError" v-if="sendError">{{ errorMessage }}</p>
              <p class="sendSuccess" v-else-if="!sendError && sendSuccess">Muito obrigado por se cadastrar, você não vai se arrepender !</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mask} from 'vue-the-mask'
import http from "@/services/http";
import dotenv from 'dotenv';

dotenv.config();

export default {
  directives: {mask},
  data: () => ({
    nome: '',
    email: '',
    telefone: '',
    cpf:'',
    nomeValid: true,
    emailValid: true,
    cpfValid: true,

    telefoneValid: true,

    sendError: false,
    sendSuccess: false,
    errorMessage: '',
  }),
  methods: {
    async submit() {
      if (!this.validate()) {
        return;
      }

      const custumerId = window.location.pathname.split('/')[1];

      const url = process.env.VUE_APP_API_URL + '/customer-indication';
      await http.post(url, {
        customer_id: custumerId,
        nome: this.nome,
        email: this.email,
        cpf: this.cpf,
        telefone: this.telefone,
      })
          .then(() => {
            this.sendError = false;
            this.sendSuccess = true;
          }).catch(err => {
            this.sendError = true
            for (const error in err.response.data.errors) {
              this.errorMessage = err.response.data.errors[error][0] || err.response.data.message
            }
          });

      this.clear();
    },
    clear() {
      this.nome = '';
      this.email = '';
      this.cpf = '';
      this.telefone = '';
    },
    validate() {
      const nomeValid = this.validateNome();
      const emailValid = this.validateEmail();
      const cpfValid = this.validateCpf();

      const telefoneValid = this.validateTelefone();

      let valid = true;

      if (!nomeValid) {
        this.nomeValid = false;
      } else {
        this.nomeValid = true;
      }

      if (!emailValid) {
        this.emailValid = false;
      } else {
        this.emailValid = true;
      }
         if (!cpfValid) {
        this.cpfValid = false;
      } else {
        this.cpfValid = true;
      }


      if (!telefoneValid) {
        this.telefoneValid = false;
      } else {
        this.telefoneValid = true;
      }

      if (!nomeValid || !emailValid || !telefoneValid) {
        valid = false;
      } else {
        valid = true;
      }

      return valid;
    },
    validateNome() {
      return this.nome.length > 0
    },
    validateEmail() {
      let re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(this.email);
    },
      validateCpf() {
         return  this.telefone.length === 15;
    },
    validateTelefone() {
      return this.telefone.length === 14 || this.telefone.length === 15;
    }
  }
};
</script>

<style>
body {
  background-color: #FFFFFF;
  background-image: url("https://d335luupugsy2.cloudfront.net/cms/files/239701/1607023566/$7tv2h8ltj5a"), linear-gradient(to bottom, rgba(255, 255, 255, 1) 0%, rgba(255, 255, 255, 1) 100%);
  background-position-x: 50%;
  background-position-y: 0%;
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  border-bottom-style: none;
  border-color: #BBBBBB;
  border-left-style: none;
  border-radius: 0px;
  border-right-style: none;
  border-top-style: none;
  border-width: 0px;
  border-top-width: 0px;
  border-right-width: 0px;
  border-bottom-width: 0px;
  border-left-width: 0px;
}

.error {
  color: #E91E63;
  font-size: 0.7em;
}

.sendSuccess {
  color: #10B981;
  font-size: 1.2em;
}

.sendError {
  color: #E91E63;
  font-size: 1.2em;
}
</style>
