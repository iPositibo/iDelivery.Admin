import axios from 'axios'
import AuthService from '../../infra/auth.service'

class RiderStatusService {
	token = AuthService.getToken()

	addRiderStatus = status => {
		const url = process.env.VUE_APP_HOST_URL + '/riderStatus'
		return axios.post(url, status, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	editRiderStatus = (id, status) => {
		const url = process.env.VUE_APP_HOST_URL + '/riderStatus/' + id
		return axios.put(url, status, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	deleteRiderStatus = id => {
		const url = process.env.VUE_APP_HOST_URL + '/riderStatus/' + id
		return axios.delete(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	getRiderStatus = id => {
		const url = process.env.VUE_APP_HOST_URL + '/riderStatus/' + id
		return axios.get(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	getAllRiderStatus = () => {
		const url = process.env.VUE_APP_HOST_URL + '/riderStatus'
		return axios.get(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}
}

const riderStatusService = new RiderStatusService()
export default riderStatusService