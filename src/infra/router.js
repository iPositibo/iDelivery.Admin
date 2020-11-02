import VueRouter from 'vue-router'
import LoginComponent from '../shared/login/login.component'
import BookingsComponent from '../components/booking/bookings.component'
import BookingStatusComponent from '../components/booking-status/booking-status.component'
import ActiveRidersComponent from '../components/active-riders/active-riders.component'
import RidersComponent from '../components/rider/riders.component'
import RiderStatusComponent from '../components/rider-status/rider-status.component'
import RiderRatingComponent from '../components/rider-rating/rider-rating.component'
import ActiveTransactionsComponent from '../components/active-transactions/active-transactions.component'
import UsersComponent from '../components/users/users.component'
import CustomersComponent from '../components/customer/customers.component'
import CustomerStatusComponent from '../components/customer-status/customer-status.component'
import CustomerRatingComponent from '../components/customer-rating/customer-rating.component'
import WalletComponent from '../components/wallets/wallets.component'
import WalletLogComponent from '../components/wallet-log/wallet-log.component'
import HomeComponent from '../components/home.component'
import FaresComponent from '../components/fare/fares.component'
import BookingHistoryCustomerComponent from '../components/booking-history-customer/booking-history-customer.component'
import BookingHistoryRiderComponent from '../components/booking-history-rider/booking-history-rider.component'
import BlockCustomerComponent from '../components/block-customer/block.customer.component'
import BlockRiderComponent from '../components/block-rider/block.rider.component'
import WalletStatusComponent from '../components/wallet-status/wallet-status.component'
import RolesComponent from '../components/roles/roles.component'
import MenuItemsComponent from '../components/menu-items/menu-items.component'
import MenuAccessComponent from '../components/menu-access/menu-access.component'
import VehicleDetailComponent from '../components/vehicle-detail/vehicle-detail.component'
import FAQComponent from '../components/faq/faq.component'
import TermsAndConditionsComponent from '../components/terms-and-conditions/terms-and-conditions.component'
import NotFoundComponent from '../shared/not-found/notfound.component'
import RegisterComponent from '../shared/register/register.component'
import AllowedLocationsComponent from '../components/allowed-locations/allowed-locations.component'
import AppRatingComponent from '../components/app-rating/app-rating.component'
import FeedbackComponent from '../components/feedback/feedback.component'
import AuthService from '../infra/auth.service'

const routes = [
    {
        path: '/',
        component: HomeComponent,
        meta: { protectedRoute: true }
    },
    {
        path: '/login',
        component: LoginComponent,
    },
    {
        path: '/register',
        component: RegisterComponent,
    },
    {
        path: '/menu-items',
        component: MenuItemsComponent,
    },
    {
        path: '/menu-access',
        component: MenuAccessComponent,
    },
    {
        path: '/bookings',
        component: BookingsComponent,
        meta: { protectedRoute: true }
    },
    {
        path: '/active-transactions',
        component: ActiveTransactionsComponent,
        meta: { protectedRoute: true }
    },
    {
        path: '/booking-status',
        component: BookingStatusComponent,
        meta: { protectedRoute: true }
    },
    {
        path: '/active-riders',
        component: ActiveRidersComponent,
        meta: { protectedRoute: true }
    },
    {
        path: '/rider',
        component: RidersComponent,
        meta: { protectedRoute: true }
    },
    {
        path: '/rider-status',
        component: RiderStatusComponent,
        meta: { protectedRoute: true }
    },
    {
        path: '/rider-rating',
        component: RiderRatingComponent,
        meta: { protectedRoute: true }
    },
    {
        path: '/users',
        component: UsersComponent,
        meta: { protectedRoute: true }
    },
    {
        path: '/role',
        component: RolesComponent,
        meta: { protectedRoute: true }
    },
    {
        path: '/customer',
        component: CustomersComponent,
        meta: { protectedRoute: true }
    },
    {
        path: '/customer-status',
        component: CustomerStatusComponent,
        meta: { protectedRoute: true }
    },
    {
        path: '/customer-rating',
        component: CustomerRatingComponent,
        meta: { protectedRoute: true }
    },
    {
        path: '/wallet',
        component: WalletComponent,
        meta: { protectedRoute: true }
    },
    {
        path: '/wallet-log',
        component: WalletLogComponent,
        meta: { protectedRoute: true }
    },
    {
        path: '/fares',
        component: FaresComponent,
        meta: { protectedRoute: true }
    },
    {
        path: '/booking-history-customer',
        component: BookingHistoryCustomerComponent,
        meta: { protectedRoute: true }
    },
    {
        path: '/booking-history-rider',
        component: BookingHistoryRiderComponent,
        meta: { protectedRoute: true }
    },
    {
        path: '/block-customer',
        component: BlockCustomerComponent,
        meta: { protectedRoute: true }
    },
    {
        path: '/block-rider',
        component: BlockRiderComponent,
        meta: { protectedRoute: true }
    },
    {
        path: '/wallet-status',
        component: WalletStatusComponent,
        meta: { protectedRoute: true }
    },
    {
        path: '/vehicle-detail',
        component: VehicleDetailComponent,
        meta: { protectedRoute: true }
    },
    {
        path: '/faqs',
        component: FAQComponent,
        meta: { protectedRoute: true }
    },
    {
        path: '/terms-and-conditions',
        component: TermsAndConditionsComponent,
        meta: { protectedRoute: true }
    },
    {
        path: '/app-rating',
        component: AppRatingComponent,
        meta: { protectedRoute: true }
    },
    {
        path: '/allowed-locations',
        component: AllowedLocationsComponent,
        meta: { protectedRoute: true }
    },
    {
        path: '/feedbacks',
        component: FeedbackComponent,
        meta: { protectedRoute: true }
    },
    {
        path: '*',
        component: NotFoundComponent
    },
]

const router = new VueRouter({ routes, mode: 'history'})

router.beforeEach((to, from, next) => {
    if (to.matched.some(routeItem => routeItem.meta.protectedRoute)) {
      if (!AuthService.isAuthenticated()) {
        return next('/login')
      }
    }
  
    next()
  })

export default router
