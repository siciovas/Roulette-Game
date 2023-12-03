<template>
    <div class="container">
        <h2>Aardvark - "Roulette Screen" game</h2>
        <InputAPI />
        <Statistics :statistics="statistics" />
        <GameBoard :gameBoard="gameBoard" />
        <Logs />
    </div>
</template>
  
<script lang="ts">
import { defineComponent, ref, watchEffect } from "vue";
import type { GameBoardTypes, StatisticsTypes } from "../common/types";
import GameBoard from "./GameBoard.vue";
import Statistics from "./Statistics.vue";
import Logs from "./Logs.vue";
import InputAPI from "./InputAPI.vue";
import { useStore } from "vuex";

export default defineComponent({
    components: {
        GameBoard,
        Statistics,
        Logs,
        InputAPI,
    },

    setup() {
        const gameBoard = ref<GameBoardTypes[]>([]);
        const statistics = ref<StatisticsTypes[]>([]);

        const store = useStore();
        const winnerNumber = ref(null);
        const baseURL = ref("");

        store.commit("addLog", `${new Date().toISOString()} Loading game board`);

        watchEffect(async () => {
            winnerNumber.value = store.state.result;
            baseURL.value = store.state.baseURL;
            if (winnerNumber.value !== null || baseURL.value !== "") {
                await getConfiguration();
                await getStatistics();
            }
        });

        async function getConfiguration() {
            store.commit("addLog", `${new Date().toISOString()} GET .../configuration`);

            const configResponse = await fetch(`${store.state.baseURL}/configuration`);

            if (configResponse.status !== 200) {
                store.commit("addLog", `${new Date().toISOString()} Impossible to retrieve the game data, please check input API`);
            }

            const config = await configResponse.json();

            const positionToId = config.positionToId;

            if (config) {
                gameBoard.value = [];
            }

            for (let i = 0; i < positionToId.length; i++) {
                gameBoard.value.push({
                    results: config.results[positionToId[i]],
                    colors: config.colors[positionToId[i]],
                });
            }
        }

        async function getStatistics() {
            const statsResponse = await fetch(`${store.state.baseURL}/stats?limit=200`);
            const stats = await statsResponse.json();

            if (stats.length > 0) {
                statistics.value = [];
            }
            for (let i = 0; i < stats.length; i++) {
                statistics.value.push({
                    result: gameBoard.value[gameBoard.value.findIndex((x) => x.results === (stats[i].result.toString() === "37" ? "00" : stats[i].result.toString()))].results.toString(),
                    count: stats[i].count,
                    color: gameBoard.value[gameBoard.value.findIndex((x) => x.results === (stats[i].result.toString() === "37" ? "00" : stats[i].result.toString()))].colors,
                });
            }
            store.commit("addLog", `${new Date().toISOString()} GET .../stats?limit=200`);
        }

        return {
            gameBoard,
            statistics,
        };
    },
});
</script>