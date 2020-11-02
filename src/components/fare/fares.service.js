import axios from 'axios'
import AuthService from '../../infra/auth.service'

class FareService {
	token = AuthService.getToken()

	addFare = fare => {
		const url = process.env.VUE_APP_HOST_URL + '/fare'
		return axios.post(url, fare, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	editFare = (id, fare) => {
		const url = process.env.VUE_APP_HOST_URL + '/fare/' + id
		return axios.put(url, fare, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	deleteFare = id => {
		const url = process.env.VUE_APP_HOST_URL + '/fare/' + id
		return axios.delete(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	getFare= id => {
		const url = process.env.VUE_APP_HOST_URL + '/fare/' + id
		return axios.get(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	getAllFares = () => {
		const url = process.env.VUE_APP_HOST_URL + '/fare'
		return axios.get(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	getDefaultFare = () => {
		const url = process.env.VUE_APP_HOST_URL + '/fare/GetDefaultFare'
		return axios.get(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}
}

const fareService = new FareService()
export default fareService