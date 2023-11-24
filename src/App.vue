<script lang="ts">
import GameBoard from './components/GameBoard.vue'
export default {
    components: {
        'GameBoard': GameBoard,
    }
}
</script>

<template>
    <div class="container">
        <h2>Aardvark - "Roulette Screen" game</h2>
        <div>
            <h4>API URL:</h4>
            <input type="text" class="form-control" />
        </div>
        <GameBoard />
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