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
        <v-data-table :headers="tableHeaders" :items="menuAccessTable" sort-by="menuAccessId" class="elevation-1">
            <template v-slot:top>
                <v-toolbar flat color="white">
                    <v-toolbar-title>Menu Access</v-toolbar-title>
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
                                            <v-col cols="6" sm="6" md="6">
                                                <v-select item-text="roleName" item-value="roleId" :items="roles"
                                                    v-model="editedItem.roleId"
                                                    :rules="[v => !!v || 'Role is required']" label="Role" required>
                                                </v-select>
                                            </v-col>
                                            <v-col cols="6" sm="6" md="6">
                                                <!-- <v-select item-text="text" item-value="menuItemId" :items="menuItems"
                                                    multiple v-model="editedItem.menuItemId" chips hint="Select Item"
                                                    persistent-hint :rules="[v => !!v || 'Menu Item is required']"
                                                    label="Menu Item" required> -->
                                                    <v-select item-text="text" item-value="menuItemId" :items="menuItems"
                                                    multiple
                                                    v-model="editedItem.menuItemId" hint="Select Item" persistent-hint
                                                    :rules="[v => !!v || 'Menu Item is required']" label="Menu Item" required>
                                                </v-select>
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
    import MenuAccessService from '../menu-access/menu-access.service'
    import RoleService from '../roles/roles.service'
    import MenuItemService from '../menu-items/menu-items.service'

    export default {
        data: () => ({
            roles: null,
            menuItems: null,
            alertInfo: [],
            dialog: false,
            successDialog: false,
            errorDialog: false,
            successMessage: "",
            editedIndex: -1,
            isValid: true,
            editedItem: {
                menuAccessId: 0,
                menuItemId: 0,
                menuItemName: '',
                roleId: 0,
                dateCreated: new Date(),
                dateUpdated: null
            },
            defaultItem: {
                menuAccessId: 0,
                menuItemId: 0,
                menuItemName: '',
                roleId: 0,
                dateCreated: new Date(),
                dateUpdated: null
            },
            lazy: false,
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
            menuAccessTable: null,
            tableHeaders: null
        },
        computed: {
            formTitle() {
                return this.editedIndex === -1 ? 'New menu access' : 'Edit menu access'
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
                this.editedIndex = this.menuAccessTable.indexOf(item)
                this.editedItem = Object.assign({}, item)
                this.dialog = true
            },
            deleteItem(item) {
                const index = this.menuAccessTable.indexOf(item)
                const isConfirmed = confirm('Are you sure you want to delete this item?')

                if (isConfirmed) {
                    const self = this
                    MenuAccessService.deleteMenuAccess(item.menuAccessId)
                        .then(() => {
                            self.successDialog = true
                            self.errorDialog = false
                            self.successMessage = "Menu Access has been deleted successfully."
                            self.menuAccessTable.splice(index, 1)
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
                self.editedItem.menuItemId = parseInt(self.editedItem.menuItemId);
                self.editedItem.roleId = parseInt(self.editedItem.roleId);
                if (self.editedIndex > -1) {
                    MenuAccessService.editMenuAccess(self.editedItem.menuAccessId, self.editedItem)
                        .then(() => {
                            self.loading = false
                            self.successDialog = true
                            self.errorDialog = false
                            self.successMessage = "Menu Access has been updated successfully."
                        })
                        .catch(function (error) {
                            self.loading = false
                            self.alertInfo = {
                                success: false,
                                error
                            }
                            self.successDialog = false
                            self.errorDialog = true
                        });
                    Object.assign(self.menuAccessTable[self.editedIndex], self.editedItem)

                } else {
                    MenuAccessService.addMenuAccess(self.editedItem)
                        .then(() => {
                            self.loading = false
                            self.successMessage = "Menu Access has been saved successfully."

                            MenuAccessService.getAllMenuAccess()
                                .then(response => {
                                    self.menuAccessTable = response.data
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
                MenuItemService.getAllMenuItems()
                    .then(response => {
                        self.menuItems = response.data
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

                RoleService.getAllRoles()
                    .then(response => {
                        self.roles = response.data
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