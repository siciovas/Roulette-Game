<script lang="ts">
import { defineComponent } from 'vue';
import { API_URL } from '../common/constants'
import type { GameBoardTypes, StatisticsTypes } from '../common/types'
import GameBoard from './GameBoard.vue';
import Statistics from './Statistics.vue';

export default defineComponent({
    components: {
        GameBoard,
        Statistics,
    },
    data() {
        return {
            rouletteNumbers: [] as GameBoardTypes[],
            statistics: [] as StatisticsTypes[],
        };
    },
    async mounted() {
        const config = await fetch(API_URL + "/2/configuration")
        const configResult = await config.json()

        const positionToId = configResult.positionToId;

        for (let i = 0; i < positionToId.length; i++) {
            this.rouletteNumbers.push({
                results: configResult.results[positionToId[i]],
                colors: configResult.colors[positionToId[i]],
            });
        }

        const stats = await fetch(API_URL + "/2/stats?limit=200")
        const statsResult = await stats.json()

        for (let i = 0; i < statsResult.length; i++) {
            this.statistics.push({
                result: configResult.results[configResult.results.indexOf(statsResult[i].result.toString() === "37" ? "00" : statsResult[i].result.toString())],
                count: statsResult[i].count,
                color: configResult.colors[configResult.results.indexOf(statsResult[i].result.toString() === "37" ? "00" : statsResult[i].result.toString())]
            });
        }
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
        <div class="row">
            <div class="col">
                <h4>Results and Spin Timer:</h4>
                <div class="logs"></div>
            </div>
            <div class="col">
                <h4>Actions Log:</h4>
                <div class="logs"></div>
            </div>
        </div>
    </div>
</template>