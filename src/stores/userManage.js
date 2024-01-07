import { defineStore } from "pinia"
import { checkAccessToken, checkRefreshToken } from "@/plugins/jwt/checkToken"
import { useRouter } from "vue-router"

export const useUserStore = defineStore("user", {
  state: () => ({
    userName: null
  }),
  getters: {},
  actions: {
    userNameClear() {
      this.userName = null
    }
  },
  // 새로고침해도 안바뀜.
  persist: true
})