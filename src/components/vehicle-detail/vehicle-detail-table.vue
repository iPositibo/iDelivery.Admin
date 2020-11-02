<template>
    <div>
        <div class="text-center">
            <v-dialog v-model="successDialog" width="400" transition="slide-y-reverse-transition">
                <v-card>
                    <v-card-title class="headline green">
                       <strong> Success! </strong><v-icon> mdi-check-bold </v-icon>
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
        <v-data-table :headers="tableHeaders" :items="vehicleDetailTable" sort-by="vehicleDetailId" class="elevation-1">
            <template v-slot:top>
                <v-toolbar flat color="white">
                    <v-toolbar-title>Vehicle Detail</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
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
                                            <v-select item-text="firstName" item-value="riderId" :items="riders"
                                                v-model="editedItem.riderId"
                                                :rules="[v => !!v || 'Rider is required']" label="Rider" required>
                                            </v-select>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-textarea single-line auto-grow rows="1" v-model="editedItem.plateNumber" type="text"
                                                label="Plate Number" :rules="vehicleDetailRules">
                                            </v-textarea>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-textarea single-line auto-grow rows="1" v-model="editedItem.orcr" type="text" label="ORCR"
                                            :rules="vehicleDetailRules">
                                            </v-textarea>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-textarea single-line auto-grow rows="1" v-model="editedItem.brand" type="text" label="Brand"
                                            :rules="vehicleDetailRules">
                                            </v-textarea>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-textarea single-line auto-grow rows="1" v-model="editedItem.model" type="text" label="Model"
                                            :rules="vehicleDetailRules">
                                            </v-textarea>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-textarea single-line auto-grow rows="1" v-model="editedItem.color" type="text" label="Color"
                                            :rules="vehicleDetailRules">
                                            </v-textarea>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-textarea single-line auto-grow rows="1" v-model="editedItem.type" type="text" label="Type"
                                            :rules="vehicleDetailRules">
                                            </v-textarea>
                                        </v-col>
                                    </v-row>
                                    </v-form>
                                </v-container>
                            </v-card-text>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                                <v-btn color="blue darken-1" text :disabled="!isValid" @click="save">Save</v-btn>
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
    import VehicleDetailService from './vehicle-detail.service'
    import RiderService from '../rider/riders.service'

    export default {
        data: () => ({
            alertInfo: [],
            riders: null,
            dialog: false,
            successDialog: false,
            errorDialog: false,
            successMessage: "",
            editedIndex: -1,
            editedItem: {
                riderRatingId: 0,
                riderId: "",
                plateNumber: "",
                orcr: "",
                brand: "",
                model: "",
                color: "",
                type: ""
            },
            defaultItem: {
                riderRatingId: 0,
                riderId: "",
                plateNumber: "",
                orcr: "",
                brand: "",
                model: "",
                color: "",
                type: ""
            },
            interval: {},
            value: 0,
            loading: false,
            lazy: false,
            isValid: true,
            vehicleDetailRules: [
                v => !!v || 'This is required',
                v => (v && v.length <= 40) || 'This must be less than 40 characters',
            ],
        }),
        props: {
            vehicleDetailTable: null,
            tableHeaders: null
        },
        computed: {
            formTitle() {
                return this.editedIndex === -1 ? 'New Vehicle detail' : 'Edit Vehicle detail'
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
                this.editedIndex = this.vehicleDetailTable.indexOf(item)
                this.editedItem = Object.assign({}, item)
                this.dialog = true
            },
            deleteItem(item) {
                const index = this.vehicleDetailTable.indexOf(item)
                const isConfirmed = confirm('Are you sure you want to delete this item?')

                if(isConfirmed){
                    const self = this
                    VehicleDetailService.deleteVehicleDetail(item.vehicleDetailId)
                        .then(() => {
                            self.successDialog = true
                            self.errorDialog = false
                            self.successMessage = "Status has been deleted successfully."
                            self.vehicleDetailTable.splice(index, 1)
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
                if (self.editedIndex > -1) {
                    VehicleDetailService.editVehicleDetail(self.editedItem.vehicleDetailId, self.editedItem)
                        .then(() => {
                            self.loading = false
                            self.successDialog = true
                            self.errorDialog = false
                            self.successMessage = "Status has been updated successfully."
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

                    Object.assign(self.vehicleDetailTable[self.editedIndex], self.editedItem)

                } else {
                    VehicleDetailService.addVehicleDetail(self.editedItem)
                        .then(() => {
                            self.loading = false
                            self.successMessage = "Status has been saved successfully."

                            VehicleDetailService.getAllVehicleDetails()
                                .then(response => {
                                    self.vehicleDetailTable = response.data
                                    self.loading = false
                                    self.successDialog = true
                                    self.errorDialog = false
                                })
                                .catch(function (error) {
                                    self.loading = false
                                    self.alertInfo = {success: false, error }
                                    self.successDialog = false
                                    self.errorDialog = true
                                })
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
                this.close()
            },
            initialize() {
                var self = this
                RiderService.getAllRiders()
                    .then(response => {
                        self.riders = response.data
                        self.successDialog = false
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
            }
        }
    }
</script>