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
        <v-data-table :headers="tableHeaders" :items="bookingStatusTable" sort-by="bookingStatusId" class="elevation-1">
            <template v-slot:item.bookingStatusName="{ item }">
                <v-chip class="ma-2" :color="item.statusColor" text-color="white">{{ item.bookingStatusName }}</v-chip>
            </template>
            <template v-slot:top>
                <v-toolbar flat color="white">
                    <v-toolbar-title>Booking Status</v-toolbar-title>
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
                                            <v-col cols="12" sm="6" md="20">
                                                <v-textarea single-line auto-grow rows="1"
                                                    v-model="editedItem.bookingStatusName" type="text"
                                                    :rules="bookingStatusRules" label="Status"  required>
                                                </v-textarea>
                                            </v-col>
                                            <!-- <v-col cols="12" sm="6" md="20">
                                                <v-select v-model="editedItem.statusColor" :items="colors"
                                                    label="Status Color" dense>
                                                </v-select>
                                            </v-col> -->

                                            <v-col cols="12" sm="6" md="20" class="shrink" style="min-width: 220px;">
                                                <v-text-field v-model="editedItem.statusColor" v-mask="mask" hide-details
                                                    class="ma-0 pa-0" solo>
                                                    <template v-slot:append>
                                                        <v-menu v-model="menu" top nudge-bottom="105" nudge-left="16"
                                                            :close-on-content-click="false">
                                                            <template v-slot:activator="{ on }">
                                                                <div :style="swatchStyle" v-on="on" />
                                                            </template>
                                                            <v-card>
                                                                <v-card-text class="pa-0">
                                                                    <v-color-picker v-model="editedItem.statusColor" flat />
                                                                </v-card-text>
                                                            </v-card>
                                                        </v-menu>
                                                    </template>
                                                </v-text-field>
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
    </div>
</template>

<script>
    import BookingStatusService from './booking-status.service'

    export default {
        data: () => ({
            successDialog: false,
            errorDialog: false,
            successMessage: "",
            alertInfo: [],
            dialog: false,
            isValid: true,
            editedIndex: -1,
            editedItem: {
                bookingStatusId: 0,
                bookingStatusName: "",
                statusColor: "#1976D2FF",
            },
            defaultItem: {
                bookingStatusId: 0,
                bookingStatusName: "",
                statusColor: "#1976D2FF",
            },
            lazy: false,
            bookingStatusRules: [
                v => !!v || 'Booking Status Name is required',
                v => (v && v.length <= 40) || 'Booking Status Name must be less than 40 characters',
            ],
            interval: {},
            value: 0,
            loading: false,
            // color: '#1976D2FF',
            mask: '!#XXXXXXXX',
            menu: false,
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
            bookingStatusTable: null,
            tableHeaders: null
        },
        computed: {
            formTitle() {
                return this.editedIndex === -1 ? 'New Status' : 'Edit Status'
            },
            swatchStyle() {
                const {
                    // color,
                    menu
                } = this
                return {
                    backgroundColor: this.editedItem.statusColor,
                    cursor: 'pointer',
                    height: '30px',
                    width: '30px',
                    borderRadius: menu ? '50%' : '4px',
                    transition: 'border-radius 200ms ease-in-out'
                }
            }
        },
        watch: {
            dialog(val) {
                val || this.close()
            },
        },
        methods: {
            editItem(item) {
                this.editedIndex = this.bookingStatusTable.indexOf(item)
                this.editedItem = Object.assign({}, item)
                this.dialog = true
            },
            deleteItem(item) {
                const index = this.bookingStatusTable.indexOf(item)
                const isConfirmed = confirm('Are you sure you want to delete this item?')

                if (isConfirmed) {
                    const self = this
                    BookingStatusService.deleteBookingStatus(item.bookingStatusId)
                        .then(() => {
                            self.successDialog = true
                            self.errorDialog = false
                            self.successMessage = "Status has been deleted successfully."
                            self.bookingStatusTable.splice(index, 1)
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
                self.editedItem.bookingStatusId = parseInt(self.editedItem.bookingStatusId)
                if (this.editedIndex > -1) {
                    BookingStatusService.editBookingStatus(self.editedItem.bookingStatusId, self.editedItem)
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

                    Object.assign(self.bookingStatusTable[self.editedIndex], self.editedItem)
                } else {
                    BookingStatusService.addBookingStatus(self.editedItem)
                        .then(() => {
                            self.loading = false
                            self.successMessage = "Status has been saved successfully."

                            BookingStatusService.getAllBookingStatuses()
                                .then(response => {
                                    self.bookingStatusTable = response.data
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

<style scoped>
    tbody tr:nth-of-type(odd) {
        background-color: rgba(0, 0, 0, .05);
    }
</style>