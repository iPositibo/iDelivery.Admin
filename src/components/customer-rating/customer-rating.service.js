import axios from 'axios'
import AuthService from '../../infra/auth.service'

class CustomerRatingService {
	token = AuthService.getToken()

	addCustomerRating = rating => {
		const url = process.env.VUE_APP_HOST_URL + '/customerRating'
		return axios.post(url, rating, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	editCustomerRating = (id, rating) => {
		const url = process.env.VUE_APP_HOST_URL + '/customerRating/' + id
		return axios.put(url, rating, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	deleteCustomerRating = id => {
		const url = process.env.VUE_APP_HOST_URL + '/customerRating/' + id
		return axios.delete(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	getCustomerRating = id => {
		const url = process.env.VUE_APP_HOST_URL + '/customerRating/' + id
		return axios.get(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	getAllCustomerRatings = () => {
		const url = process.env.VUE_APP_HOST_URL + '/customerRating'
		return axios.get(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}
}

const customerRatingService = new CustomerRatingService()
export default customerRatingService