import axios from 'axios'
import AuthService from '../../infra/auth.service'

class BookingHistoryRiderService {
	token = AuthService.getToken()

	addBookingHistoryRider = history => {
		const url = process.env.VUE_APP_HOST_URL + '/riderBookingHistory'
		return axios.post(url, history, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	editBookingHistoryRider = (id, history) => {
		const url = process.env.VUE_APP_HOST_URL + '/riderBookingHistory/' + id
		return axios.put(url, history, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	deleteBookingHistoryRider = id => {
		const url = process.env.VUE_APP_HOST_URL + '/riderBookingHistory/' + id
		return axios.delete(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	getBookingHistoryRider = id => {
		const url = process.env.VUE_APP_HOST_URL + '/riderBookingHistory/' + id
		return axios.get(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	getAllBookingHistoryRiders = () => {
		const url = process.env.VUE_APP_HOST_URL + '/riderBookingHistory'
		return axios.get(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}
}

const bookingHistoryRiderService = new BookingHistoryRiderService()
export default bookingHistoryRiderService