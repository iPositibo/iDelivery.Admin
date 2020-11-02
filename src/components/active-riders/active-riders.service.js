import axios from 'axios'
import AuthService from '../../infra/auth.service'

class ActiveRiderService {
	token = AuthService.getToken()

	getAllActiveRiders = () => {
		const url = process.env.VUE_APP_HOST_URL + '/rider/GetAllActiveRiders'
		return axios.get(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}
}

const activeRiderService = new ActiveRiderService()
export default activeRiderService