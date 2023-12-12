<style scoped>
.hits {
    text-align: center;
}
</style>

<template>
    <div>
        <h4>Statistics (last 200 roulette spins):</h4>
        <table class="table table-bordered">
            <tbody>
                <tr>
                    <th>
                    </th>
                    <th colspan="5" style="background-color: #d9edf7;">
                        Cold
                    </th>
                    <th :colspan="neutralColSpan">
                        Neutral
                    </th>
                    <th colspan="5" style="background-color: #f2dede;">
                        Hot
                    </th>
                </tr>
                <tr>
                    <th>
                        Slot
                    </th>
                    <td v-for="statistic in props.statistics" :class="statistic.color" style="color: white;">
                        {{ statistic.result }}
                    </td>
                </tr>
                <tr>
                    <th>
                        Hits
                    </th>
                    <td style="background-color: #d9edf7;" v-for="statistic, index in props.statistics" class="hits"
                        :style="{ backgroundColor: index < 5 ? '#d9edf7' : index > neutralColSpan + 4 ? '#f2dede' : 'white' }">
                        {{ statistic.count }}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue';

const props = defineProps(['statistics'])

const neutralColSpan = ref(props.statistics?.length as number - 10);

watchEffect(() => {
    neutralColSpan.value = props.statistics?.length as number - 10
})

</script>