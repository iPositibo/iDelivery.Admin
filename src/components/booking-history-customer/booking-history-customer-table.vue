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
        <v-data-table :headers="tableHeaders" :items="bookingHistoryCustomerTable" sort-by="customerBookigHistoryId"
            class="elevation-1" :search="search">
            <template v-slot:item.bookingStatusName="{ item }">
                <v-chip :color="item.bookingStatusColor" dark>{{ item.bookingStatusName }}</v-chip>
            </template>
            <template v-slot:top>
                <v-toolbar flat color="white">
                    <v-toolbar-title>Customer Booking History</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                     <v-text-field v-model="search" append-icon="mdi-magnify" placeholder="Search" class="shrink yellow darken-1"  clear-icon="mdi-close-circle-outline" clearable rounded single-line hide-details>
                    </v-text-field>
                    <v-spacer></v-spacer>
                </v-toolbar>
            </template>
        </v-data-table>
    </div>
</template>

<script>
    import BookingStatusService from '../booking-status/booking-status.service'
    import CustomerService from '../customer/customers.service'

    export default {
        data: () => ({
            alertInfo: [],
            statuses: null,
            customers: null,
            dialog: false,
            errorDialog: false,
            editedIndex: -1,
            search: '',
            editedItem: {
                customerBookingHistoryId: 0,
                bookingStatusId: 0,
                customerId: 0,
                receiverCompleteAddress: "",
                receiverCompleteName: "",
                itemDetails: "",
                totalFare: "",
                totalKilometers: "",
                estimatedTime: "",
                receipt: "",

            },
            defaultItem: {
                customerBookingHistoryId: 0,
                bookingStatusId: 0,
                customerId: 0,
                receiverCompleteAddress: "",
                receiverCompleteName: "",
                itemDetails: "",
                totalFare: "",
                totalKilometers: "",
                estimatedTime: "",
                receipt: "",
            },
        }),
        props: {
            bookingHistoryCustomerTable: null,
            tableHeaders: null
        },
        computed: {
            formTitle() {
                return this.editedIndex === -1 ? 'New History' : 'Edit History'
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
            // getColor(status) {
            //     if (status == 'For Pickup') return 'yellow'
            //     if (status == 'To Ship') return 'blue'
            //     if (status == 'Delivered') return 'green'
            //     if (status == 'Cancelled') return 'red'
            //     if (status == 'Ready') return 'orange'
            // },
            close() {
                this.dialog = false
                this.$nextTick(() => {
                    this.editedItem = Object.assign({}, this.defaultItem)
                    this.editedIndex = -1
                })
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

                CustomerService.getAllCustomers()
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
            }
        },
    }
</script>
<style scoped>

</style>