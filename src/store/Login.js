import { getAuthFromCookie, getUserFromCookie } from '../utils/cookies'
import storage from '../utils/sessionStorage'
export default {
  namespaced: true,
  state() {
    return {
      userId: '',
      userCoverImage: null,
      userIntroduction: '',
      userFullName: '',
      userEmail: '',
      username: storage.getItem('off_userName') || '',
      token: JSON.parse(storage.getItem('off_auth')) || '',
      profileImage: '',
      isLoading: false,
      authCheck: false,
    }
  },
  getters: {
    userId(state) {
      return state.userId
    },
    isLogin(state) {
      return state.username !== ''
    },
    isAuthCheck(state) {
      return state.authCheck
    },
    isEmptyProfileImage(state) {
      console.log('emptycheck', state.profileImage === undefined)
      return state.profileImage === undefined
    },
    isLoading(state) {
      return state.isLoading
    },
    getUsername(state) {
      return state.username
    },
    getUserId(state) {
      return state.userId
    },
    getUserProfileImage(state) {
      return state.profileImage
    },
    getToken(state) {
      return state.token
    },
  },
  mutations: {
    setUsername(state, username) {
      state.username = username
    },
    setUserId(state, userId) {
      state.userId = userId
    },
    setprofileImage(state, profileImage) {
      state.profileImage = profileImage
    },
    clearUsername(state) {
      state.username = ''
    },
    clearToken(state) {
      state.token = ''
    },
    setToken(state, token) {
      state.token = token
    },
    setAuthCheck(state, Auth) {
      state.authCheck = Auth
    },
    setisLoading(state, bool) {
      state.isLoading = bool
    },
  },
  actions: {},
}
