import axios from 'axios'
const api_url = 'https://wata-api.sawasdeehub.tech/api/'
//const api_url = 'https://wataservice-api.xcard.live/api/'
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
  async projectDashboard(auth) {
    if (checkCookie()) {
      return await axios.get(api_url + `v1/projects/dashboard`, auth)
    }
  },
  async projectGenlink(project_id,auth) {
    if (checkCookie()) {
      return await axios.get(api_url + `v1/projects/${project_id}/genlink`, auth)
    }
  },
  async projectLink(encrypted_url) {
    if (checkCookie()) {
      return `${encrypted_url}`
    }
  },
  async projectTimeline(auth) {
    if (checkCookie()) {
      return await axios.get(api_url + `v1/projects/timeline`, auth)
    }
  },
  async projectTimelineByIdproject(project_id,auth) {
    if (checkCookie()) {
      return await axios.get(api_url + `v1/projects/${project_id}/timeline`, auth)
    }
  },


  // === teams ===
  async teams(page_number, auth) {
    if (checkCookie()) {
      return await axios.get(api_url + `v1/teams?page=${page_number}`, auth)
    }
  },
  async teamsDetail(team_id, auth) {
    if (checkCookie()) {
      return await axios.get(api_url + `v1/teams/${team_id}/edit`, auth)
    }
  },
  async teamsSave(databody, auth) {
    if (checkCookie()) {
      return await axios.post(api_url + `v1/teams`, databody, auth)
    }
  },
  async teamsUpdate(team_id, databody, auth) {
    if (checkCookie()) {
      return await axios.patch(api_url + `v1/teams/${team_id}`, databody, auth)
    }
  },
  async teamsAvatar(team_id, databody, auth) {
    if (checkCookie()) {
      return await axios.patch(api_url + `v1/teams/${team_id}/avatar`, databody, auth)
    }
  },
  async teamsDelete(team_id, auth) {
    if (checkCookie()) {
      return await axios.delete(api_url + `v1/teams/${team_id}`, auth)
    }
  },

  // === users ===
  async users(page_number, auth) {
    if (checkCookie()) {
      return await axios.get(api_url + `v1/users?page=${page_number}`, auth)
    }
  },
  async usersRole(auth) {
    if (checkCookie()) {
      return await axios.get(api_url + `v1/users/create`, auth)
    }
  },
  async userDetail(user_id, auth) {
    if (checkCookie()) {
      return await axios.get(api_url + `v1/users/${user_id}/edit`, auth)
    }
  },
  async userSave(databody, auth) {
    if (checkCookie()) {
      return await axios.post(api_url + `v1/users`, databody, auth)
    }
  },
  async userUpdate(user_id, databody, auth) {
    if (checkCookie()) {
      return await axios.patch(api_url + `v1/users/${user_id}`, databody, auth)
    }
  },
  async userDelete(user_id, auth) {
    if (checkCookie()) {
      return await axios.delete(api_url + `v1/users/${user_id}`, auth)
    }
  },
  async userAvatar(user_id, databody, auth) {
    if (checkCookie()) {
      return await axios.patch(api_url + `v1/users/${user_id}/avatar`, databody, auth)
    }
  },

  // === report ===
  async reportProjectbyIdreport(report_id, auth) {
    if (checkCookie()) {
      return await axios.get(api_url + `v1/reports/${report_id}/edit`, auth)
    }
  },
  async reportProject(project_id, auth) {
    if (checkCookie()) {
      return await axios.get(api_url + `v1/projects/${project_id}/reports`, auth)
    }
  },
  async reportSave(project_services_id,databody, auth) {
    if (checkCookie()) {
      return await axios.post(api_url + `v1/project-services/${project_services_id}/reports`, databody, auth)
    }
  },
  async reportUpdate(report_id, databody, auth) {
    if (checkCookie()) {
      return await axios.patch(api_url + `v1/reports/${report_id}`, databody, auth)
    }
  },
  
  async reportDelete(report_id, auth) {
    if (checkCookie()) {
      return await axios.delete(api_url + `v1/reports/${report_id}`, auth)
    }
  },

  //customer
  async customerProject(encrypted_url, auth) {
    if (checkCookie()) {
      return await axios.get(api_url + `v1/projects/customer/${encrypted_url}`, auth)
    }
  },
}
