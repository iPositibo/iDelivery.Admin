<template>
    <div>
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
        <v-data-table :headers="tableHeaders" :items="userListTable" sort-by="userId" class="elevation-1">
            <template v-slot:top>
                <v-toolbar flat color="white">
                    <v-toolbar-title>Users</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialog" max-width="500px">
                        <v-card>
                            <v-card-title>
                                <span class="headline">{{ formTitle }}</span>
                            </v-card-title>

                            <v-card-text>
                                <v-container>
                                    <v-form ref="form" v-model="isValid" :lazy-validation="lazy">
                                        <v-row>
                                            <v-col cols="12" sm="6" md="6">
                                                <v-text-field v-model="editedItem.username" label="Username"
                                                    :rules="usernameRules" required></v-text-field>
                                            </v-col>
                                            <!-- <v-col cols="12" sm="6" md="6">
                                                <v-text-field id="password" label="Password" name="password"
                                                    v-model="editedItem.password" :rules="passwordRules"
                                                    :type="password1 ? 'text' : 'password'"
                                                    :append-icon="password1 ? 'mdi-eye' : 'mdi-eye-off'"
                                                    @click:append="password1 = !password1" class="input-group--focused"
                                                    required>
                                                </v-text-field>
                                            </v-col> -->
                                            <v-col cols="12" sm="6" md="6">
                                                <v-select item-text="roleName" item-value="roleId" :items="roles"
                                                    v-model="editedItem.roleId"
                                                    :rules="[v => !!v || 'Role is required']" label="Role" required>
                                                </v-select>
                                            </v-col>
                                        </v-row>
                                    </v-form>
                                </v-container>
                            </v-card-text>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                                <v-btn color="blue darken-1" :disabled="!isValid" text @click="save">Save</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-toolbar>
            </template>
            <template v-slot:item.actions="{ item }">
                <v-icon small class="mr-2" @click="editItem(item)" color="black">
                    mdi-pencil
                </v-icon>
                <v-icon small @click="deleteItem(item)" color="black">
                    mdi-delete
                </v-icon>
            </template>
        </v-data-table>
        <v-dialog v-model="loading" fullscreen>
            <v-container fluid fill-height style="background-color: rgba(255, 255, 255, 0.5);">
                <v-layout justify-center align-center>
                    <v-progress-circular indeterminate color="primary">
                    </v-progress-circular>
                </v-layout>
            </v-container>
        </v-dialog>
    </div>
</template>

<script>
    import UsersService from './users.service'
    import RoleService from '../roles/roles.service'

    export default {
        data: () => ({
            roles: null,
            dialog: false,
            successDialog: false,
            errorDialog: false,
            successMessage: "",
            editedIndex: -1,
            isValid: true,
            editedItem: {
                userId: 0,
                username: '',
                // password: '',
                roleId: 0,
            },
            defaultItem: {
                userId: 0,
                username: '',
                // password: '',
                roleId: 0,
            },
            lazy: false,
            // password1: false,
            // password2: false,
            usernameRules: [
                v => !!v || 'Username is required',
                v => (v && v.length <= 40) || 'Username must be less than 40 characters',

                v => (v || '').indexOf(' ') < 0 ||
                'No spaces are allowed'
            ],
            // passwordRules: [
            //     v => !!v || 'Password is required',
            //     v => (v && v.length >= 4) || 'Password must be greater than 4 characters',

            //     v => (v || '').indexOf(' ') < 0 ||
            //     'No spaces are allowed'
            // ],
            interval: {},
            value: 0,
            loading: false
        }),
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
        props: {
            userListTable: null,
            tableHeaders: null
        },
        computed: {
            formTitle() {
                return this.editedIndex === -1 ? 'New User' : 'Edit User'
            },
        },
        watch: {
            dialog(val) {
                val || this.close()
            },
        },
        created() {
            this.initialize()
        },
        methods: {
            editItem(item) {
                this.editedIndex = this.userListTable.indexOf(item)
                this.editedItem = Object.assign({}, item)
                this.dialog = true
            },
            deleteItem(item) {
                const index = this.userListTable.indexOf(item)
                const isConfirmed = confirm('Are you sure you want to delete this item?')

                if (isConfirmed) {
                    const self = this
                    UsersService.deleteUser(item.userId)
                        .then(() => {
                            self.successDialog = true
                            self.errorDialog = false
                            self.successMessage = "Status has been deleted successfully."
                            self.userListTable.splice(index, 1)
                        })
                        .catch(function (error) {
                            self.alertInfo = {
                                success: false,
                                error
                            }
                            self.successDialog = false
                            self.errorDialog = true
                        })
                }
            },
            close() {
                this.dialog = false
                this.$nextTick(() => {
                    this.editedItem = Object.assign({}, this.defaultItem)
                    this.editedIndex = -1
                })
            },
            save() {
                let self = this
                self.loading = true
                self.editedItem.roleId = parseInt(self.editedItem.roleId)
                if (this.editedIndex > -1) {
                    UsersService.editUser(self.editedItem.userId, self.editedItem)
                        .then(() => {
                            self.loading = false
                            self.successDialog = true
                            self.errorDialog = false
                            self.successMessage = "Status has been updated successfully."
                        })
                        .catch(function (error) {
                            self.alertInfo = {
                                success: false,
                                error
                            }
                            self.loading = false
                            self.successDialog = false
                            self.errorDialog = true
                        });
                    Object.assign(self.userListTable[self.editedIndex], self.editedItem)

                } else {
                    UsersService.addUser(self.editedItem)
                        .then(() => {
                            self.isSuccessful = true
                            self.loading = false
                            self.errorText = null
                            self.successMessage = "Status has been saved successfully."

                            UsersService.getAllUsers()
                                .then(response => {
                                    self.userListTable = response.data
                                    self.loading = false

                                    self.successDialog = true
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
                        })
                        .catch(function (error) {
                            self.isSuccessful = false
                            self.loading = false
                            self.errorText = error.response.data.title

                            self.successDialog = false
                            self.errorDialog = true
                        })
                }
                this.close()
            },
            initialize() {
                var self = this
                RoleService.getAllRoles()
                    .then(response => {
                        self.roles = response.data
                        self.successDialog = false
                        self.errorDialog = false
                    })
                    .catch(function (error) {
                        self.alertInfo = {
                            success: false,
                            error
                        }

                        self.successDialog = false
                        self.errorDialog = true
                    })
            }
        },
    }
</script>