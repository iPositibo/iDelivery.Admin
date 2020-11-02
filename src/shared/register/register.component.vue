<template>
    <div id="app">
        <v-app id="inspire">
            <v-main>
                <div class="text-center">
                    <v-dialog v-model="successDialog" width="400" transition="slide-y-reverse-transition">
                        <v-card>
                            <v-card-title class="headline green">
                                <strong> Success! </strong>
                                <v-icon> mdi-check-bold </v-icon>
                            </v-card-title>

                            <v-card-text v-text="successMessage" class="black--text">
                            </v-card-text>

                            <v-divider></v-divider>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <router-link :to="'/'" id="vtoolbartitle"><h4 style="text-align:start" class="home">Return to Homepage</h4></router-link>
                                <v-btn color="primary" text @click="successDialog = false">
                                    CLOSE
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </div>
                <div class="text-center">
                    <v-dialog v-model="errorDialog" width="500" transition="slide-y-reverse-transition">
                        <v-card>
                            <v-card-title class="headline red lighten-2">
                                <strong> Whoops, that's an error!</strong>
                                <v-spacer></v-spacer>
                                <v-icon> mdi-alert-box </v-icon>
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
                <form @submit="HandleSubmit($event)">
                    <v-container class="fill-height" id="back" fluid>
                        <v-row justify="end" align="start" class="pa-3">
                            <v-col cols="12" sm="8" md="4">
                                <v-card class="elevation-12">
                                    <v-toolbar color="yellow darken-1" dark flat>
                                        <v-toolbar-title class="black--text"><strong>Registration</strong></v-toolbar-title>
                                        <v-spacer></v-spacer>
                                    </v-toolbar>
                                    <v-card-text>
                                        <v-row>
                                        <v-col cols="12" sm="6" md="20">
                                            <v-select item-text="roleName" item-value="roleId" :items="roles"
                                                v-model="model.roleId" label="Role" :rules="[v => !!v || 'Role is required']" color="yellow darken-1" required>
                                            </v-select>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="20">
                                            <v-text-field label="Username" name="username" prepend-icon="mdi-account"
                                                type="text" v-model="model.username" color="yellow darken-1"
                                                :rules="userNameRules" :counter="40" required>
                                            </v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="20">
                                            <!-- <v-text-field id="password" label="Password" name="password"
                                                prepend-icon="mdi-lock" v-model="model.password" required>
                                            </v-text-field> -->
                                            <v-text-field id="password" label="Password" name="password"
                                             prepend-icon="mdi-lock" v-model="model.password" :rules="passwordRules"
                                             :type="password1 ? 'text' : 'password'"
                                             :append-icon="password1 ? 'mdi-eye' : 'mdi-eye-off'"
                                             @click:append="password1 = !password1" class="input-group--focused"
                                             color="yellow darken-1" required>
                                         </v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="20">
                                            <!-- <v-text-field id="confirmpassword" label="Confirm Password" name="password"
                                                prepend-icon="mdi-lock" required>
                                            </v-text-field> -->
                                            <v-text-field id="confirmpassword" label="Confirm Password" name="password"
                                             prepend-icon="mdi-lock" v-model="match"
                                             :type="password2 ? 'text' : 'password'"
                                             :append-icon="password2 ? 'mdi-eye' : 'mdi-eye-off'"
                                             @click:append="password2 = !password2" class="input-group--focused"
                                             color="yellow darken-1" hint="Password must match" :rules="rules" required>
                                         </v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="20">
                                            <v-text-field id="firstname" label="First Name" name="firstname" type="text"
                                                color="yellow darken-1" v-model="model.firstName"
                                                :rules="firstNameRules" :counter="40"
                                                onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123)"
                                                 required>
                                            </v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="20">
                                            <v-text-field id="lastname" label="Last Name" name="lastname" type="text"
                                                color="yellow darken-1" v-model="model.lastName"
                                                :rules="lastNameRules" :counter="40"
                                                onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123)"
                                                >
                                            </v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="20">
                                            <v-text-field id="email" label="Email" name="email" type="text"
                                                color="yellow darken-1" v-model="model.email"
                                                :rules="emailRules" :counter="50"
                                                required>
                                            </v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="20">
                                            <v-text-field id="contactnumber" label="Contact Number" name="contactnumber"
                                                color="yellow darken-1" type="text" v-model="model.contactNumber" :rules="contactNumberRules"
                                                oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                                                maxlength="11"
                                                >
                                            </v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="20">
                                            <v-textarea rows="1" auto-grow dense single-line id="address" label="Address" name="address" type="text"
                                                color="yellow darken-1" v-model="model.address"
                                                :rules="addressRules"
                                                required>
                                            </v-textarea>
                                        </v-col>
                                        </v-row>
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-spacer></v-spacer>
                                        <v-btn color="yellow darken-1" type="submit" class="black--text">Register
                                        </v-btn>
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
            </v-main>
        </v-app>
    </div>
</template>

<script>
    import AuthService from '../../infra/auth.service'
    import RoleService from '../../components/roles/roles.service'
    // import router from "../../infra/router"

    export default {
        name: "RegisterComponent",
        data() {
            return {
                model: {
                    username: '',
                    password: '',
                    firstName: '',
                    lastName: '',
                    email: '',
                    address: '',
                    contactNumber: '',
                    roleId: '',
                    photoUrl: '',
                    isCustomer: null,
                    accountId: ''
                },
                roles: [],
                alertInfo: [],
                interval: {},
                value: 0,
                loading: false,
                successDialog: false,
                errorDialog: false,
                successMessage: "",
                password1: false,
                 password2: false,
                 max: "",
                 match: "",
                 required: "",
                 userNameRules: [
                    v => !!v || 'User Name is required',
                    v => (v && v.length <= 40) || 'User Name must be less than 40 characters',

                    v => (v || '').indexOf(' ') < 0 ||
                    'No spaces are allowed'
                ],
                firstNameRules: [
                    v => !!v || 'First Name is required',
                    v => (v && v.length <= 40) || 'First Name must be less than 40 characters',
                ],
                lastNameRules: [
                    v => !!v || 'Last Name is required',
                    v => (v && v.length <= 40) || 'Last Name must be less than 40 characters',
                ],
                addressRules: [
                    v => !!v || 'Address is required',
                    v => (v && v.length <= 200) || 'Address must be less than 200 characters',
                ],
                contactNumberRules: [
                    v => !!v || 'Contact Number is required',
                    v => (v && v.length >= 11 && v.length <= 11) || 'Contact Number must be 11 characters',

                    v => (v || '').indexOf(' ') < 0 ||
                    'No spaces are allowed'
                ],
                emailRules: [
                    v => !!v || 'E-mail is required',
                    v => /.+@.+\..+/.test(v) || 'E-mail must be valid',

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
            }
        },
        computed: {
             rules() {
                 const rules = []
                 if (this.max) {
                     const rule =
                         v => (v || '').length <= this.max ||
                         'A maximum of ${this.max} characters is allowed'

                     rules.push(rule)
                 }
                 if (this.model.password) {
                     const rule =
                         v => (!!v && v) === this.model.password ||
                         'Password do not match'

                     rules.push(rule)
                 }
                 if (!this.allowSpaces) {
                     const rule =
                         v => (v || '').indexOf(' ') < 0 ||
                         'No spaces are allowed'

                     rules.push(rule)
                 }
                 return rules
             },
        },
        created() {
            this.initialize()
        },
        methods: {
            HandleSubmit(e) {
                var self = this
                e.preventDefault()

                AuthService.register(self.model)
                    .then(() => {
                        self.loading = false
                        self.successMessage = "User has been successfully registered."
                        self.successDialog = true
                        self.errorDialog = false
                    })
                    .catch(function (error) {
                        self.loading = false
                        self.alertInfo = {
                            success: false,
                            error
                        }

                        self.successDialog = false
                        self.errorDialog = true
                    })
            },
            initialize() {
                var self = this
                RoleService.getAllRoles()
                    .then(response => {
                        self.roles = response.data
                        self.errorDialog = false
                        self.loading = false
                    })
                    .catch(function (error) {
                        self.alertInfo = {
                            success: false,
                            error
                        }
                        self.loading = false
                        self.errorDialog = true
                    })
            }
        }
    }
</script>

<style scoped>
#inspire {
    background-image: url(../../assets/testbg2.jpg);
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    padding-left: 0px;
    padding-right: 0px;
    padding-top: 0px;
    padding-bottom: 0px;
  }
  .home {
      /* text-align:justify; */
      justify-self: start;
      padding-right:160px
  }

</style>