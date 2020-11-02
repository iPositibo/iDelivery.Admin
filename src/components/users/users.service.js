import axios from 'axios'
import AuthService from '../../infra/auth.service'

class UsersService {
	token = AuthService.getToken()

	addUser= userList => {
		const url = process.env.VUE_APP_HOST_URL + '/user'
		return axios.post(url, userList, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	editUser = (id, userList) => {
		const url = process.env.VUE_APP_HOST_URL + '/user/' + id
		return axios.put(url, userList, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	deleteUser = id => {
		const url = process.env.VUE_APP_HOST_URL + '/user/' + id
		return axios.delete(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	getUser = id => {
		const url = process.env.VUE_APP_HOST_URL + '/user/' + id
		return axios.get(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	getAllUsers = () => {
		const url = process.env.VUE_APP_HOST_URL + '/user'
		return axios.get(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}
}

const usersService = new UsersService()
export default usersService