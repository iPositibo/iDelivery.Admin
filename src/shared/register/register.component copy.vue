<template>
    <div id="app">

        <v-app id="inspire">
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
                            <v-btn color="primary" text @click="successDialog = false">
                                CLOSE
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </div>
            <v-main>
                <form @submit="HandleSubmit($event)">
                    <v-container class="fill-height" fluid>
                        <v-card-text>
                            <v-form ref="form" v-model="isValid" :lazy-validation="lazy">
                                <v-row>
                                    <v-col cols="12" sm="6" md="20">
                                        <v-select item-text="roleName" item-value="roleId" :items="roles"
                                            v-model="model.roleId" prepend-icon="mdi-account-supervisor-circle"
                                            :rules="[v => !!v || 'Role is required']" label="Role" required>
                                        </v-select>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="20">
                                        <v-text-field label="Username" name="username" prepend-icon="mdi-account"
                                            type="text" :rules="userNameRules" :counter="40" v-model="model.username"
                                            required>
                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="20">
                                        <v-text-field id="password" label="Password" name="password"
                                            prepend-icon="mdi-lock" v-model="model.password" :rules="passwordRules"
                                            :type="password1 ? 'text' : 'password'"
                                            :append-icon="password1 ? 'mdi-eye' : 'mdi-eye-off'"
                                            @click:append="password1 = !password1" class="input-group--focused"
                                            required>
                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="20">
                                        <v-text-field id="confirmpassword" label="Confirm Password" name="password"
                                            prepend-icon="mdi-lock" v-model="match"
                                            :type="password2 ? 'text' : 'password'"
                                            :append-icon="password2 ? 'mdi-eye' : 'mdi-eye-off'"
                                            @click:append="password2 = !password2" class="input-group--focused"
                                            hint="Password must match" :rules="rules" required>
                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="20">
                                        <v-text-field prepend-icon="mdi-account-edit" id="firstname" label="First Name"
                                            name="firstname" type="text" v-model="model.firstName"
                                            :rules="firstNameRules" :counter="40"
                                            onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123)"
                                            required></v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="20">
                                        <v-text-field prepend-icon="mdi-account-edit" id="lastname" label="Last Name"
                                            name="lastname" type="text" v-model="model.lastName" :rules="lastNameRules"
                                            :counter="40"
                                            onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123)"
                                            required>
                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="20">
                                        <v-text-field id="email" prepend-icon="mdi-email" label="Email" name="email"
                                            type="text" v-model="model.email" :rules="emailRules" :counter="50"
                                            required>
                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="20">
                                        <v-textarea auto-grow single-line prepend-icon="mdi-map-marker" id="address"
                                            label="Address" name="address" type="text" v-model="model.address" rows="1"
                                            :rules="addressRules" required>
                                        </v-textarea>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="20">
                                        <v-text-field prepend-icon="mdi-card-account-phone" id="contactnumber"
                                            label="Contact Number" name="contactnumber" type="number"
                                            v-model="model.contactNumber" :rules="contactNumberRules"
                                            oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                                            maxlength="11">
                                        </v-text-field>
                                    </v-col>
                                    <v-col cols="12" sm="6" md="20">
                                    </v-col>
                                    <v-col cols="12" sm="6" md="20">
                                    </v-col>
                                    <v-col cols="12" sm="13" md="20">
                                        <v-card-actions>
                                            <v-spacer></v-spacer>
                                            <v-btn color="yellow darken-1" type="submit"
                                                class="d-flex align-end flex-column" :disabled="!isValid">Register
                                            </v-btn>
                                        </v-card-actions>
                                    </v-col>
                                </v-row>
                            </v-form>
                        </v-card-text>
                    </v-container>
                </form>
            </v-main>
            <v-dialog v-model="loading" fullscreen>
                <v-container fluid fill-height style="background-color: rgba(255, 255, 255, 0.5);">
                    <v-layout justify-center align-center>
                        <v-progress-circular indeterminate color="primary">
                        </v-progress-circular>
                    </v-layout>
                </v-container>
            </v-dialog>
        </v-app>
    </div>
</template>

<script>
    import AuthService from '../../infra/auth.service'
    import RoleService from '../../components/roles/roles.service'

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
                    isCustomer: null
                },
                alertInfo: [],
                autoGrow: true,
                successDialog: false,
                errorDialog: false,
                successMessage: "",
                interval: {},
                value: 0,
                loading: false,
                roles: [],
                lazy: false,
                isValid: true,
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
                        `A maximum of ${this.max} characters is allowed`

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
        watch: {
            password: 'validateField',
            max: 'validateField',
            match: 'validateField',
        },
        methods: {
            validateField() {
                this.$refs.form.validate()
            },
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

<style>

</style>