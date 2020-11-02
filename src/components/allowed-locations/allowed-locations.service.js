import axios from 'axios'
import AuthService from '../../infra/auth.service'

class AllowedLocationService {
	token = AuthService.getToken()

	addAllowedLocation = allowedLocation => {
		const url = process.env.VUE_APP_HOST_URL + '/allowedLocation'
		return axios.post(url, allowedLocation, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	editAllowedLocation = (id, allowedLocation) => {
		const url = process.env.VUE_APP_HOST_URL + '/allowedLocation/' + id
		return axios.put(url, allowedLocation, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	deleteAllowedLocation = id => {
		const url = process.env.VUE_APP_HOST_URL + '/allowedLocation/' + id
		return axios.delete(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	getAllowedLocation = id => {
		const url = process.env.VUE_APP_HOST_URL + '/allowedLocation/' + id
		return axios.get(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	getAllAllowedLocations = () => {
		const url = process.env.VUE_APP_HOST_URL + '/allowedLocation'
		return axios.get(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}
}

const allowedLocationService = new AllowedLocationService()
export default allowedLocationService