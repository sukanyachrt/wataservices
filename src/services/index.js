import axios from 'axios'
import Cookies from 'js-cookie'
const api_url = 'https://wata-api.sawasdeehub.tech/api/'

export function authen() {
  axios.interceptors.request.use(
    config => {
      if (Cookies.get('access_token')) {
        config.headers['Authorization'] = 'Bearer ' + Cookies.get('access_token')
        config.headers['Content-Type'] = 'application/json'
        return config
      } else {
        window.location.href = '/wataservices/signin'
      }
    },
    error => {
      // Token expired
      console.log(error)
      window.location.href = '/signin'
    },
  )
}

export default {
  // === login ===
  async login (databody,authconfig) {
    return await axios.post(api_url + `login`, databody)
  },


  // === forms ===
  async dataForms(databody, authconfig) {
    authen()
    return await axios.post(api_url + `mediform/formsbydata`, databody, authconfig)
  },
  async CreateForms(databody, authconfig) {
    authen()
    return await axios.post(api_url + `mediform/forms`, databody, authconfig)
  },
  async updateForms(formId, databody, authconfig) {
    authen()
    return await axios.patch(api_url + `mediform/forms/${formId}`, databody, authconfig)
  },
  //questions
  async dataQuestions(id, databody, authconfig) {
    authen()
    return await axios.post(api_url + `mediform/questionsbydata/${id}`, databody, authconfig)
  },
  async createQuestions(databody, authconfig) {
    authen()
    return await axios.post(api_url + `mediform/questions`, databody, authconfig)
  },
}
