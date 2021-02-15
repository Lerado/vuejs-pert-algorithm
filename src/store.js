import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    cardinal: 0,
    data: [],
  },
  mutations: {
    setCardinal(state, cardinal) {
      state.cardinal = cardinal;
    },
    setData(state, data){
      state.data = data;
    }
  },
  getters: {
    cardinal(state) {
      return state.cardinal;
    },
    data(state) {
      return state.data;
    }
  },
  modules: {
  }
})
