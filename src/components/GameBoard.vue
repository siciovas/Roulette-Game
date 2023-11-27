<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import { type GameBoardTypes } from '../common/types'

export default defineComponent({
    props: {
        rouletteNumbers: {
            type: Array as PropType<GameBoardTypes[]>,
        }
    },
    setup(props) {
        return {
            rouletteNumbers: props.rouletteNumbers,
        }
    }
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