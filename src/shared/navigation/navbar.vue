<template>
    <v-app id="inspire">
        <div v-if="isAuthenticated.status === true">
            <v-app-bar :clipped-left="$vuetify.breakpoint.lgAndUp" :clipped-right="$vuetify.breakpoint.lgAndUp" app
                color="yellow darken-1" light elevation="7">
                <v-app-bar-nav-icon class="black--text" @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
                <v-toolbar-title style="width: 400px" class="ml-0 pl-4">
                    <span class="hidden-sm-and-down">
                        <router-link :to="'/'" id="vtoolbartitle">
                            <v-img width="80px" height="56px" :src="logo"></v-img>
                        </router-link>
                    </span>
                </v-toolbar-title>
                <v-spacer> </v-spacer>
                <v-btn light color="yellow darken-1">
                    <router-link :to="'/active-riders'" id="activeriders">
                        Active Riders
                    </router-link>
                </v-btn>
                <!-- <v-tooltip bottom color="yellow"> -->
                    <v-dialog v-model="dialog" persistent max-width="290">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn color="primary" dark icon large v-bind="attrs" v-on="on">
                                <v-avatar color="indigo" size="40">
                                    <!-- <router-link to="to" class="nav-link" @click.native="handleLogout()"> -->
                                    <router-link class="nav-link" to="">
                                    <span class="white--text headline"> {{ avatarName }}</span>
                                    </router-link>
                                </v-avatar>
                            </v-btn>
                        </template>
                        <v-card width="400">
                            <v-card-title class="headline">
                                Wait..
                            </v-card-title>
                            <v-card-text>Are you sure you want to logout?</v-card-text>
                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn color="red darken-1" text @click="dialog = false">
                                    Cancel
                                </v-btn>
                                <v-btn color="red darken-1" text @click.native="handleLogout()">
                                    Log Out
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                    <!-- <span class="black--text">Logout</span>
                </v-tooltip> -->
            </v-app-bar>

            <v-navigation-drawer v-model="drawer" :clipped="$vuetify.breakpoint.lgAndUp" height="100%" app floating
                width="18rem">
                <v-app id="inspire" class="grey darken-4">
                    <v-list dense shaped>

                        <template v-for="item in items">
                            <v-list-item :key="item.text" :to="item.link" link dark active-class="yellow darken-1">
                                <v-list-item-action>
                                    <v-icon>{{ item.icon }}</v-icon>
                                </v-list-item-action>
                                <v-list-item-content>
                                    <v-list-item-title>
                                        {{ item.text }}
                                    </v-list-item-title>
                                </v-list-item-content>
                            </v-list-item>
                        </template>

                        <v-list-group sub-group no-action active-class="yellow--text"
                            prepend-icon="mdi-menu-down white--text">
                            <template v-slot:activator>
                                <v-list-item-content>
                                    <v-list-item-title class="white--text">Customers</v-list-item-title>
                                </v-list-item-content>
                                <v-spacer> </v-spacer>
                                <v-icon class="white--text">mdi-account </v-icon>

                            </template>
                            <v-list-item v-for="(customer, i) in customers" :key="i" :to="customer.link" link dark
                                active-class="yellow--text">
                                <v-list-item-action>
                                    <v-icon>{{ customer.icon }} </v-icon>
                                </v-list-item-action>
                                <v-list-item-title>{{ customer.text }} </v-list-item-title>

                            </v-list-item>
                        </v-list-group>

                        <v-list-group sub-group no-action active-class="yellow--text"
                            prepend-icon="mdi-menu-down white--text">
                            <template v-slot:activator>
                                <v-list-item-content>
                                    <v-list-item-title class="white--text">Riders</v-list-item-title>
                                </v-list-item-content>
                                <v-spacer> </v-spacer>
                                <v-icon class="white--text">mdi-bike-fast</v-icon>

                            </template>
                            <v-list-item v-for="(rider, i) in riders" :key="i" :to="rider.link" link dark
                                active-class="yellow--text" ripple>
                                <v-list-item-action>
                                    <v-icon>{{ rider.icon }} </v-icon>
                                </v-list-item-action>
                                <v-list-item-title>{{ rider.text }} </v-list-item-title>

                            </v-list-item>
                        </v-list-group>

                        <v-list-group sub-group no-action active-class="yellow--text"
                            prepend-icon="mdi-menu-down white--text">
                            <template v-slot:activator>
                                <v-list-item-content>
                                    <v-list-item-title class="white--text">Bookings</v-list-item-title>
                                </v-list-item-content>
                                <v-spacer> </v-spacer>
                                <v-icon class="white--text">mdi-book-multiple</v-icon>

                            </template>
                            <v-list-item v-for="(booking, i) in bookings" :key="i" :to="booking.link" link dark
                                active-class="yellow--text" ripple>
                                <v-list-item-action>
                                    <v-icon>{{ booking.icon }} </v-icon>
                                </v-list-item-action>
                                <v-list-item-title>{{ booking.text }} </v-list-item-title>

                            </v-list-item>
                        </v-list-group>

                        <v-list-group sub-group no-action active-class="yellow--text"
                            prepend-icon="mdi-menu-down white--text">
                            <template v-slot:activator>
                                <v-list-item-content>
                                    <v-list-item-title class="white--text">Users</v-list-item-title>
                                </v-list-item-content>
                                <v-spacer> </v-spacer>
                                <v-icon class="white--text">mdi-account-group </v-icon>

                            </template>
                            <v-list-item v-for="(user, i) in users" :key="i" :to="user.link" link dark
                                active-class="yellow--text">
                                <v-list-item-action>
                                    <v-icon>{{ user.icon }} </v-icon>
                                </v-list-item-action>
                                <v-list-item-title>{{ user.text }} </v-list-item-title>

                            </v-list-item>
                        </v-list-group>

                        <v-list-group sub-group no-action active-class="yellow--text"
                            prepend-icon="mdi-menu-down white--text">
                            <template v-slot:activator>
                                <v-list-item-content>
                                    <v-list-item-title class="white--text">Menus</v-list-item-title>
                                </v-list-item-content>
                                <v-spacer> </v-spacer>
                                <v-icon class="white--text">mdi-menu </v-icon>

                            </template>
                            <v-list-item v-for="(menu, i) in menus" :key="i" :to="menu.link" link dark
                                active-class="yellow--text">
                                <v-list-item-action>
                                    <v-icon>{{ menu.icon }} </v-icon>
                                </v-list-item-action>
                                <v-list-item-title>{{ menu.text }} </v-list-item-title>

                            </v-list-item>
                        </v-list-group>

                    </v-list>
                </v-app>
            </v-navigation-drawer>
        </div>
        <v-main id="vmain" style="background-color: #e8e4c9">
            <v-container fluid align="center">
                <router-view @EventLoggedIn="EventLoggedInHandler"></router-view>
            </v-container>
        </v-main>
    </v-app>
</template>

<script>
    import MenuItemsService from '../../components/menu-items/menu-items.service'
    import AuthService from '../../infra/auth.service'
    import router from '../../infra/router'

    export default {
        props: {
            isAuthenticated: null
        },
        data() {
            return {
                logo: require("../../assets/navbarlogo.png"),
                dialog: false,
                drawer: false,
                items: [],
                customers: [],
                bookings: [],
                riders: [],
                avatarName: '',
                alertInfo: [],
                users: [],
                menus: [],
            }
        },
        created() {
            this.initialize()
        },
        methods: {
            handleLogout() {
                AuthService.logout()
                this.$emit("LogoutUser")
            },
            EventLoggedInHandler() {
                this.isAuthenticated.status = true;
                router.push({
                    path: "/"
                });

                this.initialize()
            },
            initialize() {
                var self = this
                self.customers = []
                self.items = []
                self.bookings = []
                self.riders = []
                self.users = []
                self.menus = []
                var roles = AuthService.getRole()
                if (roles != null) {
                    MenuItemsService.getMenuItemsByRoleId(roles[0].roleId)
                        .then(response => {
                            var result = response.data
                            for (var i = 0; i < result.length; i++) {
                                if (result[i].text.includes('Customer')) {
                                    self.customers.push(result[i])
                                } else if (result[i].text.includes('Rider')) {
                                    self.riders.push(result[i])
                                } else if (result[i].text.includes('Booking')) {
                                    self.bookings.push(result[i])
                                } else if (result[i].text.includes('User')) {
                                    self.users.push(result[i])
                                } else if (result[i].text.includes('Menu')) {
                                    self.menus.push(result[i])
                                } else {
                                    self.items.push(result[i])
                                }
                            }
                            var name = AuthService.getUsername()
                            self.avatarName = name.substring(0, 2)

                            self.errorDialog = false
                        })
                        .catch(function (error) {
                            self.alertInfo = {
                                success: false,
                                error
                            }
                            // self.$emit("LogoutUser")
                        })
                }

            }
        }
    }
</script>

<style scoped>
    #vtoolbartitle {
        text-decoration-line: none;
        color: rgb(0, 0, 0);
        font-weight: bold;
    }

    #vlist {
        font-weight: bolder;
    }

    #activeriders {
        text-decoration-line: none;
        color: black;
        font-weight: bold;
    }

    .nav-link {
        text-decoration-line: none;
    }
</style>