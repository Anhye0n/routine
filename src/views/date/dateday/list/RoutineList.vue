<template>
  <div id="dateDayRoutineListBox">
    <div
      class="dateDayRoutineBox"
      v-for="(routineData, index) in routineArray"
      :key="routineData.routineId"
    >
      <div
        v-if="routineData.isFinish === true"
        class="finish"
        @click="isFinishFunc(routineData)"
      ></div>
      <div
        v-else-if="routineData.isFinish === false"
        class="notFinish"
        @click="isFinishFunc(routineData)"
      ></div>
      <p v-if="!routineData.editRoutineContent"
         class="dateDayRoutineContent"
         :class="{ finishText: routineData.isFinish }"
         @click="isFinishFunc(routineData)"
      >
        {{ routineData.content }}
      </p>
      <input class="dateDayRoutineContentEdit" type="text" v-if="routineData.editRoutineContent"
             :value="routineData.content" @keyup.enter="e => submitEditRoutine(e, routineData)">
      <div class="dateDayRoutineEtcBox" ref="menuRef">
        <Transition name="subMenuAnimation">
          <useMenu
            :content-id="routineData.routineId"
            :sub-menu="subMenu"
            v-if="subMenuView[index]"
            :menu-ref="$refs.menuRef"
            @click-button="runMenu"
            @sub-menu-view-boolean="closeSubMenuOutside(subMenuView, index)"
          />
        </Transition>
        <span
          class="material-symbols-outlined"
          @click="closeSubMenu(subMenuView, index)"
        >
          more_horiz
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import UseMenu from "@/components/useMenu.vue"
import { authenticateToken } from "@/plugins/jwt/checkToken"
import axios from "axios"
import { inject, ref } from "vue"
import { useRoute, useRouter } from "vue-router"
import { storeToRefs } from "pinia"
import { useUserStore } from "@/stores/userManage"

const { format } = inject("todayDate")
const { getCurrentDateTime } = format


const route = useRoute()
const router = useRouter()

const { userName, accessToken } = storeToRefs(useUserStore())

const { getRoutineData, routineArray } = defineProps({
  getRoutineData: {
    type: Function
  },
  routineArray: {
    type: Array
  }
})

const emits = defineEmits(["editRoutineData"])

const subMenu = ["수정", "삭제"]

const subMenuView = ref([])

const isFinishFunc = routineData => {
  routineData.isFinish = !routineData.isFinish

  if (!authenticateToken()) {
    alert("다시 로그인해주시길 바랍니다.")
    router.push({ path: "/" })
  }

  axios({
    method: "post",
    url: `${import.meta.env.VITE_APP_API_URL}/routine/finished/`,
    headers: {
      Authorization: `Bearer ${accessToken.value}`
    },
    data: {
      routine_UUID: routineData.routineId,
      routine_status_date: route.params.date,
      routine_content: routineData.content,
      routine_author: userName.value,
      routine_status_finished: routineData.isFinish,
      routine_status_updatedAt: getCurrentDateTime()
    },
    withCredentials: true
  }).then(res => {
    // console.log(res)
    getRoutineData()
  }).catch(err => {
    console.log(err)
    if (err.response.status === 403) {
      alert("잘못된 접근입니다.")
    }
    // console.log(err)
  })
}

const deleteRoutine = (routineId) => {
  axios({
    method: "post",
    url: `${import.meta.env.VITE_APP_API_URL}/routine/delete/`,
    headers: {
      Authorization: `Bearer ${accessToken.value}`
    },
    data: {
      routine_UUID: routineId,
      routine_author: userName.value
    },
    withCredentials: true
  }).then(res => {
    console.log("루틴 삭제 성공")
    getRoutineData()
  }).catch(err => {
    console.log(err)
    alert("잘못된 접근입니다.")
  })
}

const editRoutine = (routineId) => {

  emits("editRoutineData", routineId)
}

const submitEditRoutine = (e, routineData) => {
  if (!e.target.value.replace(/\s/g, "")) return

  if (e.target.value.length >= 80) {
    alert("80자 이상은 불가능합니다.")
    e.target.value = e.target.value.slice(0, 79)
    return
  }

  axios({
    method: "post",
    url: `${import.meta.env.VITE_APP_API_URL}/routine/edit/`,
    headers: {
      Authorization: `Bearer ${accessToken.value}`
    },
    data: {
      routine_UUID: routineData.routineId,
      routine_content: e.target.value,
      routine_author: routineData.author
    },
    withCredentials: true
  }).then(res => {
    // console.log(res)
    getRoutineData()
  }).catch(err => {
    if (err.response.status === 403) {
      alert("잘못된 접근입니다.")
    }
    // console.log(err)
  })
}

const runMenu = (menu, routineId) => {
  if (!authenticateToken()) {
    alert("다시 로그인해주시길 바랍니다.")
    router.push({ path: "/" })
  }

  if (menu === "삭제") {
    deleteRoutine(routineId)
  } else if (menu === "수정") {
    editRoutine(routineId)
  }
}

const closeSubMenu = (subMenuView, index) => {
  subMenuView.fill(false)
  subMenuView[index] = !subMenuView[index]
}

const closeSubMenuOutside = (subMenuView, index) => {
  subMenuView[index] = !subMenuView[index]
}

</script>

<style scoped>
#dateDayRoutineListBox {
  margin: 20px auto;
}

.dateDayRoutineBox {
  margin: 10px auto;
  width: 480px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
}

.dateDayRoutineContent {
  width: 350px;
  text-align: left;
  font-size: 1.2rem;
  margin-left: 15px;
  margin-top: 12px;
  margin-bottom: 10px;
  color: #eaeaea;
}

.dateDayRoutineContentEdit {
  width: 350px;
  text-align: left;
  font-family: "NanumSquareR", serif;
  font-size: 1.2rem;
  margin-left: 13px;
  margin-top: 11px;
  margin-bottom: 9px;
  color: #eaeaea;
  background: none;
  border-bottom: 1px solid #ffffff;
  transition: 0.3s;
}

.dateDayRoutineEtcBox > .material-symbols-outlined {
  display: block;
  color: #bebebe;
  transition: 0.3s;
  user-select: none;
}

.dateDayRoutineEtcBox:hover > .material-symbols-outlined {
  display: block;
  color: #727272;
}

.notFinish {
  width: 25px;
  height: 25px;
  border-radius: 5px;
  border: 2px solid #2f2f2f;
}

.finish {
  width: 25px;
  height: 25px;
  border-radius: 5px;
  border: 2px solid #00b775;
  background: #00b775;
}

.finish:hover,
.notFinish:hover {
  transition: 0.1s;
  transform: scale(1.1, 1.1);
}

.finishText {
  transition: 0.3s;
  text-decoration: line-through;
  color: #8d8d8d;
}

.dateDayRoutineEtcBox {
  text-align: right;
  margin-left: auto;
}

.subMenuAnimation-enter-from,
.subMenuAnimation-leave-to {
}

.subMenuAnimation-enter-active {
  -webkit-animation: scale-in-bl 0.1s ease-in both;
  animation: scale-in-bl 0.1s ease-in both;
}

.subMenuAnimation-leave-active {
  -webkit-animation: scale-down-bl 0.1s ease-out both;
  animation: scale-down-bl 0.1s ease-out both;
}

/* ----------------------------------------------
 * Generated by Animista on 2023-12-3 17:57:46
 * Licensed under FreeBSD License.
 * See http://animista.net/license for more info.
 * w: http://animista.net, t: @cssanimista
 * ---------------------------------------------- */

/**
 * ----------------------------------------
 * animation scale-in-bl
 * ----------------------------------------
 */
@-webkit-keyframes scale-in-bl {
  0% {
    -webkit-transform: scale(0);
    transform: scale(0);
    -webkit-transform-origin: 0% 100%;
    transform-origin: 0% 100%;
    opacity: 1;
  }
  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
    -webkit-transform-origin: 0% 100%;
    transform-origin: 0% 100%;
    opacity: 1;
  }
}

@keyframes scale-in-bl {
  0% {
    -webkit-transform: scale(0);
    transform: scale(0);
    -webkit-transform-origin: 0% 100%;
    transform-origin: 0% 100%;
    opacity: 1;
  }
  100% {
    -webkit-transform: scale(1);
    transform: scale(1);
    -webkit-transform-origin: 0% 100%;
    transform-origin: 0% 100%;
    opacity: 1;
  }
}

@-webkit-keyframes scale-down-bl {
  0% {
    -webkit-transform: scale(1);
    transform: scale(1);
    -webkit-transform-origin: 0% 100%;
    transform-origin: 0% 100%;
  }
  100% {
    -webkit-transform: scale(0);
    transform: scale(0);
    -webkit-transform-origin: 0% 100%;
    transform-origin: 0% 100%;
  }
}

@keyframes scale-down-bl {
  0% {
    -webkit-transform: scale(1);
    transform: scale(1);
    -webkit-transform-origin: 0% 100%;
    transform-origin: 0% 100%;
  }
  100% {
    -webkit-transform: scale(0);
    transform: scale(0);
    -webkit-transform-origin: 0% 100%;
    transform-origin: 0% 100%;
  }
}

</style>