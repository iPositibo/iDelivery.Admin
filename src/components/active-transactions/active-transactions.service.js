import axios from 'axios'
import AuthService from '../../infra/auth.service'

class ActiveTransactionService {
	token = AuthService.getToken()

	getAllActiveTransactions = () => {
		const url = process.env.VUE_APP_HOST_URL + '/booking/GetAllActiveTransactions'
		return axios.get(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}
}

const activeTransactionService = new ActiveTransactionService()
export default activeTransactionService