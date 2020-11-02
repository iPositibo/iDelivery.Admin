import axios from 'axios'
import AuthService from '../../infra/auth.service'

class WalletLogService {
	token = AuthService.getToken()

	addWalletLog = walletlog => {
		const url = process.env.VUE_APP_HOST_URL + '/walletLog'
		return axios.post(url, walletlog, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	editWalletLog = (id, walletlog) => {
		const url = process.env.VUE_APP_HOST_URL + '/walletLog/' + id
		return axios.put(url, walletlog, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	deleteWalletLog = id => {
		const url = process.env.VUE_APP_HOST_URL + '/walletLog/' + id
		return axios.delete(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	getWalletLog = id => {
		const url = process.env.VUE_APP_HOST_URL + '/walletLog/' + id
		return axios.get(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	getAllWalletLogs = () => {
		const url = process.env.VUE_APP_HOST_URL + '/walletLog'
		return axios.get(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}
}

const walletLogService = new WalletLogService()
export default walletLogService