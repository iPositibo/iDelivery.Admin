import axios from 'axios'
import AuthService from '../../infra/auth.service'

class RiderService {
	token = AuthService.getToken()

	addRider = rider => {
		const url = process.env.VUE_APP_HOST_URL + '/rider'
		return axios.post(url, rider, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	editRider = (id, rider) => {
		const url = process.env.VUE_APP_HOST_URL + '/rider/' + id
		return axios.put(url, rider, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	deleteRider = id => {
		const url = process.env.VUE_APP_HOST_URL + '/rider/' + id
		return axios.delete(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	getRider = id => {
		const url = process.env.VUE_APP_HOST_URL + '/rider/' + id
		return axios.get(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	getAllRiders = () => {
		const url = process.env.VUE_APP_HOST_URL + '/rider'
		return axios.get(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	getAllActiveRiders = () => {
		const url = process.env.VUE_APP_HOST_URL + '/rider/getAllActiveRiders'
		return axios.get(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	getAllAvailableRiderUsers = () => {
		const url = process.env.VUE_APP_HOST_URL + '/customer/getAllAvailableRiderUsers'
		return axios.get(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}
}

const riderService = new RiderService()
export default riderService