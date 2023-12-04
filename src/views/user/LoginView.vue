<template>
  <RouterLink :to="{ name: 'day', params: { date: todayDate } }"
    >Day</RouterLink
  >
</template>

<script setup>
import { inject } from "vue"

const { format } = inject("todayDate")
const todayDate = format.today
</script>

<style scoped></style>