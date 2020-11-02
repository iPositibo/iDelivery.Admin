<template>
    <div>
        <v-data-table :headers="tableHeaders" :items="faresTable" sort-by="fareId" class="elevation-1">
            <template v-slot:top>
                <v-toolbar flat color="white">
                    <v-toolbar-title>Fare</v-toolbar-title>
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
                                            <v-text-field v-model="editedItem.baseFare" type="number" label="Base Fare"
                                               :rules="faresRules" suffix="Php"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-text-field v-model="editedItem.totalBaseKilometers" type="number"
                                               :rules="faresRules" suffix="Km" label="Total Base Kilometers"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-text-field v-model="editedItem.surcharge" type="number" label="Surcharge"
                                               :rules="faresRules" suffix="Php"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-text-field v-model="editedItem.pricePerKilometer" type="number"
                                               :rules="faresRules" label="Price Per Kilometer" suffix="Php"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-text-field v-model="editedItem.ridersPercentage" type="number" suffix="%"
                                                hint="Up to 100% only" label="Riders Percentage"
                                                oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                                              :rules="faresRules"  maxlength="3"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-text-field v-model="editedItem.companyPercentage" type="percent"
                                                suffix="%" hint="Up to 100% only" label="Company Percentage"
                                                oninput="javascript: if (this.value.length > this.maxLength) this.value = this.value.slice(0, this.maxLength);"
                                               :rules="faresRules" maxlength="4"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-switch label="Default" v-model="editedItem.isDefault">
                                            </v-switch>
                                        </v-col>
                                    </v-row>
                                    </v-form>
                                </v-container>
                            </v-card-text>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
                                <v-btn color="blue darken-1" :disabled="!isValid" text @click="save">Save</v-btn>
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
    </div>
</template>

<script>
    import FaresService from './fares.service'

    export default {
        data: () => ({
            successDialog: false,
            errorDialog: false,
            successMessage: "",
            alertInfo: [],
            dialog: false,
            editedIndex: -1,
            editedItem: {
                fareId: 0,
                baseFare: "",
                totalBaseKilometers: "",
                surcharge: "",
                pricePerKilometer: "",
                ridersPercentage: "",
                companyPercentage: "",
                isDefault: false
            },
            defaultItem: {
                fareId: 0,
                baseFare: 0,
                totalBaseKilometers: "",
                surcharge: 0,
                pricePerKilometer: 0,
                ridersPercentage: "",
                companyPercentage: "",
                isDefault: false
            },
            interval: {},
            value: 0,
            loading: false,
            lazy: false,
            isValid: true,
            faresRules: [
                v => !!v || 'This is required',
                v => (v && v.length <= 40) || 'This must be less than 40 characters',
            ],
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
            faresTable: null,
            tableHeaders: null
        },
        computed: {
            formTitle() {
                return this.editedIndex === -1 ? 'New Fare' : 'Edit Fare'
            },
        },
        watch: {
            dialog(val) {
                val || this.close()
            },
        },
        methods: {
            editItem(item) {
                this.editedIndex = this.faresTable.indexOf(item)
                this.editedItem = Object.assign({}, item)
                this.dialog = true
            },
            deleteItem(item) {
                const index = this.faresTable.indexOf(item)
                const isConfirmed = confirm('Are you sure you want to delete this item?') 

                if(isConfirmed){
                    const self = this
                    FaresService.deleteFare(item.fareId)
                        .then(() => {
                            self.successDialog = true
                            self.errorDialog = false
                            self.successMessage = "Fare has been deleted successfully."
                            self.faresTable.splice(index, 1)
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
                self.editedItem.baseFare = parseInt(self.editedItem.baseFare, 10)
                self.editedItem.surcharge = parseInt(self.editedItem.surcharge, 10)
                self.editedItem.pricePerKilometer = parseInt(self.editedItem.pricePerKilometer, 10)
                if (self.editedIndex > -1) {
                    FaresService.editFare(self.editedItem.fareId, self.editedItem)
                        .then(() => {
                            self.loading = false
                            self.successDialog = true
                            self.errorDialog = false
                            self.successMessage = "Fare has been updated successfully."
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

                    Object.assign(self.faresTable[self.editedIndex], self.editedItem)

                } else {
                    let self = this

                    FaresService.addFare(self.editedItem)
                        .then(() => {
                            self.loading = false
                            self.successMessage = "Fare has been saved successfully."

                            FaresService.getAllFares()
                                .then(response => {
                                    self.faresTable = response.data
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
        }
    }
</script>