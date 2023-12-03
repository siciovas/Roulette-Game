<template>
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
            <h4>Actions Log:</h4>
            <div class="logs">
                <p v-for="log in logs">
                    <span>{{ log }}</span>
                </p>
            </div>
        </div>
    </div>
</template>
  
<script lang="ts">
import type { LogsTypes } from "@/common/types";
import { defineComponent, ref, watchEffect } from "vue";
import { useStore } from "vuex";

export default defineComponent({
    setup() {
        const countDown = ref(-1);
        const startSpin = ref(-1);
        const isLoading = ref(false);
        const isSpinning = ref(false);
        const resultsHistory = ref<LogsTypes[]>([]);
        const nextGame = ref<LogsTypes>();

        const store = useStore();
        const baseURL = ref("");
        let intervalId: number | undefined = undefined;

        const startCountDown = () => {
            if (countDown.value > 0) {
                countDown.value -= 1;
            }
            if (startSpin.value > 0) {
                startSpin.value -= 1;
            }
        };

        watchEffect(async () => {
            if (baseURL.value !== store.state.baseURL) {
                baseURL.value = store.state.baseURL;
                resultsHistory.value = [];
                isLoading.value = false;
                await getNextGame();
            }
        });

        const getNextGame = async () => {
            store.commit("addLog", `${new Date().toISOString()} GET .../nextGame`);

            const currentURL = store.state.baseURL;
            const nextGameResponse = await fetch(`${currentURL}/nextGame`);
            const nextGameDetails = await nextGameResponse.json();

            if (baseURL.value === currentURL) {
                nextGame.value = nextGameDetails;

                store.commit("addLog", `${new Date().toISOString()} sleeping for fakeStartDelta ${nextGameDetails.fakeStartDelta} sec`);
                store.state.result = null;

                clearInterval(intervalId);
                playTimer();

                isLoading.value = true;
            }
        };

        const playTimer = () => {
            intervalId = setInterval(() => {
                startCountDown();
                if (startSpin.value === 0) {
                    clearInterval(intervalId);
                }
            }, 1000);
        };

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

                    store.commit("addLog", `${new Date().toISOString()} Result is ${nextGame.value?.outcome}`);
                    store.commit("spinningResult", resultsHistory.value[resultsHistory.value.length - 1].outcome);
                    store.state.selectedNumber = null;

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
                store.commit("addLog", `${new Date().toISOString()} GET .../game/${resultsHistory.value[resultsHistory.value.length - 1].id}`);

                const gameDetailsResponse = await fetch(`${store.state.baseURL}/game/${resultsHistory.value[resultsHistory.value.length - 1].uuid}`);
                const gameDetails = await gameDetailsResponse.json();

                nextGame.value = gameDetails;

                startSpin.value = -1;
            }

            if (countDown.value === 0) {
                isSpinning.value = true;

                store.commit("addLog", `${new Date().toISOString()} Spinning the wheel`);

                countDown.value = -1;
            }
        });

        return {
            countDown,
            resultsHistory,
            isLoading,
            isSpinning,
            logs: store.state.logs,
        };
    },
});
</script>