import { createApp } from "vue";
import App from "./App.vue";
import "./assets/main.css";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
      logs: [],
      baseURL: '',
      v: 0
    };
  },
  mutations: {
    addLog(state: any, payload: string) {
      state.logs.push(payload);
    },
    setURL(state: any, url: string) {
      console.log(url)
      state.baseURL = url;
    },
  },
});

createApp(App).use(store).mount("#app");
