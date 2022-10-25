<template>
  <div 
    class="w-64 xl:w-56 lg:w-48 md:w-full fixed left-0 top-0 bottom-0 sidebar text-sm text-neutral-800 bg-white border-t-4 border-primary-200 shadow-lg z-100 flex justify-center transition"
    :class="{ 'md:opacity-0 md:pointer-events-none': !isOpen }"
  >
    <div class="flex flex-col md:max-w-md w-full py-8 overflow-y-auto">
      <div class="flex justify-center relative">
        <div class="w-24 self-center text-primary-600">
          <router-link to="/">
            <Logo />
          </router-link>
        </div>
        <a href="#" @click.prevent="closeSidebar">
          <Icon-Cross class="hidden md:block absolute-center-y text-primary-600 right-0 mr-4"/>
        </a>
      </div>
      <div class="flex flex-col w-full mt-8">
        <User-Avatar :sexo="getCliente.sexo" :avatar="getCliente.avatar" class="self-center"/>
        <div class="mt-6">
          <Float-List floatClasses="w-full"> 
            <template v-slot:trigger>
              <div class="flex flex-col">
                <div class="flex justify-between items-center">
                  <h3 class="font-display font-bold leading-normal px-4 text-base">Dr. {{getClienteFirstName}}</h3>
                  <a href="#" class="mx-4" @click.prevent>
                    <Icon-Dropdown class="w-4 h-4"/>
                  </a>
                </div>
                <span class="px-4 pt-2 text-sm text-neutral-600">{{getEmpresa.nome}}</span>
              </div>
            </template>
            <template v-slot:target>
              <ul class="flex flex-col text-neutral-800 bg-neutral-200 py-4 border-b-2 border-neutral-800 shadow-xl md:mx-4">
                <!-- <li class=" menu-item relative" :class="{ 'active': isRoute('') }">
                  <div class="absolute right-0 top-0 bottom-0 flex items-center menu-mark transition">
                    <Menu-Mark />
                  </div>
                  <router-link to="/profile" class="w-full flex px-4 items-center">
                    <Icon-User size="smaller" />
                    <span class="ml-6">Editar Perfil</span>
                  </router-link>
                </li> -->
                <li class=" menu-item relative">
                  <div class="absolute right-0 top-0 bottom-0 flex items-center menu-mark transition">
                    <Menu-Mark />
                  </div>
                  <a href="#" @click.prevent="closeSidebar">
                    <router-link :to="{ name: 'AuthEmpresa' }" class="w-full flex px-4 items-center">
                      <Icon-Company size="smaller" />
                      <span class="ml-6">Selecionar Empresa</span>
                    </router-link>
                  </a>
                </li>
                <li class=" menu-item mt-4 relative">
                  <div class="absolute right-0 top-0 bottom-0 flex items-center menu-mark transition">
                    <Menu-Mark />
                  </div>
                  <a @click.prevent="onLogout" href="#" class="w-full flex px-4 items-center">
                    <Icon-Logout size="smaller" />
                    <span class="ml-6">Sair</span>
                  </a>
                </li>
              </ul>
            </template>
          </Float-List>
        </div>
      </div>
      <div class="mt-4 py-3">
        <router-link to="/">
          <div class="relative menu-item" :class="{ 'active': isRoute('Dashboard') }">
            <div class="absolute right-0 top-0 bottom-0 flex items-center menu-mark transition">
                <Menu-Mark />
              </div>
            <a href="#" class="w-full flex px-4 items-center">
              <Icon-Dashboard size="smaller"/>
              <span class="ml-6">Dashboard</span>
            </a>
          </div>
        </router-link>
      </div>
      <div class="mt-4">
        <h3 class="font-display font-bold leading-normal px-4 text-base">Contabilidade</h3>
        <ul class="flex flex-col mt-4 text-neutral-800">
          <li class=" menu-item relative" :class="{ 'active': isRoute('declaracoes') }">
            <div class="absolute right-0 top-0 bottom-0 flex items-center menu-mark transition">
                <Menu-Mark />
              </div>
            <router-link to="/declaracoes" class="w-full flex px-4 items-center">
              <Icon-Graph size="smaller" />
              <span class="ml-6">Declarações</span>
            </router-link>
          </li>
          <li class=" menu-item mt-4 relative" :class="{ 'active': isRoute('NotaFiscal') || isRoute('EmissaoNfse') }">
            <div class="absolute right-0 top-0 bottom-0 flex items-center menu-mark transition">
              <Menu-Mark />
            </div>
            <router-link to="/nota-fiscal" class="w-full flex px-4 items-center">
              <Icon-Paper size="smaller" />
              <span class="ml-6">NFS-e</span>
            </router-link>
          </li>
          <li class=" menu-item mt-4 relative" :class="{ 'active': isRoute('Documentos') }">
            <div class="absolute right-0 top-0 bottom-0 flex items-center menu-mark transition">
                <Menu-Mark />
              </div>
            <router-link to="/documentos" class="w-full flex px-4 items-center">
              <Icon-Document size="smaller" />
              <span class="ml-6">Documentos</span>
            </router-link>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>

import Logo from '../svgs/Logo'
import MenuMark from '../svgs/MenuMark'
import FloatList from'../helpers/FloatList'
import UserAvatar from '../layout/UserAvatar'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: { Logo, MenuMark, FloatList, UserAvatar },
  data() {
    return {
      isOpen: false
    }
  },
  methods: {
    ...mapActions(['logout']),
    isRoute(name) {
      return this.$route.name.toLowerCase() === name.toLowerCase();
    },
    onLogout() {
      this.logout()
      document.body.classList.remove('overflow-hidden')
      this.$snack.success({
        text: 'Logout feito com sucesso',
        button: 'X'
      })
    },
    closeSidebar() {
      this.isOpen = false
      document.body.classList.remove('overflow-hidden')
    },
    openSidebar() {
      this.isOpen = true
      document.body.classList.add('overflow-hidden')
    }
  },
  computed: {
    ...mapGetters([
      'getClienteFirstName',
      'getEmpresa',
      'getCliente'
    ])
  },
  watch: {
    '$route' () {
      this.closeSidebar();
    }
  },
}
</script>

<style scoped lang="scss">

.sidebar::-webkit-scrollbar {
  display: none;
}

.menu-item {
  &:hover {
    font-weight: bold;
    & .menu-mark {
      opacity: 100;
    }
  }
  .menu-mark {
    opacity: 0;
    @screen md {
      margin-right: 1rem;
    }
  }
  &.active {
    font-weight: bold;
    .menu-mark {
      opacity: 100;
    }
  }
}

</style>