import axios from 'axios'
import AuthService from '../../infra/auth.service'

class BookingService {
	token = AuthService.getToken()

	addBooking = booking => {
		const url = process.env.VUE_APP_HOST_URL + '/booking'
		return axios.post(url, booking, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	editBooking = (id, booking) => {
		const url = process.env.VUE_APP_HOST_URL + '/booking/' + id
		return axios.put(url, booking, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	deleteBooking = id => {
		const url = process.env.VUE_APP_HOST_URL + '/booking/' + id
		return axios.delete(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	getBooking = id => {
		const url = process.env.VUE_APP_HOST_URL + '/booking/' + id
		return axios.get(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	getAllBookings = () => {
		const url = process.env.VUE_APP_HOST_URL + '/booking'
		return axios.get(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}
}

const bookingService = new BookingService()
export default bookingService