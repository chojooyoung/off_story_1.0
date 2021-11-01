import { createStore } from 'vuex'
import address from './address'
import Login from './Login'

export default createStore({
  modules: {
    address,
    Login,
  },
})
