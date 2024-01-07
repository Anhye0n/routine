import axios from "axios"

const checkAccessToken = () => {
  return axios({
    method: "post",
    url: `${import.meta.env.VITE_APP_API_URL}/auth/check/accessToken`,
    withCredentials: true
  }).then(res => {
    console.log("access token 인증 성공")
    return true
  }).catch(err => {
    console.log("Access Token 만료됨.")
    return false
  })
}
const checkRefreshToken = async () => {
  return axios({
    method: "post",
    url: `${import.meta.env.VITE_APP_API_URL}/auth/check/refreshToken`,
    withCredentials: true
  }).then(res => {
    console.log("access token 재발급 성공")
    return true
  }).catch(err => {
    console.log("Refresh Token 만료됨.")
    return false
  })
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
export {checkAccessToken, checkRefreshToken, authenticateToken}