import { getAuthFromCookie, getUserFromCookie } from '../utils/cookies'
export default {
  namespaced: true,
  state() {
    return {
      loadings: [],
    }
  },
  getters: {
    loading(state) {
      return state.loadings.some(loading => loading)
    },
  },
  mutations: {
    startLoading(state) {
      state.loadings.push(true)
    },
    endLoading(state) {
      state.loadings.splice(0, 1)
    },
  },
}
