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
      baseURL: "",
      result: null,
      selectedNumber: null,
    };
  },
  mutations: {
    addLog(state: any, payload: string) {
      state.logs.push(payload);
    },
    setURL(state: any, url: string) {
      state.baseURL = url;
    },
    spinningResult(state: any, number: number) {
      state.result = number;
    },
    selectedNumber(state: any, number: number) {
      state.selectedNumber = number;
    },
  },
});

createApp(App).use(store).mount("#app");
