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
        <RiderTable :tableHeaders="headers" :riderTable="tableData" class="black"></RiderTable>
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
    import RiderService from './riders.service'
    import RiderTable from './riders-table'

    export default {
        name: "RidersComponent",
        components: {
            RiderTable
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
            self.loading = true
            this.headers = [{
                        text: 'Id',
                        align: 'start',
                        value: 'riderId',
                    },
                    {
                        text: 'Username',
                        value: 'username',
                        sortable: false
                    },
                    {
                        text: 'Rider',
                        value: 'riderName',
                        sortable: false
                    },
                    {
                        text: 'Status',
                        align: 'start',
                        value: 'status',
                        sortable: false
                    },
                    {
                        text: 'Photo',
                        align: 'start',
                        value: 'photoUrl',
                        sortable: false
                    },
                    {
                        text: 'Email',
                        align: 'start',
                        value: 'email',
                        sortable: false
                    },
                    {
                        text: 'Contact number',
                        align: 'start',
                        value: 'contactNumber',
                        sortable: false
                    },
                    {
                        text: 'Address',
                        align: 'start',
                        value: 'address',
                        sortable: false
                    },
                    {
                        text: 'Activate email receipts',
                        value: 'activateEmailReceipts',
                        sortable: false
                    },
                    {
                        text: 'Rating',
                        align: 'start',
                        value: 'rating',
                        sortable: false
                    },
                    {
                        text: 'Actions',
                        align: 'start',
                        value: 'actions',
                        sortable: false
                    },
                ],

                RiderService.getAllRiders()
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
        },
    }
</script>

<style scoped>
v-data-table-header {
    font-weight: bold;
}
</style>