<template>
  <div id="date">
    <span class="material-symbols-outlined" @click="dateDayMove('prev')">
      arrow_back_ios
    </span>
    <div id="topDateBox">
      <p id="dateDayTopWeek" :class="weekColor">{{ week }}</p>
      <p id="dateDayTopDate">{{ topDate }}</p>
    </div>
    <span class="material-symbols-outlined" @click="dateDayMove('next')">
      arrow_forward_ios
    </span>
  </div>

  <DateForm :get-routine-data="getRoutineData" :routine-array="routineArray"></DateForm>

  <RoutineList :get-routine-data="getRoutineData" :routine-array="routineArray"
               @edit-routine-data="editRoutineDataEvent"></RoutineList>

</template>
<script setup>
import { computed, inject, onMounted, ref, watch, watchEffect } from "vue"
import UseMenu from "@/components/useMenu.vue"
import { useRoute, useRouter } from "vue-router"

import DateForm from "@/views/date/dateday/DateForm.vue"
import { authenticateToken } from "@/plugins/jwt/checkToken"
import axios from "axios"
import RoutineList from "@/views/date/dateday/list/RoutineList.vue"

const { format, calcDate } = inject("todayDate")
const { today, propsToFormat } = format
const { prevDay, nextDay } = calcDate

const route = useRoute()
const router = useRouter()

const routineArray = ref([])

let weekColor = ref("#ffffff")

const week = computed(() => {
  if (format.week(route.params.date) === "Saturday") {
    weekColor.value = "#88b6ff"
  } else if (format.week(route.params.date) === "Sunday") {
    weekColor.value = "#ff6161"
  } else {
    weekColor.value = "#ffffff"
  }
  return format.week(route.params.date)

})

const topDate = computed(() => {
  return propsToFormat(route.params.date)
})

const getRoutineData = () => {
  if (!authenticateToken()) {
    alert("다시 로그인해주시길 바랍니다.")
    router.push({ path: "/" })
  }
  axios({
    method: "post",
    url: `${import.meta.env.VITE_APP_API_URL}/routine/get_routine`,
    data: {
      routine_author: userName.value,
      routine_status_date: route.params.date
    }
  }).then(res => {
    const routineData = res.data

    if (routineData.length === 0) {
      routineArray.value = []
      return null
    }

    routineArray.value = []

    for (let newData of routineData) {
      routineArray.value.push({
        routineId: newData.routine_UUID,
        content: newData.routine_content,
        author: newData.routine_author,
        isFinish: Boolean(newData.finished),
        editRoutineContent: false
      })
    }

    return null

  })
}

//페이지 이동 시 실행
watch(route, (newValue, oldValue) => {
  getRoutineData()
}, {
  immediate: true
})

const editRoutineDataEvent = (routineId) => {
  for (let routineData of routineArray.value) {
    console.log(routineData.routineId)

    if (routineData.routineId === routineId) {
      routineData.editRoutineContent = !routineData.editRoutineContent
      break
    }
  }
}

const dateDayMove = type => {
  if (type === "prev") {
    router.push({ name: "day", params: { date: prevDay(route.params.date) } })

    return null
  }
  router.push({ name: "day", params: { date: nextDay(route.params.date) } })

}

</script>

<style scoped>
@import "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0";

#date {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

#date .material-symbols-outlined {
  font-size: 2.5rem;
  color: #a8a8a8;
  cursor: pointer;
  user-select: none;
  display: block;
  height: 100%;
  transition: 0.3s;
}

#date .material-symbols-outlined:hover {
  color: #ffffff;
}

#topDateBox {
  width: 175px;
}

#dateDayTopWeek {
  font-size: 2rem;
  font-family: "NanumSquareB", serif;
  margin-bottom: 10px;
  color: v-bind(weekColor);
}

#dateDayTopDate {
  color: #a8a8a8;
  font-size: 1.2rem;
}

</style>