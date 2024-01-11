import axios from "axios"
import { useUserStore } from "@/stores/userManage"

const checkAccessToken = async () => {
  const { accessToken } = useUserStore()

  try {
    const response = await axios({
      method: "post",
      url: `${import.meta.env.VITE_APP_API_URL}/auth/check/accessToken`,
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
      withCredentials: true
    })
    if (response.data) {
      console.log("access token 인증 성공")
      return true
    }
  } catch (err) {
    console.log("Access Token 만료됨.")
    return false
  }
}

const checkRefreshToken = async () => {

  const { setAccessToken } = useUserStore()

  try {
    const response = await axios({
      method: "post",
      url: `${import.meta.env.VITE_APP_API_URL}/auth/check/refreshToken`,
      withCredentials: true
    })
    setAccessToken(response.headers["authorization"].replace("Bearer ", ""))
    console.log("access token 재발급 성공")

    return true
  } catch (err) {
    console.log("Refresh Token 만료됨.")
    return false
  }
}

const authenticateToken = async () => {
  const accessTokenResult = await checkAccessToken()
  if (accessTokenResult) {
    // console.clear()
    return true
  }

  const refreshTokenResult = await checkRefreshToken()
  if (refreshTokenResult) {
    // console.clear()
    return true
  }

  // 모든 jwt 유효하지 않음
  // console.clear()
  return false
}
export { checkAccessToken, checkRefreshToken, authenticateToken }