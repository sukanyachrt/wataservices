import axios from 'axios'
const api_url = 'https://wata-api.sawasdeehub.tech/api/'

export default {
  // === login ===
  async login(databody) {
    return await axios.post(api_url + `login`, databody)
  },

  // === logout ===

  async logout(auth) {

    return await axios.post(api_url + `logout`, auth)
  },

  // === platform ===

  async platforms(page_number,auth) {
    return await axios.get(api_url + `v1/platforms?page=${page_number}`, auth)
  },
  async platformsbyId(platform_id, auth) {
    return await axios.get(api_url + `v1/platforms/${platform_id}/edit`, auth)
  },
  async AddPlatforms(databody, auth) {
    return await axios.post(api_url + `v1/platforms`, databody, auth)
  },
  async UpdatePlatforms(platform_id, databody, auth) {
    return await axios.patch(api_url + `v1/platforms/${platform_id}`, databody, auth)
  },
  async DeletePlatforms(platform_id, auth) {
    return await axios.delete(api_url + `v1/platforms/${platform_id}`, auth)
  },



  // === services ===
  async services(page_number,auth) {
    return await axios.get(api_url + `v1/services?page=${page_number}`, auth)
  },
  async servicesCreate(auth) {
    return await axios.get(api_url + `v1/services/create`, auth)
  },
  async servicesDetail(serives_id,auth) {
    return await axios.get(api_url + `v1/services/${serives_id}/edit`, auth)
  },
  async servicesSave(databody,auth) {
    return await axios.post(api_url + `v1/services`,databody, auth)
  },
  async servicesLogo(services_id,databody,auth) {
    return await axios.patch(api_url + `v1/services/${services_id}/logo`,databody, auth)
  },
  async servicesDelete(services_id, auth) {
    return await axios.delete(api_url + `v1/services/${services_id}`, auth)
  },
  async servicesUpdate(services_id,databody, auth) {
    return await axios.patch(api_url + `v1/services/${services_id}`,databody, auth)
  },



}
