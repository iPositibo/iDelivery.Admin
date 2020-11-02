import axios from 'axios'
import AuthService from '../../infra/auth.service'

class RiderRatingService {
	token = AuthService.getToken()

	addRiderRating = rating => {
		const url = process.env.VUE_APP_HOST_URL + '/riderRating'
		return axios.post(url, rating, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	editRiderRating = (id, rating) => {
		const url = process.env.VUE_APP_HOST_URL + '/riderRating/' + id
		return axios.put(url, rating, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	deleteRiderRating = id => {
		const url = process.env.VUE_APP_HOST_URL + '/riderRating/' + id
		return axios.delete(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	getRiderRating = id => {
		const url = process.env.VUE_APP_HOST_URL + '/riderRating/' + id
		return axios.get(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	getAllRiderRatings = () => {
		const url = process.env.VUE_APP_HOST_URL + '/riderRating'
		return axios.get(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}
}

const riderRatingService = new RiderRatingService()
export default riderRatingService