import axios from 'axios'
import AuthService from '../../infra/auth.service'

class BlockCustomerService {
	token = AuthService.getToken()

	addBlockCustomer = blockcustomer => {
		const url = process.env.VUE_APP_HOST_URL + '/blockedCustomer'
		return axios.post(url, blockcustomer, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	editBlockCustomer = (id, blockcustomer) => {
		const url = process.env.VUE_APP_HOST_URL + '/blockedCustomer/' + id
		return axios.put(url, blockcustomer, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	deleteBlockCustomer = id => {
		const url = process.env.VUE_APP_HOST_URL + '/blockedCustomer/' + id
		return axios.delete(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	getBlockCustomer = id => {
		const url = process.env.VUE_APP_HOST_URL + '/blockedCustomer/' + id
		return axios.get(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	getAllBlockCustomers = () => {
		const url = process.env.VUE_APP_HOST_URL + '/blockedCustomer'
		return axios.get(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}
}

const blockCustomerService = new BlockCustomerService()
export default blockCustomerService