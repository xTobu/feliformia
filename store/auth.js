export const state = () => ({
  user: null,
  session: null,
  nickname: null,
  profileLoaded: false  // 新增
})

export const mutations = {
  SET_USER(state, user) {
    state.user = user
  },
  SET_SESSION(state, session) {
    state.session = session
  },
  SET_NICKNAME(state, nickname) {
    state.nickname = nickname
  },
  SET_PROFILE_LOADED(state, loaded) {  // 新增
    state.profileLoaded = loaded
  },
  CLEAR_AUTH(state) {
    state.user = null
    state.session = null
    state.nickname = null
    state.profileLoaded = false
  }
}

export const actions = {
  setAuth({ commit }, { user, session }) {
    commit('SET_USER', user)
    commit('SET_SESSION', session)
  },
  setNickname({ commit }, nickname) {
    commit('SET_NICKNAME', nickname)
    commit('SET_PROFILE_LOADED', true)  // 載入完成
  },
  clearAuth({ commit }) {
    commit('CLEAR_AUTH')
  }
}

export const getters = {
  isAuthenticated: (state) => !!state.session,
  currentUser: (state) => state.user,
  userEmail: (state) => state.user?.email || null,
  userNickname: (state) => state.nickname,
  profileLoaded: (state) => state.profileLoaded,
  // 載入中顯示 "..."，載入完顯示 nickname 或 email
  displayName: (state) => {
    if (!state.profileLoaded) return ''
    return `Hi, ${state.nickname || state.user?.email || '使用者'}`
  }
}
