import axios from 'axios'
import AuthService from '../../infra/auth.service'

class AppRatingService {
	token = AuthService.getToken()

	addAppRating = appRating => {
		const url = process.env.VUE_APP_HOST_URL + '/appRating'
		return axios.post(url, appRating, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	editAppRating = (id, appRating) => {
		const url = process.env.VUE_APP_HOST_URL + '/appRating/' + id
		return axios.put(url, appRating, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	deleteAppRating = id => {
		const url = process.env.VUE_APP_HOST_URL + '/appRating/' + id
		return axios.delete(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	getAppRating = id => {
		const url = process.env.VUE_APP_HOST_URL + '/appRating/' + id
		return axios.get(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	getAllAppRatings = () => {
		const url = process.env.VUE_APP_HOST_URL + '/appRating'
		return axios.get(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}
}

const appRatingService = new AppRatingService()
export default appRatingService