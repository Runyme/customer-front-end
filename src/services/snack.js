import Vue from 'vue';
import VueSnackbar from 'vue-snack'

const vm = new Vue({
  methods: {
    success(text) {
      this.$snack.success({
        text,
        button: 'X'
      })
    },
    error(text) {
      this.$snack.error({
        text,
        button: 'X'
      })
    },
    warning(text) {
      this.$snack.warning({
        text,
        button: 'X'
      })
    }
  }
});

vm.$set(VueSnackbar, snackConfig)
export const $snack = vm

export const snackConfig = {
  position: 'bottom-right', 
  time: 3000,
  methods: [
    { name: 'success', color: '#48BB78' },
    { name: 'error', color: '#F56565' },
    { name: 'warning', color: '#ECC94B' },
  ]
}