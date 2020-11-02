import axios from 'axios'
import AuthService from '../../infra/auth.service'

class WalletStatusService {
	token = AuthService.getToken()

	addWalletStatus = walletstatus => {
		const url = process.env.VUE_APP_HOST_URL + '/walletStatus'
		return axios.post(url, walletstatus, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	editWalletStatus = (id, walletstatus) => {
		const url = process.env.VUE_APP_HOST_URL + '/walletStatus/' + id
		return axios.put(url, walletstatus, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	deleteWalletStatus = id => {
		const url = process.env.VUE_APP_HOST_URL + '/walletStatus/' + id
		return axios.delete(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	getWalletStatus = id => {
		const url = process.env.VUE_APP_HOST_URL + '/walletStatus/' + id
		return axios.get(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	getAllWalletStatuses = () => {
		const url = process.env.VUE_APP_HOST_URL + '/walletStatus'
		return axios.get(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}
}

const walletStatusService = new WalletStatusService()
export default walletStatusService