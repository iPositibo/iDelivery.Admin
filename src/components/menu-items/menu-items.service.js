import axios from 'axios'
import AuthService from '../../infra/auth.service'

class MenuItemService {
	token = AuthService.getToken()
	
	addMenuItem = menu => {
		const url = process.env.VUE_APP_HOST_URL + '/menuItem'
		return axios.post(url, menu, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	editMenuItem = (id, menu) => {
		const url = process.env.VUE_APP_HOST_URL + '/menuItem/' + id
		return axios.put(url, menu, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	deleteMenuItem = id => {
		const url = process.env.VUE_APP_HOST_URL + '/menuItem/' + id
		return axios.delete(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	getMenuItem = id => {
		const url = process.env.VUE_APP_HOST_URL + '/menuItem/' + id
		return axios.get(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	getMenuItemsByRoleId = roleId => {
		const url = process.env.VUE_APP_HOST_URL + '/menuItem/GetMenuItemsByRole/' + roleId
		return axios.get(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}

	getAllMenuItems = () => {
		const url = process.env.VUE_APP_HOST_URL + '/menuItem'
		return axios.get(url, { headers: { Authorization: `Bearer ${this.token}` } })
	}
}

const menuItemService = new MenuItemService()
export default menuItemService