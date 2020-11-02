<template>
    <v-app id="inspire" style="background-color: #e8e4c9">
        <v-container fluid>
            <v-img max-width="1700px" position="center" :src="maps"></v-img>
        </v-container>
        <v-container fluid>
            <BookingTable :tableHeaders="headers" :bookingTable="tableData"></BookingTable>
        </v-container>
    </v-app>
</template>

<script>
    import BookingTable from '../components/booking/bookings-table'
    import BookingService from './booking/bookings.service'

    export default {
        name: "Home",
        components: {
            BookingTable,
        },
        data: () => ({
            maps: require("../assets/maps.jpg"),
            headers: [],
            tableData: [],
            alertInfo: [],
        }),
        created() {
            this.headers = [{
                    text: 'Id',
                    align: 'start',
                    value: 'bookingId',
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
            ]

            BookingService.getAllBookings()
                .then(response => {
                    this.tableData = response.data
                })
                .catch(function (error) {
                    self.alertInfo = {
                        success: false,
                        error
                    }
                })
        }
    }
</script>

<style scoped>
</style>