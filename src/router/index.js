import { createRouter, createWebHistory, useRouter, useRoute } from "vue-router"
import VueCookies from "vue-cookies"

import DateDay from "@/views/date/DateDay.vue"
import DateWeek from "@/views/date/DateWeek.vue"
import DateMonth from "@/views/date/DateMonth.vue"

import NotFoundView from "@/views/NotFoundView.vue"

import LoginView from "@/views/user/LoginView.vue"
import DateHome from "@/views/date/DateHome.vue"
import axios from "axios"

import { useUserStore } from "@/stores/userManage"
import { inject } from "vue"

import { checkAccessToken, checkRefreshToken } from "@/plugins/jwt/checkToken"

const router = createRouter({
    history: createWebHistory("/"),
    routes: [
        {
            // path: '/login',
            path: "/",
            name: "login",
            component: LoginView,
            beforeEnter: async (to, from, next) => {

                const { format } = inject("todayDate")
                const todayDate = format.today

                const { userNameClear } = useUserStore()

                const accessTokenResult = await checkAccessToken()
                if (accessTokenResult) {
                    if (from.path === "/") {
                        next({ name: "day", params: { date: todayDate } })
                        console.log("로그인 되어있음")
                        return
                    }

                    alert("이미 로그인되었습니다.")
                    next(false)
                    return
                }

                const refreshTokenResult = await checkRefreshToken()
                if (refreshTokenResult) {
                    if (from.path === "/") {
                        next({ name: "day", params: { date: todayDate } })
                        console.log("로그인 되어있음")
                        return
                    }

                    alert("이미 로그인되었습니다.")
                    next(false)
                    return
                }

                userNameClear()
                next()
                return
            }
        },
        {
            path: "/home",
            name: "home",
            component: DateHome,
            children: [
                {
                    path: "day/:date",
                    name: "day",
                    component: DateDay
                },
                {
                    path: "week/:date",
                    name: "week",
                    component: DateWeek
                },
                {
                    path: "month/:date",
                    name: "month",
                    component: DateMonth
                }
            ]
        },
        {
            path: "/:pathMatch(.*)*",
            name: "NotFound",
            component: NotFoundView
        }
    ]
})

router.beforeEach(async (to, from, next) => {
    const { userName, userNameClear } = useUserStore()

    if (to.path === "/") {
        next()
        // console.clear()
        return
    }

    const accessTokenResult = await checkAccessToken()
    if (accessTokenResult) {
        next()
        // console.clear()
        return
    }

    const refreshTokenResult = await checkRefreshToken()
    if (refreshTokenResult) {
        next()
        // console.clear()
        return
    }

    // 모든 jwt 유효하지 않음
    // console.clear()
    userNameClear()
    alert("다시 로그인해주시길 바랍니다.")
    next("/")
})


export default router
