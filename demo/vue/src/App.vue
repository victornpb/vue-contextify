<template>
  <v-app id="app">
    <div id="nav">
      <router-link v-for="r in routes" :to="r.path" :key="r.path">{{r.name}}</router-link>
    </div>
    <router-view/>
  </v-app>
</template>
<script>
  import routes from './router/routes';

  export default {
    name: 'app',
    data() {
      return {
        routes,
      }
    },
    methods: {
      //
    },
  };

</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#nav {
  padding: 30px;

  a {
    margin: 1em;
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

.focus{
  outline: 5px solid var(--v-accent-base) !important;
}
</style>
