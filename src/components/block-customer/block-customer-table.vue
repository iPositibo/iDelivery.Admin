<template>
    <div>
        <div class="text-center">
            <v-dialog v-model="successDialog" width="400" transition="slide-y-reverse-transition">
                <v-card>
                    <v-card-title class="headline green">
                       <strong> Success! </strong>  <v-icon> mdi-check-bold </v-icon>
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
                      <strong>  Whoops, that's an error! </strong> <v-icon> mdi-alert-box </v-icon>
                    </v-card-title>

                    <v-card-text v-if="errorDialog" v-text="alertInfo.error.response.data" class="black--text">
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
        <v-data-table :headers="tableHeaders" :items="blockCustomerTable" sort-by="blockedCustomerId"
            class="elevation-1" :search="search">
            <template v-slot:top>
                <v-toolbar flat color="white">
                    <v-toolbar-title>Blocked Customers</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-text-field v-model="search" append-icon="mdi-magnify" placeholder="Search"
                        class="shrink yellow darken-1" clear-icon="mdi-close-circle-outline" clearable rounded
                        single-line hide-details>
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
                            </v-card-title>

                            <v-card-text>
                                <v-container>
                                    <v-form ref="form" v-model="isValid" :lazy-validation="lazy">
                                        <v-row>
                                            <v-col cols="12" sm="6" md="6">
                                                <v-select item-text="firstName" item-value="customerId"
                                                    :items="customers" v-model="editedItem.customerId"
                                                    :rules="[v => !!v || 'Customer is required']" label="Customer"
                                                    required>
                                                </v-select>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="6">
                                                <v-textarea single-line auto-grow v-model="editedItem.reason" type="text"
                                                    :rules="reasonRules" :counter="200" label="Reason" required rows="1">
                                                </v-textarea>
                                            </v-col>
                                        </v-row>
                                    </v-form>
                                </v-container>
                            </v-card-text>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                                <v-btn color="blue darken-1" :disabled="!isValid" text @click="save">
                                    Save
                                </v-btn>
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
    import BlockCustomerService from './block.customer.service'
    import CustomerService from '../customer/customers.service'

    export default {
        data: () => ({
            customers: null,
            successDialog: false,
            errorDialog: false,
            successMessage: "",
            alertInfo: [],
            dialog: false,
            editedIndex: -1,
            search: '',
            isValid: true,
            editedItem: {
                blockedCustomerId: 0,
                customerId: 0,
                reason: "",
                dateBlocked: new Date(),
            },
            defaultItem: {
                blockedCustomerId: 0,
                customerId: 0,
                reason: "",
                dateBlocked: new Date(),
            },
            lazy: false,
            reasonRules: [
                v => !!v || 'Reason is required',
                v => (v && v.length <= 200) || 'Reason must be less than 200 characters',
            ],
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
        props: {
            blockCustomerTable: null,
            tableHeaders: null
        },
        computed: {
            formTitle() {
                return this.editedIndex === -1 ? 'Blocked Customer' : 'Edit Blocked Customer'
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
                this.editedIndex = this.blockCustomerTable.indexOf(item)
                this.editedItem = Object.assign({}, item)
                this.dialog = true
            },
            deleteItem(item) {
                const index = this.blockCustomerTable.indexOf(item)
                const isConfirmed = confirm('Are you sure you want to delete this item?')

                if(isConfirmed){
                    const self = this
                    BlockCustomerService.deleteBlockCustomer(item.blockedCustomerId)
                        .then(() => {
                            self.successDialog = true
                            self.errorDialog = false
                            self.successMessage = "Blocked Customer has been deleted successfully."
                            self.blockCustomerTable.splice(index, 1)
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
                self.editedItem.customerId = parseInt(self.editedItem.customerId)
                if (this.editedIndex > -1) {
                    BlockCustomerService.editBlockCustomer(self.editedItem.blockedCustomerId, self.editedItem)
                        .then(() => {
                            self.loading = false
                            self.successMessage = "Blocked customer has been updated successfully."

                            self.loadBlockedCustomers()
                        })
                        .catch(function (error) {
                            self.loading = false
                            self.alertInfo = {
                                success: false,
                                error
                            }
                            self.successDialog = false
                            self.errorDialog = true
                        })

                    Object.assign(self.blockCustomerTable[self.editedIndex], self.editedItem)

                } else {
                    BlockCustomerService.addBlockCustomer(self.editedItem)
                        .then(() => {
                            self.loading = false
                            self.successMessage = "Blocked customer has been saved successfully."

                            self.loadBlockedCustomers()
                        })
                        .catch(function (error) {
                            self.loading = false
                            self.alertInfo = {
                                success: false,
                                error
                            }
                            self.successDialog = false
                            self.errorDialog = true
                        })
                }
                this.close()

            },
            initialize() {
                var self = this
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
                        self.successDialog = false
                        self.errorDialog = true
                    })
            },
            loadBlockedCustomers() {
                var self = this
                BlockCustomerService.getAllBlockCustomers()
                                .then(response => {
                                    self.blockCustomerTable = response.data
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
            }
        }
    }
</script>