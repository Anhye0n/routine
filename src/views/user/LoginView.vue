<template>
  <div id="loginContainer" v-if="changeBox === 'login'">
    <h1 id="loginTitle">Login</h1>
    <div id="userIDContainer">
      <p class="inputExplain">Username</p>
      <label for="userID"><span class="material-symbols-outlined">person</span></label>
      <input id="userID" class="loginInputSetting" type="text" v-model="userID" @keyup.enter="sendLogin"
             autocapitalize="off" ref="inputFocus">
    </div>

    <div id="userPwdContainer">
      <p class="inputExplain">Password</p>
      <label for="userPwd"><span class="material-symbols-outlined">lock</span></label>
      <input id="userPwd" class="loginInputSetting" type="password" v-model="userPwd" @keyup.enter="sendLogin"
             autocapitalize="off">
    </div>

    <div>
      <button type="button" class="submitButton" @click="sendLogin">Go my routine</button>
    </div>
    <button type="button" class="changeButton" @click="() => {changeBox = 'register'; userID = ''; userPwd = ''}">Sign
      up
    </button>
  </div>

  <div id="loginContainer" v-else-if="changeBox === 'register'">
    <h1 id="loginTitle">Create Account</h1>
    <div id="userIDContainer">
      <p class="inputExplain">Username</p>
      <label for="userID"><span class="material-symbols-outlined">person</span></label>
      <input id="userID" class="loginInputSetting" type="text" v-model="userID" @keyup.enter="sendRegister"
             autocomplete="off">
    </div>

    <div id="userPwdContainer">
      <p class="inputExplain">Password</p>
      <label for="userPwd"><span class="material-symbols-outlined">lock</span></label>
      <input id="userPwd" class="loginInputSetting" type="password" v-model="userPwd" @keyup.enter="sendRegister"
             autocomplete="off">
    </div>

    <div>
      <button type="button" class="submitButton" @click="sendRegister">Sign up</button>
    </div>
    <button type="button" class="changeButton" @click="() => {changeBox = 'login'; userID = ''; userPwd = ''}">Login
    </button>
  </div>

</template>

<script setup>
import { inject, onMounted, ref, watch, watchEffect } from "vue"
import VueCookies from "vue-cookies"

const { format } = inject("todayDate")
const todayDate = format.today

import { useApi } from "@/api"
import router from "@/router"
import { useUserStore } from "@/stores/userManage"
import { storeToRefs } from "pinia"
import { checkAccessToken, checkRefreshToken } from "@/plugins/jwt/checkToken"
import { useRouter } from "vue-router"

const { userName } = storeToRefs(useUserStore())

const userID = ref("")
const userPwd = ref("")

const changeBox = ref("login")

const inputFocus = ref(null)

onMounted(() => {
  watchEffect(changeBox => {
    inputFocus.value?.focus()
  })
})

const sendLogin = () => {
  if (userID.value === "") {
    alert("ID가 입력되지 않았습니다.")
    return
  } else if (userPwd.value === "") {
    alert("비밀번호가 입력되지 않았습니다.")
    return
  }
  useApi("/auth/login", "post", {
    "user_name": userID.value,
    "user_pwd": userPwd.value
  })
    .then(res => {
      if (res.data === false) {
        alert("존재하지 않는 계정 입니다")
      } else {
        console.log(res.data)
        userName.value = res.data
        router.push({ name: "day", params: { date: todayDate } })
        // console.log(res.data)
      }
    })
}

const sendRegister = () => {
  if (userID.value === "") {
    alert("ID가 입력되지 않았습니다.")
    return
  } else if (userPwd.value === "") {
    alert("비밀번호가 입력되지 않았습니다.")
    return
  }
  useApi("/user/register", "post", {
    "user_name": userID.value,
    "user_pwd": userPwd.value
  })
    .then(res => {
      if (res.data === false) {
        alert("이미 존재하는 이름입니다.")
      } else {
        // router.push({ name: "day", params: { date: todayDate } })
        alert("가입이 완료되었습니다.")
        changeBox.value = "login"
      }
    })
}
</script>

<style scoped>
@import "https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0";

#loginTitle {
  margin-top: 70px;
  margin-bottom: 70px;
  font-family: "NanumSquareB", serif;
  font-size: 3rem;
}

.loginInputSetting {
  color: #a9a9a9;
  width: 280px;
  border: none;
  border-bottom: 1px solid #2b2d31;
  font-size: 1.2rem;
  padding: 14px 10px 12px 55px;
  background: none;
  transition: 0.3s;
}

input:focus {
  border-bottom: 1px solid #c7c7c7;
}

#userID {
  font-family: "NanumSquareB", serif;
}

#userIDContainer, #userPwdContainer {
}

#userPwdContainer {
  margin-top: 20px;
}

.inputExplain {
  font-size: 1.2rem;
  padding-left: 130px;
  margin-top: 35px;
  margin-bottom: 5px;
  font-family: "NanumSquareB", serif;
  text-align: left;
}

label[for='userID'] .material-symbols-outlined,
label[for='userPwd'] .material-symbols-outlined {
  position: absolute;
  padding-top: 7px;
  padding-left: 10px;
  font-size: 2rem;
  color: #a8a8a8;
}

.submitButton {
  font-family: "NanumSquareB", serif;
  background: #76b961;
  color: #ffffff;
  cursor: pointer;
  margin-top: 20px;
  padding: 10px 0 10px 0;
  width: 340px;
  font-size: 1.5rem;
  border: none;
  border-radius: 5px;
  transition: 0.3s;
}

.submitButton:hover {
  background: #5a8d4a;
}

.submitButton:active {
  color: #ffffff;
  background: #575757;
  transform: scale(.96);
}

.changeButton {
  cursor: pointer;
  margin-top: 15px;
  background: none;
  border: none;
  box-shadow: none;
  font-size: 1.2rem;
  text-decoration: underline;
  color: #d7d7d7;
  transition: 0.3s;
}

.changeButton:hover {
  color: #ffffff;
}
</style>