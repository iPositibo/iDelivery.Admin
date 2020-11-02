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
        <v-container fluid>
            <v-img position="center" :src="maps" aspect-ratio="3"></v-img>
        </v-container>
        <ActiveRiderTable :tableHeaders="headers" :activeRiderTable="tableData"></ActiveRiderTable>
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
    import ActiveRiderService from './active-riders.service'
    import ActiveRiderTable from './active-riders-table'

    export default {
        name: "ActiveRidersComponent",
        components: {
            ActiveRiderTable,
        },
        data: () => ({
            maps: require("../../assets/maps.jpg"),
            headers: [],
            tableData: [],
            errorDialog: false,
            alertInfo: [],
            interval: {},
            value: 0,
            loading: false
        }),
        created() {
            const self = this
            self.loading = true
            this.headers = [{
                        text: 'Id',
                        align: 'start',
                        value: 'riderId',
                    },
                    {
                        text: 'Rider',
                        value: 'riderName',
                        sortable: false
                    },
                    {
                        text: 'Photo url',
                        value: 'photoUrl',
                        sortable: false
                    },
                    {
                        text: 'Email',
                        value: 'email',
                        sortable: false
                    },
                    {
                        text: 'Contact number',
                        value: 'contactNumber',
                        sortable: false
                    },
                    {
                        text: 'Address',
                        value: 'address',
                        sortable: false
                    },
                     {
                        text: 'Status',
                        value: 'status',
                        sortable: false
                    },
                     {
                        text: 'Rating',
                        value: 'rating',
                        sortable: false
                    }
                ],

                ActiveRiderService.getAllActiveRiders()
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
</style>