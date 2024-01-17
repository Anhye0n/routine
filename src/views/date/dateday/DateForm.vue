<template>
  <div id="dateDayInputRoutineBox">

    <label for="dateDayInputRoutine">
      <span class="material-symbols-outlined">playlist_add</span>
    </label>

    <input
      id="dateDayInputRoutine"
      type="text"
      placeholder="Add a task..."
      @keyup.enter="addRoutine"
      @keydown.shift.enter="addTodo"
      autocomplete="off"
      v-model="routineInput"
    />

  </div>
</template>

<script setup>
import { inject, ref, watch } from "vue"
import axios from "axios"

import { useRoute, useRouter } from "vue-router"
import { useUserStore } from "@/stores/userManage"
import { storeToRefs } from "pinia"
import { authenticateToken } from "@/plugins/jwt/checkToken"

const route = useRoute()
const router = useRouter()

const { format } = inject("todayDate")
const { getCurrentDateTime } = format

const { userName, accessToken } = storeToRefs(useUserStore())
const routineInput = ref("")

const { getRoutineData, getTodoData } = defineProps({
  getRoutineData: {
    type: Function
  },
  getTodoData: {
    type: Function
  }
})

const addRoutine = () => {
  if (!routineInput.value.replace(/\s/g, "")) return
  if (!authenticateToken()) {
    alert("다시 로그인해주시길 바랍니다.")
    router.push({ path: "/" })
  }

  axios({
    method: "post",
    url: `${import.meta.env.VITE_APP_API_URL}/routine/submit/`,
    headers: {
      Authorization: `Bearer ${accessToken.value}`
    },
    data: {
      routine_content: routineInput.value,
      routine_author: userName.value,
      routine_createAt: getCurrentDateTime()
    },
    withCredentials: true
  }).then(res => {
    // console.log(res)
    getRoutineData()
  }).catch(err => {
    if (err.response.status === 403) {
      alert("잘못된 접근입니다. code(Add Routine Error)")
    }
    // console.log(err)
  })

  routineInput.value = ""
}


const addTodo = () => {
  if (!routineInput.value.replace(/\s/g, "")) return
  if (!authenticateToken()) {
    alert("다시 로그인해주시길 바랍니다.")
    router.push({ path: "/" })
  }

  axios({
    method: "post",
    url: `${import.meta.env.VITE_APP_API_URL}/todo/submit/`,
    headers: {
      Authorization: `Bearer ${accessToken.value}`
    },
    data: {
      todo_content: routineInput.value,
      todo_date: route.params.date,
      todo_author: userName.value,
      todo_createdAt: getCurrentDateTime()
    },
    withCredentials: true
  }).then(res => {
    // console.log(res)
    getTodoData()
  }).catch(err => {
    if (err.response.status === 403) {
      alert("잘못된 접근입니다. code(Add Todo Error)")
    }
    // console.log(err)
  })

  routineInput.value = ""
}

watch(routineInput, (newValue, oldValue) => {
  if (routineInput.value.length >= 80) {
    alert("80자 이상은 불가능합니다.")
    routineInput.value = oldValue
  }
})
</script>

<style scoped>
label > .material-symbols-outlined {
  position: absolute;
  padding-top: 7px;
  padding-left: 14px;
  font-size: 2rem;
  color: #a8a8a8;
}

#dateDayInputRoutine {
  color: #a9a9a9;
  width: 410px;
  min-width: 300px;
  background: #2e2d35;
  border-radius: 5px;
  border: 1px solid #2e2d35;
  font-family: "NanumSquareB", serif;
  font-size: 1.2rem;
  padding: 11px 10px 10px 55px;
}

#dateDayInputRoutineBox {
  margin-top: 60px;
}


</style>