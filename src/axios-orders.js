import axios from 'axios';

const instance = axios.create({
   baseURL: "https://react-my-burger-c12d5.firebaseio.com/"

})

export default instance 