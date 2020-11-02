import axios from 'axios'

class UploaderService {

	uploadPhoto = (fd) => {
        const cloudName = 'dhs0egcjt'
		const url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`
		return axios.post(url, fd)
	}
}

const uploaderService = new UploaderService()
export default uploaderService