<script setup lang="ts">
import { reactive } from 'vue';
import { RouterLink } from 'vue-router';
import { getDemoList } from './utils';

const groups = reactive(getDemoList());
</script>

<template>
  <div class="p-4">
    <h1 class="text-2xl font-medium mb-4">Demo</h1>
    <ul>
      <li v-for="(entries, name) in groups" :key="name">
        <h2 class="text-base font-medium">{{ name }}</h2>
        <ul class="pl-4 pb-2">
          <li v-for="(item, index) in entries" :key="index">
            <RouterLink class="underline" :to="item.url">{{
              item.title
            }}</RouterLink>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>
