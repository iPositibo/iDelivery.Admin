import axios from 'axios'
import AuthService from '../../infra/auth.service'

class RoleService {
	token = AuthService.getToken()

	addRole = role => {
		const url = process.env.VUE_APP_HOST_URL + '/role'
		return axios.post(url, role, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	editRole = (id, role) => {
		const url = process.env.VUE_APP_HOST_URL + '/role/' + id
		return axios.put(url, role, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	deleteRole = id => {
		const url = process.env.VUE_APP_HOST_URL + '/role/' + id
		return axios.delete(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	getRole = id => {
		const url = process.env.VUE_APP_HOST_URL + '/role/' + id
		return axios.get(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	getAllRoles = () => {
		const url = process.env.VUE_APP_HOST_URL + '/role'
		return axios.get(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}
}

const roleService = new RoleService()
export default roleService