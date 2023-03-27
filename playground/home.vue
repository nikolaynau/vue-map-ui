<script setup lang="ts">
import { reactive } from 'vue';
import { RouterLink } from 'vue-router';
import { getDemoList } from './utils';

const groups = reactive(getDemoList());
</script>

<template>
  <h1>Demo</h1>
  <ul>
    <li v-for="(entries, name) in groups" :key="name">
      <h2>{{ name }}</h2>
      <ul>
        <li v-for="(item, index) in entries" :key="index">
          <RouterLink :to="item.url">{{ item.title }}</RouterLink>
        </li>
      </ul>
    </li>
  </ul>
</template>
