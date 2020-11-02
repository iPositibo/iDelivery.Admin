<template style="background-color: rgb(140, 140, 134)">
  <div id="app">
    <NavBar v-bind="{ isAuthenticated }" @LogoutUser="LogoutUserHandler"></NavBar>
  </div>
</template>

<script>
  import NavBar from './shared/navigation/navbar'
  import router from "./infra/router"
  import AuthService from "./infra/auth.service"

  export default {
    name: 'app',
    data() {
    return {
      isAuthenticated: {
        status: false
      }
    };
  },
  created() {
    this.isAuthenticated.status = AuthService.isAuthenticated()
  },
  methods: {
    EventLoggedInHandler() {
      this.isAuthenticated.status = true
      router.push({ path: "/" })
    },
    LogoutUserHandler() {
      this.isAuthenticated.status = false
      AuthService.logout()
      router.push({ path: "/login" })
    }
  },
  components: {
    NavBar
  }
}
</script>

<style scoped>


</style>