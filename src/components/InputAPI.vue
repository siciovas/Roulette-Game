<template>
    <div>
        <h4>API URL:</h4>
        <input type="text" class="form-control" v-model="URL" @input="onChange" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from '@/store';

const store = useStore()
const URL = ref("https://dev-games-backend.advbet.com/v1/ab-roulette/1")

store.setURL(URL.value)

const onChange = (event: Event) => {
    const value = (event.target as HTMLInputElement)?.value;
    if (value !== undefined) {
        store.setURL(value)
    }
}
</script>