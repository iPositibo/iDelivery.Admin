import axios from 'axios'
import AuthService from '../../infra/auth.service'

class TermsAndConditionsService {
	token = AuthService.getToken()

	addTermsAndConditions = termsAndCondition => {
		const url = process.env.VUE_APP_HOST_URL + '/termsAndCondition'
		return axios.post(url, termsAndCondition, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	editTermsAndConditions = (id, termsAndCondition) => {
		const url = process.env.VUE_APP_HOST_URL + '/termsAndCondition/' + id
		return axios.put(url, termsAndCondition, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	deleteTermsAndConditions = id => {
		const url = process.env.VUE_APP_HOST_URL + '/termsAndCondition/' + id
		return axios.delete(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	getTermsAndCondition = id => {
		const url = process.env.VUE_APP_HOST_URL + '/termsAndCondition/' + id
		return axios.get(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	getAllTermsAndConditions = () => {
		const url = process.env.VUE_APP_HOST_URL + '/termsAndCondition'
		return axios.get(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}
}

const termsAndConditionsService = new TermsAndConditionsService()
export default termsAndConditionsService