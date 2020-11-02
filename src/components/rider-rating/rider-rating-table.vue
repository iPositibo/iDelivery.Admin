<template>
    <div>
        <div class="text-center">
            <v-dialog v-model="successDialog" width="400" transition="slide-y-reverse-transition">
                <v-card>
                    <v-card-title class="headline green">
                        <strong> Success! </strong>
                        <v-icon> mdi-check-bold </v-icon>
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
                        <strong> Whoops, that's an error!</strong>
                        <v-spacer></v-spacer>
                        <v-icon> mdi-alert-box </v-icon>
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
        <v-data-table :headers="tableHeaders" :items="riderRatingTable" sort-by="riderRatingId" class="elevation-1">
            <template v-slot:top>
                <v-toolbar flat color="white">
                    <v-toolbar-title>Rider Rating</v-toolbar-title>
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
                                                    v-model="editedItem.riderId" label="Rider"
                                                    :rules="[v => !!v || 'Rider is required']">
                                                </v-select>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-rating v-model="editedItem.rating" type="number" label="Star"
                                                    color="yellow darken-3"
                                                    background-color="grey darken-1"
                                                    empty-icon="$vuetify.icons.ratingFull" hover
                                                    :rules="['Required']"></v-rating>
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
    import RiderRatingService from './rider-rating.service';
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
                riderId: 0,
                rating: 0,
                dateCreated: new Date(),
            },
            defaultItem: {
                riderRatingId: 0,
                riderId: 0,
                rating: 0,
                dateCreated: new Date(),
            },
            interval: {},
            value: 0,
            loading: false,
            lazy: false,
            isValid: true,
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
            riderRatingTable: null,
            tableHeaders: null
        },
        computed: {
            formTitle() {
                return this.editedIndex === -1 ? 'New Rider rating' : 'Edit Rider rating'
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
                this.editedIndex = this.riderRatingTable.indexOf(item)
                this.editedItem = Object.assign({}, item)
                this.dialog = true
            },
            deleteItem(item) {
                const index = this.riderRatingTable.indexOf(item)
                const isConfirmed = confirm('Are you sure you want to delete this item?')

                if (isConfirmed) {
                    const self = this
                    RiderRatingService.deleteRiderRating(item.riderRatingId)
                        .then(() => {
                            self.successDialog = true
                            self.errorDialog = false
                            self.successMessage = "Rider Rating has been deleted successfully."
                            self.riderRatingTable.splice(index, 1)
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
                self.editedItem.riderId = parseInt(self.editedItem.riderId)
                self.editedItem.rating = parseInt(self.editedItem.rating)
                if (self.editedIndex > -1) {
                    RiderRatingService.editRiderRating(self.editedItem.riderRatingId, self.editedItem)
                        .then(() => {
                            self.loading = false
                            self.successDialog = true
                            self.errorDialog = false
                            self.successMessage = "Status has been updated successfully."
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

                    Object.assign(self.riderRatingTable[self.editedIndex], self.editedItem)

                } else {
                    RiderRatingService.addRiderRating(self.editedItem)
                        .then(() => {
                            self.loading = false
                            self.successMessage = "Rider Rating has been saved successfully."

                            RiderRatingService.getAllRiderRatings()
                                .then(response => {
                                    self.riderRatingTable = response.data
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
            initialize() {
                var self = this
                RiderService.getAllActiveRiders()
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
        },
    }
</script>