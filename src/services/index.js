import axios from 'axios'
const api_url = 'https://wata-api.sawasdeehub.tech/api/'
import Cookies from 'js-cookie'
export async function checkCookie() {
  if (Cookies.get('wataservices_token')) {

    return true
  }
  else {

    //window.location.href = `/signin`
  }

}
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

  async platforms(page_number, auth) {
    if (checkCookie()) {

      return await axios.get(api_url + `v1/platforms?page=${page_number}`, auth)
    }
   

  },
  async platformsbyId(platform_id, auth) {
    if (checkCookie()) {
      return await axios.get(api_url + `v1/platforms/${platform_id}/edit`, auth)

    }
  },
  async AddPlatforms(databody, auth) {
    if (checkCookie()) {
      return await axios.post(api_url + `v1/platforms`, databody, auth)
    }

  },
  async UpdatePlatforms(platform_id, databody, auth) {
    if (checkCookie()) {
      return await axios.patch(api_url + `v1/platforms/${platform_id}`, databody, auth)
    }

  },
  async DeletePlatforms(platform_id, auth) {
    if (checkCookie()) {
      return await axios.delete(api_url + `v1/platforms/${platform_id}`, auth)
    }

  },



  // === services ===
  async services(page_number, auth) {
    if (checkCookie()) {
      return await axios.get(api_url + `v1/services?page=${page_number}`, auth)
    }

  },
  async servicesCreate(auth) {
    if (checkCookie()) {
      return await axios.get(api_url + `v1/services/create`, auth)
    }

  },
  async servicesDetail(serives_id, auth) {
    if (checkCookie()) {
      return await axios.get(api_url + `v1/services/${serives_id}/edit`, auth)
    }

  },
  async servicesSave(databody, auth) {
    if (checkCookie()) {
      return await axios.post(api_url + `v1/services`, databody, auth)
    }

  },
  async servicesLogo(services_id, databody, auth) {
    if (checkCookie()) {
      return await axios.patch(api_url + `v1/services/${services_id}/logo`, databody, auth)
    }

  },
  async servicesDelete(services_id, auth) {
    if (checkCookie()) {
      return await axios.delete(api_url + `v1/services/${services_id}`, auth)
    }

  },
  async servicesUpdate(services_id, databody, auth) {
    if (checkCookie()) {
      return await axios.patch(api_url + `v1/services/${services_id}`, databody, auth)
    }

  },


  // === Project ===
  async projects(page_number, auth) {
    if (checkCookie()) {
      return await axios.get(api_url + `v1/projects?page=${page_number}`, auth)
    }
  },
  async projectCreate(auth) {
    if (checkCookie()) {
      return await axios.get(api_url + `v1/projects/create`, auth)
    }

  },
  async projectSave(databody, auth) {
    if (checkCookie()) {
      return await axios.post(api_url + `v1/projects`, databody, auth)
    }

  },
  async projectUpdate(project_id, databody, auth) {
    if (checkCookie()) {
      return await axios.patch(api_url + `v1/projects/${project_id}`, databody, auth)
    }

  },
  async projectDetail(project_id, auth) {
    if (checkCookie()) {
      return await axios.get(api_url + `v1/projects/${project_id}/edit`, auth)
    }

  },
  async projectLogo(project_id, databody, auth) {
    if (checkCookie()) {
      return await axios.patch(api_url + `v1/projects/${project_id}/logo`, databody, auth)
    }

  },
  async projectDelete(project_id, auth) {
    if (checkCookie()) {
      return await axios.delete(api_url + `v1/projects/${project_id}`, auth)
    }
  },


}
