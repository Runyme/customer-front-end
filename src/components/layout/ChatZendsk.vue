<template></template>
<script>
  import {mapGetters} from 'vuex';

  export default {
    name: "ChatZendsk",

    computed: {
      ...mapGetters(['empresaSelecionada'])
    },

    beforeCreate() {
      let zendeskScript = document.createElement('script');
      zendeskScript.setAttribute('id', 'ze-snippet');
      zendeskScript.setAttribute('src', 'https://static.zdassets.com/ekr/snippet.js?key=b4c88065-8b3a-43ed-b48f-c7afb16bf35e');
      document.head.appendChild(zendeskScript);
    },

    created() {

      let jwtFn1 = function (callback) {
        fetch(process.env.VUE_APP_API_URL + '/clientes/zendesk-chat', {
          headers: {"Authorization": "Bearer " + secure.get('mb-token'),}
        }).then(function (res) {
          res.text().then(function (jwt) {
            callback(jwt);
          });
        });
      };

      window.zESettings = {
        webWidget: {
          authenticate: {
            chat: {
              jwtFn: jwtFn1
            }
          }
        }
      };

    }
  }
</script>

<style scoped>

</style>