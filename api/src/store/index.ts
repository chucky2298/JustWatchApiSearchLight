import { createStore } from "vuex";

export default createStore({
  state: {
    searching: false,
    movies: [],
  },
  mutations: {
    SET_SEARCHING: (state) => {
      state.searching = true;
    },
    SET_MOVIES: (state, movies) => {
      state.movies = movies;
    },
  },
  getters: {},
  actions: {},
  modules: {},
});
