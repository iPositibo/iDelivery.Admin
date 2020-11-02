import axios from 'axios'
import AuthService from '../../infra/auth.service'

class CustomerStatusService {
	token = AuthService.getToken()

	addCustomerStatus = status => {
		const url = process.env.VUE_APP_HOST_URL + '/customerStatus'
		return axios.post(url, status, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	editCustomerStatus = (id, status) => {
		const url = process.env.VUE_APP_HOST_URL + '/customerStatus/' + id
		return axios.put(url, status, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	deleteCustomerStatus = id => {
		const url = process.env.VUE_APP_HOST_URL + '/customerStatus/' + id
		return axios.delete(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	getCustomerStatus = id => {
		const url = process.env.VUE_APP_HOST_URL + '/customerStatus/' + id
		return axios.get(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	getAllCustomerStatus = () => {
		const url = process.env.VUE_APP_HOST_URL + '/customerStatus'
		return axios.get(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}
}

const customerStatusService = new CustomerStatusService()
export default customerStatusService