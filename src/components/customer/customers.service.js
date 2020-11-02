import axios from 'axios'
import AuthService from '../../infra/auth.service'

class CustomerService {
	token = AuthService.getToken()

	addCustomer = customer => {
		const url = process.env.VUE_APP_HOST_URL + '/customer'
		return axios.post(url, customer, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	editCustomer = (id, customer) => {
		const url = process.env.VUE_APP_HOST_URL + '/customer/' + id
		return axios.put(url, customer, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	deleteCustomer = id => {
		const url = process.env.VUE_APP_HOST_URL + '/customer/' + id
		return axios.delete(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	getCustomer = id => {
		const url = process.env.VUE_APP_HOST_URL + '/customer/' + id
		return axios.get(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	getAllCustomers = () => {
		const url = process.env.VUE_APP_HOST_URL + '/customer'
		return axios.get(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	getAllActiveCustomers = () => {
		const url = process.env.VUE_APP_HOST_URL + '/customer/getAllActiveCustomers'
		return axios.get(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	getAllAvailableCustomerUsers = () => {
		const url = process.env.VUE_APP_HOST_URL + '/customer/getAllAvailableCustomerUsers'
		return axios.get(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}
}

const customerService = new CustomerService()
export default customerService