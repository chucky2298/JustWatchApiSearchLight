<template>
  <div class="home">
    <img
      alt="Vue logo"
      src="https://cdn-icons-png.flaticon.com/512/1766/1766080.png"
      width="120"
      style="margin-top: 50px"
    />
    <h1>Welcome to JustWatch Search Light</h1>
  </div>
  <input
    type="string"
    placeholder="search"
    v-model="search"
    @input="handleInputChange"
  />
  <p v-if="error">Something went wrong...</p>
  <p v-if="loading">Loading...</p>
  <p v-else v-for="movie in result.popularTitles.edges" :key="movie.id">
    {{ movie.node.content.title }} ({{
      movie.node.content.originalReleaseYear
    }})
  </p>
</template>

<script lang="ts">
import gql from "graphql-tag";
import { provideApolloClient, useQuery } from "@vue/apollo-composable";
import { ApolloClient, InMemoryCache } from "@apollo/client/core";
import { debounce } from "./utils";
import { reactive } from "vue";

const cache = new InMemoryCache();

const apolloClient = new ApolloClient({
  cache,
  uri: "https://apis.justwatch.com/graphql",
});

provideApolloClient(apolloClient);

const variable = reactive({
  country: "US",
  language: "en",
  first: 4,
  filter: {
    searchQuery: "nnnnnnnnnnnnn",
  },
});

const CHARACTERS_QUERY = useQuery(
  gql`
    query GetSuggestedTitles(
      $country: Country!
      $language: Language!
      $first: Int!
      $filter: TitleFilter
    ) {
      popularTitles(country: $country, first: $first, filter: $filter) {
        edges {
          node {
            id
            objectType
            objectId
            content(country: $country, language: $language) {
              title
              originalReleaseYear
              __typename
            }
            __typename
          }
          __typename
        }
        __typename
      }
    }
  `,
  variable
);

const initials = reactive({
  searching: false,
});

export default {
  name: "App",
  setup() {
    var search = "";
    var searching = initials.searching;
    var result = CHARACTERS_QUERY.result;
    var error = CHARACTERS_QUERY.error;
    var loading = CHARACTERS_QUERY.loading;
    const handleInputChange = debounce((evt: Event) => {
      const element = evt.target as HTMLInputElement;
      search = element.value;
      variable.filter.searchQuery = search;
      initials.searching = true;
      searching = true;
      result = CHARACTERS_QUERY.result;
      error = CHARACTERS_QUERY.error;
      loading = CHARACTERS_QUERY.loading;
    }, 500);
    return {
      handleInputChange,
      search,
      searching,
      result,
      error,
      loading,
    };
  },
};
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
