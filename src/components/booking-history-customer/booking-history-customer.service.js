import axios from 'axios'
import AuthService from '../../infra/auth.service'

class BookingHistoryCustomerService {
	token = AuthService.getToken()

	addBookingHistoryCustomer = customerhistory => {
		const url = process.env.VUE_APP_HOST_URL + '/customerBookingHistory'
		return axios.post(url, customerhistory, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	editBookingHistoryCustomer = (id, customerhistory) => {
		const url = process.env.VUE_APP_HOST_URL + '/customerBookingHistory/' + id
		return axios.put(url, customerhistory, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	deleteBookingHistoryCustomer = id => {
		const url = process.env.VUE_APP_HOST_URL + '/customerBookingHistory/' + id
		return axios.delete(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	getBookingHistoryCustomer = id => {
		const url = process.env.VUE_APP_HOST_URL + '/customerBookingHistory/' + id
		return axios.get(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	getAllBookingHistoryCustomers = () => {
		const url = process.env.VUE_APP_HOST_URL + '/customerBookingHistory'
		return axios.get(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}
}

const bookingHistoryCustomerService = new BookingHistoryCustomerService()
export default bookingHistoryCustomerService