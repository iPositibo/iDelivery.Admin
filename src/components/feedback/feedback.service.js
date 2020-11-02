import axios from 'axios'
import AuthService from '../../infra/auth.service'

class FeedbackService {
	token = AuthService.getToken()

	addFeedback = feedback => {
		const url = process.env.VUE_APP_HOST_URL + '/feedback'
		return axios.post(url, feedback, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	editFeedback = (id, feedback) => {
		const url = process.env.VUE_APP_HOST_URL + '/feedback/' + id
		return axios.put(url, feedback, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	deleteFeedback = id => {
		const url = process.env.VUE_APP_HOST_URL + '/feedback/' + id
		return axios.delete(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	getFeedback= id => {
		const url = process.env.VUE_APP_HOST_URL + '/feedback/' + id
		return axios.get(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	getAllFeedbacks= () => {
		const url = process.env.VUE_APP_HOST_URL + '/feedback'
		return axios.get(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}
}

const feedbackService = new FeedbackService()
export default feedbackService