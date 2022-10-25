<template>
  <Layout-Outside> 
    <template #SVG>
      <SVG-Check-List class="w-full h-full max-w-lg" />
    </template>
    <template #content>
      <transition name="fade-right" mode="out-in" appear>
        <div class="w-full flex flex-col">
          <Modal ref="modal">
            <template #trigger>
              <div class="flex">
                <div class="flex-grow border-b-2 border-neutral-300 pb-4 pr-4">
                  <h2 class="text-2xl font-display">Nome da Pendência</h2>
                  <p class="text-neutral-600">Descrição da pendência, lorem ipsum dolor sit amet consectetur</p>
                </div>
                <div class="flex items-center flex-col pl-4">
                  <div class="shadow bg-primary-500 rounded-full p-3 text-neutral-100">
                    <Icon-Plus />
                  </div>
                </div>
              </div>
            </template>
            <template #target>
              <div class="py-4 px-8 flex flex-col">
                <span class="text-3xl pb-8">Titulo</span>
                <label class="flex flex-col">
                  <span class="text-lg pb-2">Label</span>
                  <MB-Input />
                </label>
                <MB-Button text="Enviar" class="self-end mt-8"/>
              </div>
            </template>
          </Modal>
          <ul class="pt-8">
            <li class="flex items-center pb-4">
              <span class="w-3 h-3 rounded-full bg-primary-500"></span>
              <div class="flex items-center flex-grow overflow-hidden">
                <span class="pl-4 text-2xl">Arquivo:</span>
                <span class="truncate pl-2">https://tailwindcss.com/docs/controlling-file-size/lorem-ipsum-teste</span>
              </div>
            </li>
          </ul>
        </div>
      </transition>
    </template> 
  </Layout-Outside>
</template>
<script>

import Modal from '@/components/helpers/Modal'
import SVGCheckList from '@/components/svgs/CheckList'
import LayoutOutside from '@/templates/Outside'

export default {
  components: { SVGCheckList, Modal, LayoutOutside },
  data() {
    return {
    }
  },
}
</script>
