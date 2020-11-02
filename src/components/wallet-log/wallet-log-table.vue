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
        <v-data-table :headers="tableHeaders" :items="walletLogTable" sort-by="walletLogId" class="elevation-1" :search="search">
            <template v-slot:top>
                <v-toolbar flat color="white">
                    <v-toolbar-title>Wallet Logs</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-text-field v-model="search" append-icon="mdi-magnify" placeholder="Search" class="shrink yellow darken-1"  clear-icon="mdi-close-circle-outline" clearable rounded single-line hide-details>
                    </v-text-field>
                    <v-spacer></v-spacer>
                    <!-- <v-dialog v-model="dialog" max-width="500px">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn color="yellow" light class="mb-2" v-bind="attrs" v-on="on">Add</v-btn>
                        </template>
                        <v-card>
                            <v-card-title>
                                <span class="headline">{{ formTitle }}</span>
                            </v-card-title>

                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-select item-text="walletId" item-value="walletId" :items="wallets"
                                                v-model="editedItem.walletId" label="Wallet">
                                            </v-select>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-text-field v-model="editedItem.logDate" type="date" label="Log Date">
                                            </v-text-field>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card-text>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                                <v-btn color="blue darken-1" text @click="save">Save</v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog> -->
                </v-toolbar>
            </template>
            <!-- <template v-slot:item.actions="{ item }">
                <v-icon small class="mr-2" @click="editItem(item)">
                    mdi-pencil
                </v-icon>
                <v-icon small @click="deleteItem(item)">
                    mdi-delete
                </v-icon>
            </template> -->
        </v-data-table>
    </div>
</template>

<script>
    import WalletLogService from './wallet-log.service'
    import WalletService from '../wallets/wallets.service'

    export default {
        data: () => ({
            alertInfo: [],
            wallets: null,
            dialog: false,
            errorDialog: false,
            editedIndex: -1,
            search: '',
            editedItem: {
                walletLogId: 0,
                walletId: 0,
                riderName: "",
                points: "",
                currentPoints: "",
                currentStatus: "",
                logDate: "",
            },
            defaultItem: {
                walletLogId: 0,
                riderName: "",
                points: "",
                currentPoints: "",
                currentStatus: "",
                logDate: "",
            },
        }),
        props: {
            walletLogTable: null,
            tableHeaders: null
        },
        computed: {
            formTitle() {
                return this.editedIndex === -1 ? 'New Log' : 'Edit Log'
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
                this.editedIndex = this.walletLogTable.indexOf(item)
                this.editedItem = Object.assign({}, item)
                this.dialog = true
            },
            deleteItem(item) {
                const index = this.walletLogTable.indexOf(item)
                const isConfirmed = confirm('Are you sure you want to delete this item?')

                if(isConfirmed){
                    const self = this
                    WalletLogService.deleteWalletLog(item.walletLogId)
                        .then(() => {
                            self.errorDialog = false
                            self.walletLogTable.splice(index, 1)
                        })
                        .catch(function (error) {
                            self.alertInfo = {success: false, error }
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
                if (self.editedIndex > -1) {
                    WalletLogService.editWalletLog(self.editedItem.walletLogId, self.editedItem)
                        .then(() => {
                            self.errorDialog = false
                        })
                        .catch(function (error) {
                            self.alertInfo = {success: false, error }
                            self.successDialog = false
                            self.errorDialog = true
                        })
                        
                    Object.assign(self.walletLogTable[self.editedIndex], self.editedItem)

                } else {
                    WalletLogService.addWalletLog(self.editedItem)
                        .then(() => {
                            self.errorDialog = false
                        })
                        .catch(function (error) {
                            self.alertInfo = {success: false, error }
                            self.successDialog = false
                            self.errorDialog = true
                        })
                }
                this.close()
            },
            initialize() {
                var self = this
                WalletService.getAllWallets()
                    .then(response => {
                        self.wallets = response.data
                        self.errorDialog = false
                    })
                    .catch(function (error) {
                        self.alertInfo = {success: false, error }
                        self.successDialog = false
                        self.errorDialog = true
                    })
            }
        },
    }
</script>