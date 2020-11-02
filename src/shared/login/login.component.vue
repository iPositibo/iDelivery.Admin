<template>
  <div id="app" class="black">
    <v-app id="inspire">
      <div class="text-center">
            <v-dialog v-model="errorDialog" width="500" transition="slide-y-reverse-transition">
                <v-card>
                    <v-card-title class="headline red lighten-2">
                        <strong> Whoops, that's an error!</strong> <v-spacer></v-spacer> <v-icon> mdi-alert-box </v-icon>
                    </v-card-title>

                    <v-card-text v-if="errorDialog" v-text="alertInfo.error.response.data">
                    </v-card-text>

                    <v-divider></v-divider>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" text @click="errorDialog = false">
                            CLOSE
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </div>
      <v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" :clipped-right="$vuetify.breakpoint.lgAndUp" app
        color="yellow darken-1" light elevation="7">
        <v-toolbar-title style="width: 400px" class="ml-0 pl-4">
          <span class="hidden-sm-and-down">
            <router-link :to="'/'" id="vtoolbartitle">
              <v-img width="400px" height="56px" :src="logo"></v-img>
            </router-link>
          </span>
        </v-toolbar-title>
        <v-spacer> </v-spacer>
      </v-app-bar>

      <v-main>
        <form @submit="HandleSubmit($event)">
          <v-container class="fill-height" id="back" fluid>
            <v-row justify="end" class="pa-3">
              <v-col cols="12" sm="8" md="4">
                <v-card class="elevation-12">
                  <v-toolbar color="yellow darken-1" dark flat>
                    <v-toolbar-title class="black--text"><strong>Login</strong></v-toolbar-title>
                    <v-spacer></v-spacer>
                  </v-toolbar>
                  <v-card-text>
                    <v-form ref="form" v-model="isValid" :lazy-validation="lazy">
                      <v-text-field label="Email" name="email" prepend-icon="mdi-account" v-model="model.username"
                        type="text" required></v-text-field>
                      <v-text-field id="password" label="Password" name="password" v-model="model.password"
                        prepend-icon="mdi-lock" :rules="passwordRules" :type="show1 ? 'text' : 'password'"
                        :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'" @click:append="show1 = !show1"
                        class="input-group--focused" required></v-text-field>
                    </v-form>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="yellow darken-1" type="submit" :disabled="!isValid" class="black--text">Login</v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-container>
        </form>
        <v-dialog v-model="loading" fullscreen>
          <v-container fluid fill-height style="background-color: rgba(255, 255, 255, 0.5);">
            <v-layout justify-center align-center>
              <v-progress-circular indeterminate color="primary">
              </v-progress-circular>
            </v-layout>
          </v-container>
        </v-dialog>
        <v-footer class="yellow darken-1" padless fixed>
          <v-card class="flex yellow darken-1" flat tile>
            <v-card-text class="py-2 black--text text-center">
              © {{ new Date().getFullYear() }} <strong>iDelivery. All Rights Reserved</strong>
            </v-card-text>
          </v-card>
        </v-footer>
      </v-main>
    </v-app>
  </div>
</template>

<script>
  import AuthService from '../../infra/auth.service'

  export default {
    path: '/login',
    name: "LoginComponent",
    data() {
      return {
        logo: require("../../assets/loginlogo.png"),
        errorText: null,
        isValid: true,
        show1: false,
        password: "",
        alertInfo: [],
        errorDialog: false,
        model: {
          username: null,
          password: null
        },
        lazy: false,
          emailRules: [
                    v => !!v || 'E-mail is required',
                    v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
                    v => (v && v.length <= 40) || 'Email must be less than 40 characters',

                    v => (v || '').indexOf(' ') < 0 ||
                    'No spaces are allowed'
        ],
        passwordRules: [
          v => !!v || 'Password is required',
          v => (v && v.length >= 4 && v.length <= 20) ||
          'Password must be more than 4 characters and less than 20 characters',

          v => (v || '').indexOf(' ') < 0 ||
                    'No spaces are allowed'
        ],
        interval: {},
        value: 0,
        loading: false
      }
    },
    beforeDestroy() {
      clearInterval(this.interval)
    },
    mounted() {
      this.interval = setInterval(() => {
        if (this.value === 100) {
          return (this.value = 0)
        }
        this.value += 10
      }, 1000)
    },
    methods: {
      HandleSubmit(e) {
        var self = this

        e.preventDefault()
        self.loading = true;
        if (self.model.username === null || self.model.password === null) return

        AuthService.login(this.model)
          .then(response => {
            AuthService.setUserIdentity(response.data)
            console.log(response)
            self.$emit('EventLoggedIn')
            self.loading = false
            self.errorDialog = false
          })
          .catch(function (error) {
            self.alertInfo = {
              success: false,
              error
            }
            self.loading = false
            self.successDialog = false
            self.errorDialog = true
          })
      }
    }
  };
</script>

<style scoped>
  .v-progress-circular {
    margin: 1rem;
  }

  .v-toolbar__extension {
    padding: 0px !important;
  }

  #inspire {
    background-image: url(../../assets/delivery.jpg);
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    padding-left: 0px;
    padding-right: 0px;
    padding-top: 0px;
    padding-bottom: 0px;
  }

  #app {
    color: black;
    padding-left: 0px;
    padding-right: 0px;
    padding-top: 0px;
    padding-bottom: 0px;
  }

  .container {
    padding: 0px;
    margin-right: 0px;
    margin-left: 0px;
  }
</style>