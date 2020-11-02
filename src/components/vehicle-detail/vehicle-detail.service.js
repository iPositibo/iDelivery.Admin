import axios from 'axios'
import AuthService from '../../infra/auth.service'

class VehicleDetailService {
	token = AuthService.getToken()

	addVehicleDetail = vehicleDetail => {
		const url = process.env.VUE_APP_HOST_URL + '/vehicleDetail'
		return axios.post(url, vehicleDetail, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	editVehicleDetail = (id, vehicleDetail) => {
		const url = process.env.VUE_APP_HOST_URL + '/vehicleDetail/' + id
		return axios.put(url, vehicleDetail, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	deleteVehicleDetail = id => {
		const url = process.env.VUE_APP_HOST_URL + '/vehicleDetail/' + id
		return axios.delete(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	getVehicleDetail = id => {
		const url = process.env.VUE_APP_HOST_URL + '/vehicleDetail/' + id
		return axios.get(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	getAllVehicleDetails = () => {
		const url = process.env.VUE_APP_HOST_URL + '/vehicleDetail'
		return axios.get(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}
}

const vehicleDetailService = new VehicleDetailService()
export default vehicleDetailService