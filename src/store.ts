import { defineStore } from "pinia";

interface State {
  logs: string[];
  baseURL: string;
  result: string;
  selectedNumber: number | null;
}

export const useStore = defineStore("roulette", {
  state: (): State => ({
    logs: [],
    baseURL: "",
    result: "",
    selectedNumber: null,
  }),
  actions: {
    addLog(payload: string) {
      this.logs.push(payload);
    },
    setURL(url: string) {
      this.baseURL = url;
    },
    spinningResult(number: string) {
      this.result = number;
    },
    setSelectedNumber(number: number) {
      this.selectedNumber = number;
    },
  },
});
