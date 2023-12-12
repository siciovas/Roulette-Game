<style scoped>
.gameboard {
    height: 40px;
    width: 100%;
    border: solid 1px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    color: white;
    border-radius: 5px;
}

.gameboard:hover {
    color: brown;
}

.selected {
    background-color: grey !important;
    transform: scale(1.1);
}

@keyframes blink {

    0%,
    100% {
        opacity: 1;
    }

    50% {
        opacity: 0;
    }
}

.blink {
    animation: blink 1.5s infinite;
}
</style>

<template>
    <div>
        <h4>Gameboard:</h4>
        <div class="d-flex">
            <button v-for="board, index in props.gameBoard" :key="index"
                :class="['gameboard', board.colors, { 'blink': winnerNumber === board.results.toString(), 'selected': selectedButtonNumber === board.results }]"
                @click="selectButton(board.results)">
                {{ board.results }}
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import { watchEffect, ref } from 'vue'
import { useStore } from '@/store';

const props = defineProps(['gameBoard'])
const store = useStore()
const winnerNumber = ref("")
const selectedButtonNumber = ref<number | null>(null)

watchEffect(() => {
    winnerNumber.value = store.result;
    selectedButtonNumber.value = store.selectedNumber;
})

const selectButton = (number: number) => {
    store.setSelectedNumber(number)
}
</script>