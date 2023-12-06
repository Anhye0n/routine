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

  <div id="dateDayInputRoutineBox">
    <label for="dateDayInputRoutine">
      <span class="material-symbols-outlined">playlist_add</span>
    </label>
    <input
      id="dateDayInputRoutine"
      type="text"
      placeholder="Add a task..."
      @keyup.enter="e => addRoutine(e)"
      autocomplete="off"
    />
  </div>

  <div id="dateDayRoutineListBox">
    <div
      class="dateDayRoutineBox"
      v-for="(inputData, index) in inputArray"
      :key="inputData.routineId"
    >
      <div
        v-if="inputData.isFinish === true"
        class="finish"
        @click="isFinishFunc(inputData)"
      ></div>
      <div
        v-else-if="inputData.isFinish === false"
        class="notFinish"
        @click="isFinishFunc(inputData)"
      ></div>
      <p
        class="dateDayRoutineContent"
        :class="{ finishText: inputData.isFinish }"
        @click="isFinishFunc(inputData)"
      >
        {{ inputData.content }}
      </p>
      <div class="dateDayRoutineEtcBox" ref="menuRef">
        <Transition name="subMenuAnimation">
          <useMenu
            :sub-menu="subMenu"
            v-if="subMenuView[index]"
            :menu-ref="$refs.menuRef"
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
import { computed, inject, ref } from "vue"
import UseMenu from "@/components/useMenu.vue"
import { useRoute, useRouter } from "vue-router"

const { format, calcDate } = inject("todayDate")
const { today, propsToFormat } = format
const { prevDay, nextDay } = calcDate

const route = useRoute()
const router = useRouter()
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

const subMenu = ["수정", "삭제"]

const subMenuView = ref([])
const inputArray = ref([
  {
    routineId: "1234",
    content: "비타민c 먹기",
    isFinish: false
  },
  {
    routineId: "5678",
    content: "운동가기",
    isFinish: false
  }
])

const dateDayMove = type => {
  if (type === "prev") {
    router.push({ name: "day", params: { date: prevDay(route.params.date) } })
    return
  }
  router.push({ name: "day", params: { date: nextDay(route.params.date) } })
}

const closeSubMenu = (subMenuView, index) => {
  subMenuView.fill(false)
  subMenuView[index] = !subMenuView[index]
}

const closeSubMenuOutside = (subMenuView, index) => {
  subMenuView[index] = !subMenuView[index]
}
const addRoutine = e => {
  const routineId = new Date().getTime()
  inputArray.value.push({ routineId, content: e.target.value, isFinish: false })
  e.target.value = ""
}

const isFinishFunc = inputData => {
  inputData.isFinish = !inputData.isFinish
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
//font-family: "NanumSquareB", serif;
}

#dateDayInputRoutine {
  color: #a9a9a9;
  width: 410px;
  min-width: 300px;
  background: #343a40;
  border-radius: 5px;
  border: 1px solid #2b2d31;
  font-family: "NanumSquareB", serif;
  font-size: 1.2rem;
  padding: 11px 10px 10px 55px;
}

#dateDayInputRoutineBox {
  margin-top: 60px;
}

label > .material-symbols-outlined {
  position: absolute;
  padding-top: 7px;
  padding-left: 14px;
  font-size: 2rem;
  color: #a8a8a8;
}

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
  font-size: 1.2rem;
  margin-left: 15px;
  margin-top: 12px;
  margin-bottom: 10px;
  color: #eaeaea;
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
  border: 2px solid #b4d491;
  background: #b4d491;
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

.subMenuAnimation-enter-from,
.subMenuAnimation-leave-to {
}

.subMenuAnimation-enter-active {
//transition: opacity 0.3s ease; -webkit-animation: scale-in-bl 0.1s ease-in both; animation: scale-in-bl 0.1s ease-in both;
}

.subMenuAnimation-leave-active {
  -webkit-animation: scale-down-bl 0.1s ease-out both;
  animation: scale-down-bl 0.1s ease-out both;
}

.subMenuAnimation-enter-to,
.subMenuAnimation-leave-from {
//opacity: 1;
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