import axios from 'axios'
import AuthService from '../../infra/auth.service'

class BlockRiderService {
	token = AuthService.getToken()

	addBlockRider = blockrider => {
		const url = process.env.VUE_APP_HOST_URL + '/blockedRider'
		return axios.post(url, blockrider, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	editBlockRider = (id, blockrider) => {
		const url = process.env.VUE_APP_HOST_URL + '/blockedRider/' + id
		return axios.put(url, blockrider, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	deleteBlockRider = id => {
		const url = process.env.VUE_APP_HOST_URL + '/blockedRider/' + id
		return axios.delete(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	getBlockRider = id => {
		const url = process.env.VUE_APP_HOST_URL + '/blockedRider/' + id
		return axios.get(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	getAllBlockRiders = () => {
		const url = process.env.VUE_APP_HOST_URL + '/blockedRider'
		return axios.get(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}
}

const blockRiderService = new BlockRiderService()
export default blockRiderService