<template>
    <div>
        <div class="text-center">
            <v-dialog v-model="successDialog" width="400" transition="slide-y-reverse-transition">
                <v-card>
                    <v-card-title class="headline green">
                       <strong> Success! </strong><v-icon> mdi-check-bold </v-icon>
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
        <v-data-table dense slot="bookingTable" :headers="tableHeaders" :items="bookingTable" sort-by="bookingId" class="booking elevation-1"
            :search="search">
            <template v-slot:item.bookingStatusName="{ item }">
                <v-chip :color="item.bookingStatusColor" dark>{{ item.bookingStatusName }}</v-chip>
            </template>
            <template v-slot:item.photoUrl="{ item }">
                <div class="p-2">
                    <v-img v-if="item.photoUrl != null" :src="item.photoUrl" :alt="item.name" width="50px"
                        height="50px"></v-img>
                </div>
            </template>
            <template v-slot:top>
                <v-toolbar flat color="white">
                    <v-toolbar-title>Bookings</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-text-field v-model="search" placeholder="Search" class="search shrink yellow darken-1"
                        clear-icon="mdi-close-circle-outline" clearable rounded single-line hide-details>
                    </v-text-field>
                    <v-spacer></v-spacer>
                    <v-dialog v-model="dialog" max-width="500px">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn color="yellow darken-1" light class="mb-2" v-bind="attrs" v-on="on" rounded>Add
                            </v-btn>
                        </template>
                        <v-card>
                            <v-card-title>
                                <span class="headline">{{ formTitle }}</span>
                                <v-spacer> </v-spacer>
                            </v-card-title>

                            <v-card-text>
                                <v-container>
                                    <v-form ref="form" v-model="isValid" :lazy-validation="lazy">
                                        <v-row>
                                            <v-col cols="12" sm="6" md="6">
                                                <v-select item-text="bookingStatusName" item-value="bookingStatusId"
                                                    :items="statuses" v-model="editedItem.bookingStatusId"
                                                    :rules="[v => !!v || 'Status is required']" label="Status" required>
                                                </v-select>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="6">
                                                <v-select item-text="firstName" item-value="customerId"
                                                    :items="customers" v-model="editedItem.customerId"
                                                    :rules="[v => !!v || 'Customer is required']" label="Customer"
                                                    required>
                                                </v-select>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="6">
                                                <v-textarea single-line auto-grow rows="1" v-model="editedItem.contactName" type="text"
                                                    label="Contact name" :rules="contactNameRules" :counter="40"
                                                    onkeypress="return (event.charCode > 64 && event.charCode < 91) || (event.charCode > 96 && event.charCode < 123)"
                                                    required>
                                                </v-textarea>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="6">
                                                <v-text-field v-model="editedItem.contactNumber" type="number"
                                                    label="Contact number" :rules="contactNumberRules"
                                                    oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                                                    maxlength="11" required>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="6">
                                                <v-textarea single-line auto-grow rows="1" v-model="editedItem.items" :rules="itemRules"
                                                    :counter="40" type="text" label="Items" required>
                                                </v-textarea>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="6">
                                                <v-text-field v-model="editedItem.totalEstimatedWeight" type="number"
                                                    suffix="kg" :rules="weightRules" label="Estimated Weight"
                                                    oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                                                    maxlength="11" required>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="6">
                                                <v-text-field v-model="editedItem.totalKilometers" type="number"
                                                    suffix="Km" :rules="kmRules" label="Total Kilometers"
                                                    oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                                                    maxlength="10" required>
                                                </v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="6">
                                                <v-textarea single-line auto-grow rows="1" v-model="editedItem.estimatedTime" type="number"
                                                    :rules="estimatedTimeRules" label="Estimated Time"
                                                    oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                                                    maxlength="10" required>
                                                </v-textarea>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="6">
                                                <v-textarea single-line auto-grow rows="1" v-model="editedItem.notes" type="text" label="Notes"
                                                    hint="Optional">
                                                </v-textarea>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="6">
                                                <v-textarea single-line auto-grow rows="1" v-model="editedItem.pickupLocation"
                                                    append-outer-icon="mdi-map-marker" :rules="pickupLocationRules"
                                                    label="Pickup Location" required>
                                                </v-textarea>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="6">
                                                <v-textarea single-line auto-grow rows="1" v-model="editedItem.dropOffLocation"
                                                    append-outer-icon="mdi-map-marker" :rules="dropoffLocationRules"
                                                    label="Drop Off" required>
                                                </v-textarea>
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
    import BookingService from './bookings.service';
    import BookingStatusService from '../booking-status/booking-status.service'
    import CustomerService from '../customer/customers.service'
    import RiderService from '../rider/riders.service'
    import FareService from '../fare/fares.service'

    export default {
        data: () => ({
            interval: {},
            value: 0,
            loading: false,
            successDialog: false,
            errorDialog: false,
            successMessage: "",
            alertInfo: [],
            statuses: null,
            customers: null,
            riders: null,
            fare: null,
            date: null,
            menu: false,
            dialog: false,
            referenceNumber: null,
            editedIndex: -1,
            search: '',
            isValid: true,
            editedItem: {
                bookingId: 0,
                bookingStatusId: 0,
                customerId: 0,
                contactName: "",
                contactNumber: "",
                items: "",
                notes: "",
                totalEstimatedWeight: "",
                totalKilometers: "",
                estimatedTime: "",
                isActive: true,
                fareId: "",
                riderId: 0,
                pickupLocation: "",
                pickupLongitude: "",
                pickupLatitude: "",
                pickupTime: "",
                dropOffLocation: "",
                dropOffLongitude: "",
                dropOffLatitude: "",
                dropOffTime: "",
                referenceNumber: "",
            },
            defaultItem: {
                bookingId: 0,
                bookingStatusId: 0,
                customerId: 0,
                contactName: "",
                contactNumber: "",
                items: "",
                notes: "",
                totalEstimatedWeight: "",
                totalKilometers: "",
                estimatedTime: "",
                isActive: true,
                fareId: "",
                riderId: 0,
                pickupLocation: "",
                pickupLongitude: "",
                pickupLatitude: "",
                pickupTime: "",
                dropOffLocation: "",
                dropOffLongitude: "",
                dropOffLatitude: "",
                dropOffTime: "",
                refenceNumber: "",
            },
            lazy: false,
            contactNameRules: [
                v => !!v || 'Contact Name is required',
                v => (v && v.length <= 40) || 'Name must be less than 40 characters',
            ],
            contactNumberRules: [
                v => !!v || 'Contact Number is required',
                v => (v && v.length >= 11 && v.length <= 11) || 'Contact Number must be 11 characters',
            ],
            itemRules: [
                v => !!v || 'Item is required',
                v => (v && v.length <= 40) || 'Item must be less than 40 characters',
            ],
            weightRules: [
                v => !!v || 'Weight is required',
            ],
            kmRules: [
                v => !!v || 'Total Km is required',
            ],
            estimatedTimeRules: [
                v => !!v || 'Estimated Time is required',
            ],
            pickupLocationRules: [
                v => !!v || 'Pick-up Location is required',
            ],
            dropoffLocationRules: [
                v => !!v || 'Drop-off Location is required',
            ],
            //  tableHeaders: [{
            //      fixed:true,}
            //  ],
            //  bookingTable: [
            //      {fixed:true, width:'100px'}
            //  ]
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
            bookingTable: null,
            tableHeaders: null
        },
        computed: {
            formTitle() {
                return this.editedIndex === -1 ? 'Add Booking' : 'Edit Booking'
            },
        },
        watch: {
            dialog(val) {
                val || this.close()
            },
            menu(val) {
                val && setTimeout(() => (this.$refs.picker.activePicker = 'YEAR'))
            },
        },
        created() {
            this.initialize()
        },
        methods: {
            validate() {
                this.$refs.form.validate()
            },
            saveBookingDate(date) {
                this.$refs.menu.save(date)
            },
            editItem(item) {
                this.editedIndex = this.bookingTable.indexOf(item)
                this.editedItem = Object.assign({}, item)
                this.dialog = true
            },
            deleteItem(item) {
                const index = this.bookingTable.indexOf(item)
                const isConfirmed = confirm('Are you sure you want to delete this item?')

                if(isConfirmed){
                    const self = this
                    BookingService.deleteBooking(item.bookingId)
                        .then(() => {
                            self.successDialog = true
                            self.errorDialog = false
                            self.successMessage = "Booking has been deleted successfully."
                            self.bookingTable.splice(index, 1)
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
                self.editedItem.bookingStatusId = parseInt(self.editedItem.bookingStatusId)
                self.editedItem.customerId = parseInt(self.editedItem.customerId)
                self.editedItem.fareId = parseInt(self.editedItem.fareId)
                self.editedItem.riderId = parseInt(self.editedItem.riderId)
                self.editedItem.pickupTime = new Date(self.editedItem.pickupTime)
                self.editedItem.dropOffTime = new Date(self.editedItem.dropOffTime)
                if (self.editedIndex > -1) {
                    BookingService.editBooking(self.editedItem.bookingId, self.editedItem)
                        .then(() => {
                            self.loading = false
                            self.successDialog = true
                            self.errorDialog = false
                            self.successMessage = "Booking has been updated successfully."
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
                    Object.assign(self.bookingTable[self.editedIndex], self.editedItem)

                } else {
                    let self = this
                    BookingService.addBooking(self.editedItem)
                        .then(() => {
                            self.loading = false
                            self.successMessage = "Booking has been saved successfully."

                            BookingService.getAllBookings()
                                .then(response => {
                                    self.bookingTable = response.data
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
                            self.alertInfo = {
                                success: false,
                                error
                            }
                            self.loading = false
                            self.successDialog = false
                            self.errorDialog = true
                        })

                    self.bookingTable.push(self.editedItem)
                }
                this.close()
            },
            initialize() {
                var self = this
                BookingStatusService.getAllBookingStatuses()
                    .then(response => {
                        self.statuses = response.data
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

                CustomerService.getAllActiveCustomers()
                    .then(response => {
                        self.customers = response.data
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

                RiderService.getAllActiveRiders()
                    .then(response => {
                        self.riders = response.data
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

                FareService.getDefaultFare()
                    .then(response => {
                        self.fare = response.data
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
        }

    }
</script>

<style scoped>
    .search {
        /* width: auto; */
        width:3.5cm;

    }
    .booking {
       text-overflow: ellipsis;

       white-space: nowrap;
       overflow: hidden;
    }
</style>