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
        <BookingHistoryRiderTable :tableHeaders="headers" :bookingHistoryRiderTable="tableData"></BookingHistoryRiderTable>
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
    import BookingHistoryRiderService from '../booking-history-rider/booking-history-rider.service'
    import BookingHistoryRiderTable from '../booking-history-rider/booking-history-rider-table'

    export default {
        name: "BookingHistoryComponent",
        components: {
            BookingHistoryRiderTable
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
            var self = this
            self.loading = true
            this.headers = [{
                            text: 'Id',
                            align: 'start',
                            value: 'riderBookingHistoryId',
                        },
                        {
                            text: 'Status',
                            value: 'bookingStatusName',
                            sortable: false
                        },
                        {
                            text: 'Customer',
                            value: 'customerName',
                            sortable: false
                        },
                        {
                            text: 'Receiver Name',
                            value: 'receiverName',
                        },
                        {
                            text: 'Customer Number',
                            value: 'customerNumber'
                        },
                        {
                            text: 'Receiver Number',
                            value: 'receiverNumber',
                        },
                        {
                            text: 'Pick-up Location',
                            value: 'pickupLocation',
                        },
                        {
                            text: 'Drop off',
                            value: 'dropOffLocation',
                        },
                        {
                            text: 'Items',
                            value: 'itemDetails',
                        },
                        {
                            text: 'Total Fare',
                            value: 'totalFare',
                        },
                        {
                            text: 'Rider Shares',
                            value: 'riderShares',
                        },
                        {
                            text: 'Total Kilometers',
                            value: 'totalKilometers',
                        },
                    ]

            BookingHistoryRiderService.getAllBookingHistoryRiders()
                .then(response => {
                this.tableData = response.data
                self.loading = false
                self.errorDialog = false
            })
            .catch(function (error) {
                self.alertInfo = {success: false, error }
                self.loading = false
                self.errorDialog = true
            })
        }
    }
</script>

<style scoped>
</style>