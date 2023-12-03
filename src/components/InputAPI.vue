<template>
    <div>
        <h4>API URL:</h4>
        <input type="text" class="form-control" v-model="URL" @input="onChange" />
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
    setup() {
        const store = useStore()
        const URL = ref("https://dev-games-backend.advbet.com/v1/ab-roulette/1")

        onMounted(() => {
            store.commit('setURL', URL.value)
        })

        const onChange = (event: Event) => {
            const value = (event.target as HTMLInputElement)?.value;
            if (value !== undefined) {
                store.commit('setURL', value)
            }
        }

        return {
            URL,
            onChange
        }
    },
})
</script>