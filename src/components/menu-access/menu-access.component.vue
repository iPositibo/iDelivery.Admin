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
        <MenuAccessTable :tableHeaders="headers" :menuAccessTable="tableData"></MenuAccessTable>
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
    import MenuAccessService from '../menu-access/menu-access.service'
    import MenuAccessTable from '../menu-access/menu-access-table'

    export default {
        name: "MenuAccessComponent",
        components: {
            MenuAccessTable,
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
                            value: 'menuAccessId',
                        },
                        {
                            text: 'Menu Item',
                            value: 'menuItemName',
                        },
                        {
                            text: 'Role',
                            value: 'roleName',
                        },
                        {
                            text: 'Date Created',
                            value: 'dateCreatedFormatted',
                            sortable: false
                        },
                        {
                            text: 'Date Updated',
                            value: 'dateUpdatedFormatted',
                            sortable: false
                        },
                        {
                            text: 'Actions',
                            value: 'actions',
                            sortable: false
                        },
                    ]

            MenuAccessService.getAllMenuAccess()
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