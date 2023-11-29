<template>
    <div class="container">
        <h2>Aardvark - "Roulette Screen" game</h2>
        <InputAPI />
        <Statistics :statistics="statistics" />
        <GameBoard :rouletteNumbers="rouletteNumbers" />
        <Logs />
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, watchEffect } from 'vue';
import type { GameBoardTypes, StatisticsTypes } from '../common/types'
import GameBoard from './GameBoard.vue';
import Statistics from './Statistics.vue';
import Logs from './Logs.vue'
import InputAPI from './InputAPI.vue'
import { useStore } from 'vuex'

export default defineComponent({
    components: {
        GameBoard,
        Statistics,
        Logs,
        InputAPI
    },

    setup() {
        const rouletteNumbers = ref<GameBoardTypes[]>([]);
        const statistics = ref<StatisticsTypes[]>([]);

        const store = useStore()

        onMounted(() => {
            watchEffect(async () => {
                const configResponse = await fetch(`${store.state.baseURL}/configuration`);

                if (configResponse.status !== 200) {
                    store.commit('addLog', `${new Date().toISOString()} Impossible to retrieve the game data, please check input API`)
                }

                const config = await configResponse.json();

                const positionToId = config.positionToId;

                if (config) {
                    rouletteNumbers.value = []
                }

                for (let i = 0; i < positionToId.length; i++) {
                    rouletteNumbers.value.push({
                        results: config.results[positionToId[i]],
                        colors: config.colors[positionToId[i]],
                    });
                }

                store.commit('addLog', `${new Date().toISOString()} GET .../1/stats?limit=200`)

                const statsResponse = await fetch(`${store.state.baseURL}/stats?limit=200`);
                const stats = await statsResponse.json();

                if (stats.length > 0) {
                    statistics.value = []
                }

                for (let i = 0; i < stats.length; i++) {
                    statistics.value.push({
                        result: config.results[config.results.indexOf(stats[i].result.toString() === '37' ? '00' : stats[i].result.toString())],
                        count: stats[i].count,
                        color: config.colors[config.results.indexOf(stats[i].result.toString() === '37' ? '00' : stats[i].result.toString())],
                    });
                }
            })
        })

        return {
            rouletteNumbers,
            statistics,
        };
    },
});
</script>