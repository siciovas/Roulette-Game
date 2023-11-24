<script lang="ts">
import { defineComponent } from 'vue'
import { API_URL } from '../common/constants'
import { type GameBoardTypes } from '../common/types'

export default defineComponent({
    data() {
        return {
            rouletteNumbers: [] as GameBoardTypes[],
        };
    },
    mounted() {
        fetch(API_URL + "/1/configuration")
            .then((result) => result.json())
            .then((data) => {

                const positionToId = data.positionToId;

                for (let i = 0; i < positionToId.length; i++) {
                    this.rouletteNumbers.push({
                        results: data.results[positionToId[i]],
                        colors: data.colors[positionToId[i]],
                    });
                }
            })
            .catch((err) => {
                console.error("Error", err);
            });
    },
});

</script>

<template>
    <div>
        <h4>Gameboard:</h4>
        <div class="d-flex">
            <button v-for="number in rouletteNumbers" :class="'gameboard ' + number.colors">
                {{ number.results }}
            </button>
        </div>
    </div>
</template>