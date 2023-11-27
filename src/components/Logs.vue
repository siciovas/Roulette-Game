<script lang="ts">
import type { LogsTypes } from '@/common/types';
import { type PropType, defineComponent, ref, onMounted, watchEffect } from 'vue'

export default defineComponent({
    props: {
        nextGame: Object as PropType<LogsTypes>,
    },
    setup(props) {
        const countDown = ref(0);

        const startCountDown = () => {
            if (countDown.value > 0) {
                countDown.value -= 1;
            }
        };

        onMounted(() => {
            countDown.value = props.nextGame?.fakeStartDelta as number;
        });

        watchEffect(() => {
            countDown.value = props.nextGame?.fakeStartDelta as number;

            const intervalId = setInterval(() => {
                startCountDown();

                if (countDown.value === 0) {
                    clearInterval(intervalId);
                }
            }, 1000);
        });

        return {
            countDown,
        };
    },
});
</script>

<template>
    <div class="row">
        <div class="col">
            <h4>Results and Spin Timer:</h4>
            <div class="logs">
                <p v-if="nextGame?.id">Game {{ nextGame?.id }} will start in
                    {{ countDown }} seconds!</p>
            </div>
        </div>
        <div class="col">
            <h4>Actions Log:</h4>
            <div class="logs"></div>
        </div>
    </div>
</template>