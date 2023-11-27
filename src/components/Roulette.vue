<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue';
import { API_URL } from '../common/constants'
import type { GameBoardTypes, StatisticsTypes, LogsTypes } from '../common/types'
import GameBoard from './GameBoard.vue';
import Statistics from './Statistics.vue';
import Logs from './Logs.vue'

export default defineComponent({
    components: {
        GameBoard,
        Statistics,
        Logs,
    },
    setup() {
        const rouletteNumbers = ref<GameBoardTypes[]>([]);
        const statistics = ref<StatisticsTypes[]>([]);

        onMounted(async () => {
            const configResponse = await fetch(API_URL + `/1/configuration`);
            const config = await configResponse.json();

            const positionToId = config.positionToId;

            for (let i = 0; i < positionToId.length; i++) {
                rouletteNumbers.value.push({
                    results: config.results[positionToId[i]],
                    colors: config.colors[positionToId[i]],
                });
            }

            const statsResponse = await fetch(API_URL + `/1/stats?limit=200`);
            const stats = await statsResponse.json();

            for (let i = 0; i < stats.length; i++) {
                statistics.value.push({
                    result: config.results[config.results.indexOf(stats[i].result.toString() === '37' ? '00' : stats[i].result.toString())],
                    count: stats[i].count,
                    color: config.colors[config.results.indexOf(stats[i].result.toString() === '37' ? '00' : stats[i].result.toString())],
                });
            }

        const nextGameResponse = await fetch(API_URL + `/1/nextGame`)
        const nextGame = await nextGameResponse.json()

        this.nextGame = nextGame

        });

        return {
            rouletteNumbers,
            statistics,
        };
    },
});

</script>

<template>
    <div class="container">
        <h2>Aardvark - "Roulette Screen" game</h2>
        <div>
            <h4>API URL:</h4>
            <input type="text" class="form-control" />
        </div>
        <Statistics v-if="statistics.length > 0" :statistics="statistics" />
        <GameBoard :rouletteNumbers="rouletteNumbers" />
        <Logs />
    </div>
</template>