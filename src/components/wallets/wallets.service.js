import axios from 'axios'
import AuthService from '../../infra/auth.service'

class WalletsService {
	token = AuthService.getToken()

	addWallet = wallet => {
		const url = process.env.VUE_APP_HOST_URL + '/wallet'
		return axios.post(url, wallet, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	editWallet = (id, wallet) => {
		const url = process.env.VUE_APP_HOST_URL + '/wallet/' + id
		return axios.put(url, wallet, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	deleteWallet = id => {
		const url = process.env.VUE_APP_HOST_URL + '/wallet/' + id
		return axios.delete(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	getWallet= id => {
		const url = process.env.VUE_APP_HOST_URL + '/wallet/' + id
		return axios.get(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	getAllWallets = () => {
		const url = process.env.VUE_APP_HOST_URL + '/wallet'
		return axios.get(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}
}

const walletsService = new WalletsService()
export default walletsService