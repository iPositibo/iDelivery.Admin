<template>
    <div>
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
        <v-data-table :headers="tableHeaders" :items="activeTransactionTable" sort-by="bookingId" class="elevation-1"
            :search="search">
             <template v-slot:item.bookingStatusName="{ item }">
                <v-chip :color="item.bookingStatusColor" dark>{{ item.bookingStatusName }}</v-chip>
            </template>
            <template v-slot:item.photoUrl="{ item }">
                <div class="p-2">
                <v-img v-if="item.photoUrl != null" :src="item.photoUrl" :alt="item.name" width="50px" height="50px"></v-img>
                </div>
            </template>
            <template v-slot:top>
                <v-toolbar flat color="white">
                    <v-toolbar-title>Active Transactions</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-text-field v-model="search" append-icon="mdi-magnify" placeholder="Search"
                        class="shrink yellow darken-1" clear-icon="mdi-close-circle-outline" clearable rounded
                        single-line hide-details>
                    </v-text-field>
                    <v-spacer></v-spacer>
                </v-toolbar>
            </template>
        </v-data-table>
        <template>
        </template>
    </div>
</template>

<script>
    import BookingService from '../booking/bookings.service';
    import BookingStatusService from '../booking-status/booking-status.service'
    import CustomerService from '../customer/customers.service'
    import RiderService from '../rider/riders.service'
    import FareService from '../fare/fares.service'

    export default {
        data: () => ({
            alertInfo: [],
            statuses: null,
            customers: null,
            riders: null,
            fare: null,
            date: null,
            menu: false,
            dialog: false,
            errorDialog: false,
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
            },
            lazy: false,
            contactNameRules: [
                v => !!v || 'Contact Name is required',
                v => (v && v.length <= 40) || 'Name must be less than 40 characters',
            ],
            contactNumberRules: [
                v => !!v || 'Contact Number is required',
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
        }),
        props: {
            activeTransactionTable: null,
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
                            self.errorDialog = false
                            self.bookingTable.splice(index, 1)
                        })
                        .catch(function (error) {
                            self.alertInfo = {
                                success: false,
                                error
                            }
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
                self.editedItem.bookingStatusId = parseInt(self.editedItem.bookingStatusId)
                self.editedItem.customerId = parseInt(self.editedItem.customerId)
                self.editedItem.fareId = parseInt(self.editedItem.fareId)
                self.editedItem.riderId = parseInt(self.editedItem.riderId)
                self.editedItem.pickupTime = new Date(self.editedItem.pickupTime)
                self.editedItem.dropOffTime = new Date(self.editedItem.dropOffTime)
                if (self.editedIndex > -1) {
                    BookingService.editBooking(self.editedItem.bookingId, self.editedItem)
                        .then(() => {
                            self.errorDialog = false
                        })
                        .catch(function (error) {
                            self.alertInfo = {
                                success: false,
                                error
                            }
                            self.errorDialog = true
                        })
                    Object.assign(self.bookingTable[self.editedIndex], self.editedItem)

                } else {
                    let self = this
                    BookingService.addBooking(self.editedItem)
                        .then(() => {
                            self.errorDialog = false
                        })
                        .catch(function (error) {
                            self.alertInfo = {
                                success: false,
                                error
                            }
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
                        self.errorDialog = false
                    })
                    .catch(function (error) {
                        self.alertInfo = {
                            success: false,
                            error
                        }
                        self.errorDialog = true
                    })

                CustomerService.getAllActiveCustomers()
                    .then(response => {
                        self.customers = response.data
                        self.errorDialog = false
                    })
                    .catch(function (error) {
                        self.alertInfo = {
                            success: false,
                            error
                        }
                        self.errorDialog = true
                    })

                RiderService.getAllActiveRiders()
                    .then(response => {
                        self.riders = response.data
                        self.errorDialog = false
                    })
                    .catch(function (error) {
                        self.alertInfo = {
                            success: false,
                            error
                        }
                        self.errorDialog = true
                    })

                FareService.getDefaultFare()
                    .then(response => {
                        self.fare = response.data
                        self.errorDialog = false
                    })
                    .catch(function (error) {
                        self.alertInfo = {
                            success: false,
                            error
                        }
                        self.errorDialog = true
                    })
            }
        }
    }
</script>

<style scoped>

</style>