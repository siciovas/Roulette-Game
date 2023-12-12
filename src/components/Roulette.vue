<template>
    <div class="container">
        <h2>Aardvark - "Roulette Screen" game</h2>
        <InputAPI />
        <Statistics :statistics="statistics" />
        <GameBoard :gameBoard="gameBoard" />
        <div class="row">
            <div class="col">
                <h4>Results and Spin Timer:</h4>
                <div class="logs">
                    <p v-for="historyData in resultsHistory">
                        <span v-if="historyData.outcome">
                            Game {{ historyData.id }} finished, result: {{ historyData.outcome }}</span>
                        <span v-else-if="historyData.id">
                            Game {{ historyData.id }}
                            {{ isSpinning ? "wheel is spinning" : `will start in ${countDown} seconds` }}
                        </span>
                    </p>
                    <p v-if="!isLoading">Loading the game...</p>
                </div>
            </div>
            <div class="col">
                <Logs />
            </div>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { ref, watchEffect } from "vue";
import type { GameBoardTypes, LogsTypes, StatisticsTypes } from "../common/types";
import { useStore } from '@/store';
import http from "@/common/http";
import GameBoard from "./GameBoard.vue";
import Statistics from "./Statistics.vue";
import Logs from "./Logs.vue";
import InputAPI from "./InputAPI.vue";

const gameBoard = ref<GameBoardTypes[]>([]);
const statistics = ref<StatisticsTypes[]>([]);
const resultsHistory = ref<LogsTypes[]>([]);
const nextGame = ref<LogsTypes>();

const store = useStore();
const winnerNumber = ref<null | string>(null);
const baseURL = ref(store.baseURL);
const countDown = ref(-1);
const startSpin = ref(-1);
const isLoading = ref(false);
const isSpinning = ref(false);
let timeoutId: number | undefined = undefined;

store.addLog(`${new Date().toISOString()} Loading game board`);

const getConfiguration = async () => {
    store.addLog(`${new Date().toISOString()} GET .../configuration`);

    const configResponse = await http.get(`${store.baseURL}/configuration`);

    const config = configResponse.data;

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

const getStatistics = async () => {
    const statsResponse = await http.get(`${store.baseURL}/stats?limit=200`);
    const stats = await statsResponse.data;

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
    store.addLog(`${new Date().toISOString()} GET .../stats?limit=200`);
}

const getNextGame = async () => {
    store.addLog(`${new Date().toISOString()} GET .../nextGame`);

    const currentURL = store.baseURL;
    const nextGameDetailsResponse = await http.get(`${currentURL}/nextGame`);

    const nextGameDetails = nextGameDetailsResponse.data

    if (baseURL.value === currentURL) {
        nextGame.value = nextGameDetails;

        store.addLog(`${new Date().toISOString()} sleeping for fakeStartDelta ${nextGameDetails.fakeStartDelta} sec`);
        store.result = "";

        clearTimeout(timeoutId);
        playTimer();

        isLoading.value = true;
    }
};

const playTimer = () => {
    const updateTimer = () => {
        startCountDown();

        if (startSpin.value > 0) {
            timeoutId = setTimeout(updateTimer, 1000);
        }
    };

    timeoutId = setTimeout(updateTimer, 1000);
};

const startCountDown = () => {
    if (countDown.value > 0) {
        countDown.value -= 1;
    }
    if (startSpin.value > 0) {
        startSpin.value -= 1;
    }
};

watchEffect(async () => {
    if (winnerNumber.value !== null || baseURL.value !== "") {
        await getConfiguration();
        await getStatistics();
    }
});


watchEffect(async () => {
    if (baseURL.value !== store.baseURL) {
        baseURL.value = store.baseURL;
        resultsHistory.value = [];
        isLoading.value = false;
        await getNextGame();
    }
});


watchEffect(async () => {
    if (nextGame?.value !== undefined) {
        const value = resultsHistory.value.find((x) => x.uuid === nextGame.value?.uuid);

        if (value) {
            resultsHistory.value = resultsHistory.value.map((data) => {
                return {
                    ...data,
                    outcome: data.uuid === value.uuid ? nextGame.value?.outcome : data.outcome,
                    result: data.uuid === value.uuid ? nextGame.value?.result : data.result,
                };
            });
            isLoading.value = false;
            isSpinning.value = false;

            store.addLog(`${new Date().toISOString()} Result is ${nextGame.value?.outcome}`);
            store.spinningResult(resultsHistory.value[resultsHistory.value.length - 1].outcome as string);
            winnerNumber.value = store.result;
            store.selectedNumber = null;

            await getNextGame();
        } else {
            resultsHistory.value.push(nextGame.value);
        }

        countDown.value = resultsHistory.value[resultsHistory.value.length - 1].fakeStartDelta;
        startSpin.value = resultsHistory.value[resultsHistory.value.length - 1].startDelta;
    }

    nextGame.value = undefined;
});

watchEffect(async () => {
    if (startSpin.value === 0) {
        store.addLog(`${new Date().toISOString()} GET .../game/${resultsHistory.value[resultsHistory.value.length - 1].id}`);

        const gameDetailsResp = await http.get(`${store.baseURL}/game/${resultsHistory.value[resultsHistory.value.length - 1].uuid}`);

        const gameDetails = gameDetailsResp.data

        nextGame.value = gameDetails;

        startSpin.value = -1;
    }

    if (countDown.value === 0) {
        isSpinning.value = true;

        store.addLog(`${new Date().toISOString()} Spinning the wheel`);

        countDown.value = -1;
    }
});
</script>