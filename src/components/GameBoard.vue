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

<script lang="ts">
import { defineComponent, type PropType } from 'vue'
import { type GameBoardTypes } from '../common/types'
import { useStore } from 'vuex'

export default defineComponent({
    props: {
        rouletteNumbers: {
            type: Array as PropType<GameBoardTypes[]>,
        }
    },
    setup(props) {
        const store = useStore()

        store.commit('addLog', `${new Date().toISOString()} Loading game board`)
        store.commit('addLog', `${new Date().toISOString()} GET .../configuration`)
        
        return {
            rouletteNumbers: props.rouletteNumbers,
        }
    }
});
</script>