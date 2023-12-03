<template>
    <div>
        <h4>Gameboard:</h4>
        <div class="d-flex">
            <button v-for="board, index in gameBoard" :key="index"
                :class="['gameboard', board.colors, { 'blink': winnerNumber === board.results, 'selected': selectedButtonNumber === board.results }]"
                @click="selectButton(board.results)">
                {{ board.results }}
            </button>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, watchEffect, type PropType, ref } from 'vue'
import { type GameBoardTypes } from '../common/types'
import { useStore } from 'vuex'

export default defineComponent({
    props: {
        gameBoard: {
            type: Array as PropType<GameBoardTypes[]>,
        }
    },
    setup() {
        const store = useStore()
        const winnerNumber = ref(null)
        const selectedButtonNumber = ref<number | null>(null)


        watchEffect(() => {
            winnerNumber.value = store.state.result
            selectedButtonNumber.value = store.state.selectedNumber
        })

        const selectButton = (number: number) => {
            store.commit('selectedNumber', number)
        }

        return {
            winnerNumber,
            selectedButtonNumber,
            selectButton,
        }
    }

});
</script>