import axios from "axios"
axios.defaults.withCredentials = true;

export async function useApi(url, method, bodyData) {
  return await axios({
    method: method,
    url: import.meta.env.VITE_APP_API_URL + url,
    data: bodyData,
    responseType: "json"
  }).then(res => {
    return res
  }).catch(err => {
    throw err
  })

}