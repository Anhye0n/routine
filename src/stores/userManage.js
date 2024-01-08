import { defineStore } from "pinia"
import { checkAccessToken, checkRefreshToken } from "@/plugins/jwt/checkToken"
import { useRouter } from "vue-router"

export const useUserStore = defineStore("user", {
  state: () => ({
    userName: null,
    accessToken: null
  }),
  getters: {},
  actions: {
    userNameClear() {
      this.userName = null
    },
    setAccessToken(token) {
      this.accessToken = token
    }
  },
  // 새로고침해도 안바뀜.
  persist: true
})