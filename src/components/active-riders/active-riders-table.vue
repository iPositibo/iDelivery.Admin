<template>
    <div>
        <v-data-table :headers="tableHeaders" :items="activeRiderTable" sort-by="riderId" class="elevation-1"
            :search="search">
            <template v-slot:item.photoUrl="{ item }">
                <div class="p-2">
                    <v-img :src="item.photoUrl" :alt="item.name" width="50px" height="50px"></v-img>
                </div>
            </template>
            <template v-slot:top>
                <v-toolbar flat color="white">
                    <v-toolbar-title>Active Riders</v-toolbar-title>
                    <v-divider class="mx-4" inset vertical></v-divider>
                    <v-text-field v-model="search" append-icon="mdi-magnify" placeholder="Search"
                        class="shrink yellow darken-1" clear-icon="mdi-close-circle-outline" clearable rounded
                        single-line hide-details>
                    </v-text-field>
                    <v-spacer></v-spacer>
                </v-toolbar>
            </template>
        </v-data-table>
    </div>
</template>

<script>
    export default {
        data: () => ({
            statuses: null,
            ratings: null,
            users: null,
            dialog: false,
            editedIndex: -1,
            search: '',
            isvalid: true,
            editedItem: {
                riderId: 0,
                firstName: "",
                lastName: "",
                photoUrl: "",
                email: "",
                contactNumber: "",
                address: "",
                riderStatusId: 0,
                ratingId: null,
                userId: null
            },
            defaultItem: {
                riderId: 0,
                firstName: "",
                lastName: "",
                photoUrl: "",
                email: "",
                contactNumber: "",
                address: "",
                riderStatusId: 0,
                ratingId: null,
                userId: null
            },
            lazy: false,
            firstNameRules: [
                v => !!v || 'First Name is required',
                v => (v && v.length <= 40) || 'Name must be less than 40 characters',
            ],
            lastNameRules: [
                v => !!v || 'Last Name is required',
                v => (v && v.length <= 40) || 'Last Name must be less than 40 characters',
            ],
            photoUrlRules: [
                v => !!v || 'Photo URL is required',
            ],
            emailRules: [
                v => !!v || 'Email Address is required',
                v => (v && v.length <= 30) || 'Email Address must be less than 30 characters',
            ],
            contactNumberRules: [
                v => !!v || 'Contact Number is required',
            ],
            addressRules: [
                v => !!v || 'Address is required',
                v => (v && v.length <= 100) || 'Address must be less than 100 characters',
            ],
        }),
        props: {
            activeRiderTable: null,
            tableHeaders: null
        },
        computed: {
            formTitle() {
                return this.editedIndex === -1 ? 'New Rider' : 'Edit Rider'
            },
        },
        watch: {
            dialog(val) {
                val || this.close()
            },
        },
        methods: {
            close() {
                this.dialog = false
                this.$nextTick(() => {
                    this.editedItem = Object.assign({}, this.defaultItem)
                    this.editedIndex = -1
                })
            }
        }
    }
</script>