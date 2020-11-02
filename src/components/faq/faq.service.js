import axios from 'axios'
import AuthService from '../../infra/auth.service'

class FAQService {
	token = AuthService.getToken()

	addFAQ = faq => {
		const url = process.env.VUE_APP_HOST_URL + '/faq'
		return axios.post(url, faq, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	editFAQ = (id, faq) => {
		const url = process.env.VUE_APP_HOST_URL + '/faq/' + id
		return axios.put(url, faq, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	deleteFAQ = id => {
		const url = process.env.VUE_APP_HOST_URL + '/faq/' + id
		return axios.delete(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	getFAQ = id => {
		const url = process.env.VUE_APP_HOST_URL + '/faq/' + id
		return axios.get(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	getAllFAQs = () => {
		const url = process.env.VUE_APP_HOST_URL + '/faq'
		return axios.get(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}
}

const faqService = new FAQService()
export default faqService