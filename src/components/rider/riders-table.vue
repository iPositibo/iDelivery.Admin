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
        <v-data-table :headers="tableHeaders" :items="riderTable" sort-by="riderId" class="elevation-1"
            :search="search">
            <template v-slot:item.photoUrl="{ item }">
                <div class="p-2">
                    <v-img :src="item.photoUrl" :alt="item.name" width="50px" height="50px"></v-img>
                </div>
            </template>
            <template v-slot:top>
                <v-toolbar flat color="white">
                    <v-toolbar-title>Riders</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-text-field v-model="search" append-icon="mdi-magnify" placeholder="Search"
                        class="shrink yellow darken-1" clear-icon="mdi-close-circle-outline" clearable rounded
                        single-line hide-details>
                    </v-text-field>
                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialog" max-width="500px">
                        <!-- <template v-slot:activator="{ on, attrs }">
                            <v-btn color="yellow darken-1" light class="mb-2" v-bind="attrs" v-on="on" rounded>Add
                            </v-btn>
                        </template> -->
                        <v-card>
                            <v-card-title>
                                <span class="headline">{{ formTitle }}</span>
                            </v-card-title>

                            <v-card-text>
                                <v-container>
                                    <v-form ref="form" v-model="isValid" :lazy-validation="lazy">
                                        <v-row>
                                            <!-- <v-col cols="12" sm="6" md="6"> -->
                                                <!-- <v-select item-text="username" item-value="userId" :items="users"
                                                    v-model="editedItem.userId"
                                                    :rules="[v => !!v || 'User is required']" label="User" required>
                                                </v-select> -->
                                            <!-- </v-col> -->
                                            <v-col cols="12" sm="6" md="6">
                                                <v-textarea single-line auto-grow rows="1" v-model="editedItem.firstName" type="text"
                                                    label="First name" :rules="firstNameRules" :counter="40"
                                                    onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123)"
                                                    required>
                                                </v-textarea>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="6">
                                                <v-textarea single-line auto-grow rows="1"  v-model="editedItem.lastName" type="text"
                                                    label="Last name" :rules="lastNameRules" :counter="40"
                                                    onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123)"
                                                    required>
                                                </v-textarea>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="6">
                                                <v-textarea single-line auto-grow rows="1"  v-model="editedItem.photoUrl" :rules="photoUrlRules"
                                                    label="Photo url" required>
                                                </v-textarea>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="6">
                                                <v-textarea single-line auto-grow rows="1"  v-model="editedItem.email" type="email"
                                                    :rules="emailRules" :counter="40" label="Email" required>
                                                </v-textarea>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="6">
                                                <v-text-field v-model="editedItem.contactNumber" type="number"
                                                    label="Contact number" :rules="contactNumberRules"
                                                    oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                                                    maxlength="11" required></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="6">
                                                <v-textarea single-line auto-grow rows="1"  v-model="editedItem.address" type="text" label="Address"
                                                    :rules="addressRules" required>
                                                </v-textarea>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="6">
                                                <v-select item-text="status" item-value="riderStatusId"
                                                    :items="statuses" v-model="editedItem.riderStatusId"
                                                    :rules="[v => !!v || 'Status is required']" label="Status" required>
                                                </v-select>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="8">
                                                <v-switch label="Activate email receipts"
                                                    v-model="editedItem.activateEmailReceipts">
                                                </v-switch>
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
    import RiderService from './riders.service'
    import RiderStatusService from '../rider-status/rider-status.service'
    import RiderRatingService from '../rider-rating/rider-rating.service'

    export default {
        data: () => ({
            statuses: null,
            ratings: null,
            users: null,
            alertInfo: [],
            dialog: false,
            successDialog: false,
            errorDialog: false,
            successMessage: "",
            editedIndex: -1,
            search: '',
            isValid: true,
            editedItem: {
                riderId: 0,
                firstName: "",
                lastName: "",
                photoUrl: "",
                email: "",
                contactNumber: "",
                address: "",
                activateEmailReceipts: false,
                riderStatusId: 0,
                ratingId: null,
                userId: null
            },
            defaultItem: {
                riderId: 0,
                firstName: "",
                lastName: "",
                photoUrl: "",
                email: "",
                contactNumber: "",
                address: "",
                activateEmailReceipts: false,
                riderStatusId: 0,
                ratingId: null,
                userId: null
            },
            lazy: false,
            firstNameRules: [
                v => !!v || 'First Name is required',
                v => (v && v.length <= 40) || 'Name must be less than 40 characters',
            ],
            lastNameRules: [
                v => !!v || 'Last Name is required',
                v => (v && v.length <= 40) || 'Last Name must be less than 40 characters',
            ],
            photoUrlRules: [
                v => !!v || 'Photo URL is required',

                v => (v || '').indexOf(' ') < 0 ||
                    'No spaces are allowed'
            ],
            emailRules: [
                    v => !!v || 'E-mail is required',
                    v => /.+@.+\..+/.test(v) || 'E-mail must be valid',

                    v => (v || '').indexOf(' ') < 0 ||
                    'No spaces are allowed'
                ],
            contactNumberRules: [
                v => !!v || 'Contact Number is required',

                v => (v || '').indexOf(' ') < 0 ||
                    'No spaces are allowed'
            ],
            addressRules: [
                v => !!v || 'Address is required',
                v => (v && v.length <= 200) || 'Address must be less than 200 characters',
            ],
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
            riderTable: null,
            tableHeaders: null
        },
        computed: {
            formTitle() {
                return this.editedIndex === -1 ? 'New Rider' : 'Edit Rider'
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
                this.editedIndex = this.riderTable.indexOf(item)
                this.editedItem = Object.assign({}, item)
                this.dialog = true
            },
            deleteItem(item) {
                const index = this.riderTable.indexOf(item)
                const isConfirmed = confirm('Are you sure you want to delete this item?')

                if(isConfirmed){
                    const self = this
                    RiderService.deleteRider(item.riderId)
                        .then(() => {
                            self.successDialog = true
                            self.errorDialog = false
                            self.successMessage = "Rider has been deleted successfully."
                            self.riderTable.splice(index, 1)
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
                self.editedItem.riderStatusId = parseInt(self.editedItem.riderStatusId)
                self.editedItem.ratingId = parseInt(self.editedItem.ratingId)
                // self.editedItem.userId = parseInt(self.editedItem.userId)
                if (this.editedIndex > -1) {
                    RiderService.editRider(self.editedItem.riderId, self.editedItem)
                        .then(() => {
                            self.loading = false
                            self.successDialog = true
                            self.errorDialog = false
                            self.successMessage = "Rider has been updated successfully."
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

                    Object.assign(self.riderTable[self.editedIndex], self.editedItem)

                } else {
                    RiderService.addRider(self.editedItem)
                        .then(() => {
                            self.loading = false
                            self.successMessage = "Rider has been saved successfully."

                            RiderService.getAllRiders()
                                .then(response => {
                                    self.riderTable = response.data
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
                            self.loading = false
                            self.alertInfo = {
                                success: false,
                                error
                            }

                            self.successDialog = false
                            self.errorDialog = true
                        })
                }
                this.close()
            },
            initialize() {
                var self = this
                RiderStatusService.getAllRiderStatus()
                    .then(response => {
                        self.statuses = response.data
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

                RiderRatingService.getAllRiderRatings()
                    .then(response => {
                        self.ratings = response.data
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

                // RiderService.getAllAvailableRiderUsers()
                //     .then(response => {
                //         self.users = response.data
                //         self.errorDialog = false
                //     })
                //     .catch(function (error) {
                //         self.alertInfo = {
                //             success: false,
                //             error
                //         }
                //         self.successDialog = false
                //         self.errorDialog = true
                //     })
            }
        },
    }
</script>