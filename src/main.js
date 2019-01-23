import Vue from "vue";
import App from "./App.vue";
import store from "./store";
import "../node_modules/bootstrap/dist/css/bootstrap.css";
import "../node_modules/noty/lib/noty.css";
import "../node_modules/noty/lib/themes/bootstrap-v4.css";

Vue.config.productionTip = false;

new Vue({
  store,
  render: h => h(App)
}).$mount("#app");
