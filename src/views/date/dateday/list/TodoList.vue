<template>
  <div id="dateDayTodoListBox">
    <div
        class="dateDayTodoBox"
        v-for="(todoData, index) in todoArray"
        :key="todoData.todoId"
    >
      <div
          v-if="todoData.isFinish === true"
          class="finish"
          @click="isFinishFunc(todoData)"
      ></div>
      <div
          v-else-if="todoData.isFinish === false"
          class="notFinish"
          @click="isFinishFunc(todoData)"
      ></div>
      <p v-if="!todoData.editTodoContent"
         class="dateDayTodoContent"
         :class="{ finishText: todoData.isFinish }"
         @click="isFinishFunc(todoData)"
      >
        {{ todoData.content }}
      </p>
      <input class="dateDayTodoContentEdit" type="text" v-if="todoData.editTodoContent"
             :value="todoData.content" @keyup.enter="e => submitEditTodo(e, todoData)">
      <div class="dateDayTodoEtcBox" ref="menuRef">
        <Transition name="subMenuAnimation">
          <useMenu
              :content-id="todoData.todoId"
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
import router from "@/router"
import { inject, ref } from "vue"
import { useRoute } from "vue-router"
import { storeToRefs } from "pinia"
import { useUserStore } from "@/stores/userManage"


const { format } = inject("todayDate")
const { getCurrentDateTime } = format

const route = useRoute()
const { userName, accessToken } = storeToRefs(useUserStore())

const { getTodoData, todoArray } = defineProps({
  getTodoData: {
    type: Function
  },
  todoArray: {
    type: Array
  }
})

const emits = defineEmits(["editTodoData"])

const subMenu = ["수정", "삭제"]

const subMenuView = ref([])

const isFinishFunc = todoData => {
  todoData.isFinish = !todoData.isFinish

  if (!authenticateToken()) {
    alert("다시 로그인해주시길 바랍니다.")
    router.push({ path: "/" })
  }

  axios({
    method: "post",
    url: `${import.meta.env.VITE_APP_API_URL}/todo/finished`,
    headers: {
      Authorization: `Bearer ${accessToken.value}`
    },
    data: {
      todo_UUID: todoData.todoId,
      todo_date: route.params.date,
      todo_content: todoData.content,
      todo_author: userName.value,
      todo_finished: todoData.isFinish === true ? 1 : 0,
      todo_updatedAt: getCurrentDateTime()
    }
  }).then(res => {
    // console.log(res)
    getTodoData()
  }).catch(err => {
    console.log(err)
    if (err.response.status === 403) {
      alert("잘못된 접근입니다.")
    }
    // console.log(err)
  })
}

const deleteTodo = (todoId) => {
  axios({
    method: "post",
    url: `${import.meta.env.VITE_APP_API_URL}/todo/delete`,
    headers: {
      Authorization: `Bearer ${accessToken.value}`
    },
    data: {
      todo_UUID: todoId,
      todo_date: route.params.date,
      todo_author: userName.value
    }
  }).then(res => {
    console.log("루틴 삭제 성공")
    getTodoData()
  }).catch(err => {
    console.log(err)
  })
}

const editTodo = (todoId) => {

  emits("editTodoData", todoId)
}

const submitEditTodo = (e, todoData) => {
  if (!e.target.value.replace(/\s/g, "")) return

  if (e.target.value.length >= 80) {
    alert("80자 이상은 불가능합니다.")
    e.target.value = e.target.value.slice(0, 79)
    return
  }

  axios({
    method: "post",
    url: `${import.meta.env.VITE_APP_API_URL}/todo/edit`,
    headers: {
      Authorization: `Bearer ${accessToken.value}`
    },
    data: {
      todo_UUID: todoData.todoId,
      todo_date: route.params.date,
      todo_content: e.target.value,
      todo_author: todoData.author
    }
  }).then(res => {
    // console.log(res)
    getTodoData()
  }).catch(err => {
    if (err.response.status === 403) {
      alert("잘못된 접근입니다.")
    }
    // console.log(err)
  })
}

const runMenu = (menu, todoId) => {
  if (!authenticateToken()) {
    alert("다시 로그인해주시길 바랍니다.")
    router.push({ path: "/" })
  }

  if (menu === "삭제") {
    deleteTodo(todoId)
  } else if (menu === "수정") {
    editTodo(todoId)
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
#dateDayTodoListBox {
  margin: 20px auto;
}

.dateDayTodoBox {
  margin: 10px auto;
  width: 480px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  cursor: pointer;
}

.dateDayTodoContent {
  width: 350px;
  text-align: left;
  font-size: 1.2rem;
  margin-left: 15px;
  margin-top: 12px;
  margin-bottom: 10px;
  color: #eaeaea;
}

.dateDayTodoContentEdit {
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

.dateDayTodoEtcBox > .material-symbols-outlined {
  display: block;
  color: #bebebe;
  transition: 0.3s;
  user-select: none;
}

.dateDayTodoEtcBox:hover > .material-symbols-outlined {
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
  border: 2px solid #1eaf50;
  background: #1eaf50;
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

.dateDayTodoEtcBox {
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