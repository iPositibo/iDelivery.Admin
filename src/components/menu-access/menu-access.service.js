import axios from 'axios'
import AuthService from '../../infra/auth.service'

class MenuAccessService {
    token = AuthService.getToken()

	addMenuAccess = menu => {
		const url = process.env.VUE_APP_HOST_URL + '/menuAccess'
		return axios.post(url, menu, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	editMenuAccess = (id, menu) => {
		const url = process.env.VUE_APP_HOST_URL + '/menuAccess/' + id
		return axios.put(url, menu, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	deleteMenuAccess = id => {
		const url = process.env.VUE_APP_HOST_URL + '/menuAccess/' + id
		return axios.delete(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	getMenuAccess = id => {
		const url = process.env.VUE_APP_HOST_URL + '/menuAccess/' + id
		return axios.get(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	getAllMenuAccess = () => {
		const url = process.env.VUE_APP_HOST_URL + '/menuAccess'
		return axios.get(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}
}

const menuAccessService = new MenuAccessService()
export default menuAccessService