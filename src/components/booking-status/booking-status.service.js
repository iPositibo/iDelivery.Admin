import axios from 'axios'
import AuthService from '../../infra/auth.service'

class BookingStatusService {
	token = AuthService.getToken()

	addBookingStatus = status => {
		const url = process.env.VUE_APP_HOST_URL + '/bookingStatus'
		return axios.post(url, status, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	editBookingStatus = (id, status) => {
		const url = process.env.VUE_APP_HOST_URL + '/bookingStatus/' + id
		return axios.put(url, status, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	deleteBookingStatus = id => {
		const url = process.env.VUE_APP_HOST_URL + '/bookingStatus/' + id
		return axios.delete(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	getBookingStatus = id => {
		const url = process.env.VUE_APP_HOST_URL + '/bookingStatus/' + id
		return axios.get(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	getAllBookingStatuses = () => {
		const url = process.env.VUE_APP_HOST_URL + '/bookingStatus'
		return axios.get(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}
}

const bookingStatusService = new BookingStatusService()
export default bookingStatusService