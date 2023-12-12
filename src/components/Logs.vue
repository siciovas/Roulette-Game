<template>
    <h4>Actions Log:</h4>
    <div class="logs">
        <p v-for="log in store.logs">
            <span>{{ log }}</span>
        </p>
    </div>
</template>
  
<script setup lang="ts">
import { useStore } from '@/store';

const store = useStore();
</script>