import axios from 'axios'
const api_url = 'https://wata-api.sawasdeehub.tech/api/'

export default {
  // === login ===
  async login (databody) {
    return await axios.post(api_url + `login`, databody)
  },

   // === logout ===
   
   async logout (auth) {
   
    return await axios.post(api_url + `logout`, auth)
  },

  // === platform ===
   
  async platforms (auth) {
   
    return await axios.get(api_url + `v1/platforms`, auth)
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
