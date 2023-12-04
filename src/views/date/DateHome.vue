<template>
  <div id="mainBoxTopList">
    <div class="topListNameBox">
      <RouterLink
        active-class="active"
        :to="{ name: 'day', params: { date: todayDate } }"
        >Day</RouterLink
      >
    </div>
    <div class="topListNameBox">
      <RouterLink
        active-class="active"
        :to="{ name: 'week', params: { date: todayDate } }"
        >Week</RouterLink
      >
    </div>
    <div class="topListNameBox">
      <RouterLink
        active-class="active"
        :to="{ name: 'month', params: { date: todayDate } }"
        >Month</RouterLink
      >
    </div>
  </div>
  <div id="mainRouterViewBox">
    <RouterView />
  </div>
</template>

<script setup>
import { inject } from "vue"

const { format } = inject("todayDate")
const todayDate = format.today
</script>

<style scoped>
#mainBoxTopList {
  text-align: center;
  height: 43px;
  display: flex;
  justify-content: center;
  border-bottom: 1px solid #313131;
}

.topListNameBox {
  font-family: "NanumSquareB", serif;
  font-size: 1.1rem;
  padding: 10px 20px 10px 20px;
  margin: 0 5px 0 5px;
}

.topListNameBox > a {
  color: #717780;
}

.topListNameBox:has(.active) {
  border-bottom: 3px solid #a2ea86;
}

.active {
  color: #ffffff !important;
}

#mainRouterViewBox {
  margin-top: 60px;
}
</style>