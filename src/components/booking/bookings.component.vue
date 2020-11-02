<template v-slot:top>
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
        <BookingTable :tableHeaders="headers" :bookingTable="tableData"></BookingTable>
        <v-dialog v-model="loading" fullscreen>
            <v-container fluid fill-height style="background-color: rgba(255, 255, 255, 0.5);">
                <v-layout justify-center align-center>
                    <v-progress-circular indeterminate color="primary">
                    </v-progress-circular>
                </v-layout>
            </v-container>
        </v-dialog>
    </v-app>
</template>

<script>
    import BookingService from '../booking/bookings.service'
    import BookingTable from '../booking/bookings-table'

    export default {
        name: "BookingsComponent",
        components: {
            BookingTable,
        },
        data: () => ({
            headers: [],
            tableData: [],
            alertInfo: [],
            errorDialog: false,
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
        created() {
            const self = this
            self.loading = true;
            this.headers = [{
                    text: 'Id',
                    align: 'start',
                    value: 'bookingId',
                },
                {
                    text: 'Reference Number',
                    value: 'referenceNumber',
                    sortable: false,
                    align: 'start',
                    fixed: true,
                    width: "100px"
                },
                {
                    text: 'Status',
                    value: 'bookingStatusName',
                    sortable: false
                },
                {
                    text: 'Customer',
                    value: 'customerName'
                },
                {
                    text: 'Contact name',
                    value: 'contactName',
                    sortable: false
                },
                {
                    text: 'Contact #',
                    value: 'contactNumber',
                    sortable: false
                },
                {
                    text: 'Items',
                    value: 'items',
                    sortable: false
                },
                {
                    text: 'Photo',
                    value: 'photoUrl',
                    sortable: false
                },
                {
                    text: 'Total Fare',
                    value: 'totalFare',
                    sortable: false
                },
                {
                    text: 'Date',
                    value: 'bookingDateFormatted'
                },
                {
                    text: 'Rider',
                    value: 'riderName',
                    sortable: false
                },
                {
                    text: 'Pickup location',
                    value: 'pickupLocation',
                    sortable: false
                },
                {
                    text: 'Pickup time',
                    value: 'pickupTimeFormatted',
                    sortable: false
                },
                {
                    text: 'DropOff location',
                    value: 'dropOffLocation',
                    sortable: false
                },
                {
                    text: 'DropOff time',
                    value: 'dropOffTimeFormatted',
                    sortable: false
                },
                {
                    text: 'Actions',
                    value: 'actions',
                    sortable: false
                },
            ]

            BookingService.getAllBookings()
                .then(response => {
                    self.tableData = response.data
                    self.loading = false
                    self.errorDialog = false
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
</script>

<style scoped>

</style>