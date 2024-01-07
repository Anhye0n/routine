<template>
  <div>
    <div id="userNameBox">
      <span class="material-symbols-outlined" v-if="userName !== null">edit_calendar</span>
      <p id="userName">{{ userName }}</p>
    </div>
    <div id="mainBoxUi">
      <RouterView />
    </div>
    <div id="logout" v-if="userName">
      <p @click="logout">로그아웃</p>
    </div>
  </div>
</template>

<script setup>
import { useUserStore } from "@/stores/userManage"
import axios from "axios"
import router from "@/router"
import { storeToRefs } from "pinia"

const { userNameClear } = useUserStore()
const { userName } = storeToRefs(useUserStore())

const logout = () => {
  axios({
    method: "post",
    url: `${import.meta.env.VITE_APP_API_URL}/auth/logout`,
    withCredentials: true
  }).then(res => {
    if (res.data) {
      userNameClear()
      alert("로그아웃되었습니다")
      router.push("/")
      // location.href = "http://localhost:5173/"
    }
  })
}

</script>

<style scoped>
#userNameBox {
  display: flex;
  align-items: center;
  height: 100px;
  justify-content: center;
  margin-top: 200px;
  color: #d3d3d3;
}

#userName {
  text-align: center;
  color: #d3d3d3;
  font-size: 2rem;
  font-family: "NanumSquareEB", serif;
}

.material-symbols-outlined {
  padding-right: 40px;
  display: block;
  font-size: 5rem;
}

#mainBoxUi {
  max-width: 600px;
  min-width: 300px;
  text-align: center;
  border-radius: 5px;
  margin: 20px auto auto;
  padding: 0.05px;
  padding-bottom: 40px;
  background: #23222a;
  box-shadow: 1px 1px 40px 6px rgba(0, 0, 0, 0.52);
  -webkit-box-shadow: 1px 1px 40px 6px rgba(0, 0, 0, 0.52);
  -moz-box-shadow: 1px 1px 40px 6px rgba(0, 0, 0, 0.52);
}

#logout {
  margin-top: 10px;
  text-align: center;
  font-size: 1.2rem;
  color: #000000;
}

#logout > p {
  color: #ffffff;
  transition: 0.1s;
  cursor: pointer;
  display: inline;
}

#logout > p:hover {
  user-select: none;
  font-size: 1.3rem;
}
</style>