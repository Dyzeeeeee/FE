import AccountantLayout from '@/layout/Accountant/AccountantLayout.vue';
import AdminLayout from '@/layout/Admin/AdminLayout.vue';
import AppLayout from '@/layout/AppLayout.vue';
import CashierLayout from '@/layout/Cashier/CashierLayout.vue';
import CustomerLayout from '@/layout/Customer/CustomerLayout.vue';
import KitchenLayout from '@/layout/Kitchen/KitchenLayout.vue';
import StaffLayout from '@/layout/Staff/StaffLayout.vue';
import WaiterLayout from '@/layout/Waiter/WaiterLayout.vue';
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '/',
                    name: 'dashboard',
                    component: () => import('@/views/Dashboard.vue')
                },
                {
                    path: '/uikit/formlayout',
                    name: 'formlayout',
                    component: () => import('@/views/uikit/FormLayout.vue')
                },
                {
                    path: '/uikit/input',
                    name: 'input',
                    component: () => import('@/views/uikit/InputDoc.vue')
                },
                {
                    path: '/uikit/button',
                    name: 'button',
                    component: () => import('@/views/uikit/ButtonDoc.vue')
                },
                {
                    path: '/uikit/table',
                    name: 'table',
                    component: () => import('@/views/uikit/TableDoc.vue')
                },
                {
                    path: '/uikit/list',
                    name: 'list',
                    component: () => import('@/views/uikit/ListDoc.vue')
                },
                {
                    path: '/uikit/tree',
                    name: 'tree',
                    component: () => import('@/views/uikit/TreeDoc.vue')
                },
                {
                    path: '/uikit/panel',
                    name: 'panel',
                    component: () => import('@/views/uikit/PanelsDoc.vue')
                },

                {
                    path: '/uikit/overlay',
                    name: 'overlay',
                    component: () => import('@/views/uikit/OverlayDoc.vue')
                },
                {
                    path: '/uikit/media',
                    name: 'media',
                    component: () => import('@/views/uikit/MediaDoc.vue')
                },
                {
                    path: '/uikit/message',
                    name: 'message',
                    component: () => import('@/views/uikit/MessagesDoc.vue')
                },
                {
                    path: '/uikit/file',
                    name: 'file',
                    component: () => import('@/views/uikit/FileDoc.vue')
                },
                {
                    path: '/uikit/menu',
                    name: 'menu',
                    component: () => import('@/views/uikit/MenuDoc.vue')
                },
                {
                    path: '/uikit/charts',
                    name: 'charts',
                    component: () => import('@/views/uikit/ChartDoc.vue')
                },
                {
                    path: '/uikit/misc',
                    name: 'misc',
                    component: () => import('@/views/uikit/MiscDoc.vue')
                },
                {
                    path: '/uikit/timeline',
                    name: 'timeline',
                    component: () => import('@/views/uikit/TimelineDoc.vue')
                },
                {
                    path: '/pages/empty',
                    name: 'empty',
                    component: () => import('@/views/pages/Empty.vue')
                },
                {
                    path: '/pages/crud',
                    name: 'crud',
                    component: () => import('@/views/pages/Crud.vue')
                },
                {
                    path: '/documentation',
                    name: 'documentation',
                    component: () => import('@/views/pages/Documentation.vue')
                }
            ]
        },
        {
            path: '/staff',
            component: StaffLayout,
            meta: { role: 'staff' }, // Protect this route for staff only

            children: [
                {
                    path: '/staff/home',
                    name: 'staff-home',
                    component: () => import('@/views/pages/staff/Home.vue')
                },
                {
                    path: '/staff/pos',
                    name: 'staff-POS',
                    component: () => import('@/views/pages/staff/POS.vue')
                },
                {
                    path: '/staff/pos/Sell/:id',
                    name: 'staff-POSSell',
                    component: () => import('@/views/pages/staff/POSSell.vue')
                },
                {
                    path: '/staff/Sales',
                    name: 'staff-Sales',
                    component: () => import('@/views/pages/staff/Sales.vue')
                },
                {
                    path: '/staff/Tasks',
                    name: 'staff-tasks',
                    component: () => import('@/views/pages/staff/Tasks.vue')
                },
                {
                    path: '/staff/Kitchen',
                    name: 'staff-kitchen',
                    component: () => import('@/views/pages/staff/Kitchen.vue')
                },
                {
                    path: '/staff/Profile',
                    name: 'staff-Profile',
                    component: () => import('@/views/pages/staff/Profile.vue')
                },
                {
                    path: '/staff/inventory',
                    name: 'staff-inventory',
                    component: () => import('@/views/pages/staff/Inventoryy.vue')
                },
                {
                    path: '/staff/customers',
                    name: 'staff-customers',
                    component: () => import('@/views/pages/staff/Customers.vue')
                },
                {
                    path: '/staff/settings',
                    name: 'staff-settings',
                    component: () => import('@/views/pages/staff/Settings.vue')
                },
                {
                    path: '/staff/Reservations',
                    name: 'staff-Reservations',
                    component: () => import('@/views/pages/staff/Reservations.vue')
                }
            ]
        },
        {
            path: '/waiter',
            component: WaiterLayout,
            meta: { role: 'waiter' },

            children: [
                {
                    path: '/waiter/home',
                    name: 'waiter-home',
                    component: () => import('@/views/pages/waiter/Home.vue')
                },
                {
                    path: '/waiter/orders',
                    name: 'waiter-orders',
                    component: () => import('@/views/pages/waiter/Orders.vue')
                },
                {
                    path: '/waiter/More',
                    name: 'waiter-More',
                    component: () => import('@/views/pages/waiter/More.vue')
                },
                {
                    path: '/waiter/notes',
                    name: 'waiter-notes',
                    component: () => import('@/views/pages/waiter/Notes.vue')
                },
                {
                    path: '/waiter/takeorder',
                    name: 'waiter-takeorder',
                    component: () => import('@/views/pages/waiter/TakeOrder.vue')
                }
            ]
        },
        {
            path: '/cashier',
            component: CashierLayout,
            meta: { role: 'cashier' },

            children: [
                {
                    path: '/cashier/home',
                    name: 'cashier-home',
                    component: () => import('@/views/pages/cashier/Home.vue')
                },
                {
                    path: '/cashier/orders',
                    name: 'cashier-orders',
                    component: () => import('@/views/pages/cashier/Orders.vue')
                },
                {
                    path: '/cashier/More',
                    name: 'cashier-More',
                    component: () => import('@/views/pages/cashier/More.vue')
                },
                {
                    path: '/cashier/requests',
                    name: 'cashier-requests',
                    component: () => import('@/views/pages/cashier/Requests.vue')
                },
                {
                    path: '/cashier/takeorder',
                    name: 'cashier-takeorder',
                    component: () => import('@/views/pages/cashier/TakeOrder.vue')
                }
            ]
        },
        {
            path: '/accountant',
            component: AccountantLayout,
            meta: { role: 'accountant' },

            children: [
                {
                    path: '/accountant/home',
                    name: 'accountant-home',
                    component: () => import('@/views/pages/accountant/Home.vue')
                },
                {
                    path: '/accountant/orders',
                    name: 'accountant-orders',
                    component: () => import('@/views/pages/accountant/Orders.vue')
                },
                {
                    path: '/accountant/history',
                    name: 'accountant-history',
                    component: () => import('@/views/pages/accountant/History.vue')
                },
                {
                    path: '/accountant/more',
                    name: 'accountant-more',
                    component: () => import('@/views/pages/accountant/More.vue')
                },
                {
                    path: '/accountant/sales',
                    name: 'accountant-Sales',
                    component: () => import('@/views/pages/accountant/Sales.vue')
                }
            ]
        },
        {
            path: '/admin',
            component: AdminLayout,
            meta: { role: 'admin' },

            children: [
                {
                    path: '/admin/home',
                    name: 'admin-home',
                    component: () => import('@/views/pages/admin/Home.vue')
                },
                {
                    path: '/admin/orders',
                    name: 'admin-orders',
                    component: () => import('@/views/pages/admin/Orders.vue')
                },
                {
                    path: '/admin/history',
                    name: 'admin-history',
                    component: () => import('@/views/pages/admin/History.vue')
                },
                {
                    path: '/admin/more',
                    name: 'admin-more',
                    component: () => import('@/views/pages/admin/More.vue')
                },
                {
                    path: '/admin/sales',
                    name: 'admin-Sales',
                    component: () => import('@/views/pages/admin/Sales.vue')
                }
            ]
        },
        {
            path: '/kitchen',
            component: KitchenLayout,
            meta: { role: 'kitchen' },

            children: [
                {
                    path: '/kitchen/home',
                    name: 'kitchen-home',
                    component: () => import('@/views/pages/kitchen/Home.vue')
                },
                {
                    path: '/kitchen/orders',
                    name: 'kitchen-orders',
                    component: () => import('@/views/pages/kitchen/Orders.vue')
                },
                {
                    path: '/kitchen/history',
                    name: 'kitchen-history',
                    component: () => import('@/views/pages/kitchen/History.vue')
                },
                {
                    path: '/kitchen/more',
                    name: 'kitchen-more',
                    component: () => import('@/views/pages/kitchen/More.vue')
                }
            ]
        },
        {
            path: '/inventory',
            name: 'inventory',
            component: () => import('@/views/pages/staff/Inventory.vue')
        },
        {
            path: '/cust',
            name: 'cust',
            component: () => import('@/views/pages/staff/Customers.vue')
        },
        {
            path: '/:pathMatch(.*)*', // or simply use '*' in Vue Router 3
            name: 'notfound',
            component: () => import('@/views/pages/NotFound.vue')
        },

        {
            path: '/customer',
            component: CustomerLayout,
            meta: { role: 'customer' }, // Protect this route for customers only
            children: [
                {
                    path: '/customer',
                    name: 'customer-home',
                    component: () => import('@/views/pages/customer/Home.vue')
                },
                {
                    path: '/customer/Profile',
                    name: 'customer-profile',
                    component: () => import('@/views/pages/customer/Profile.vue')
                },
                {
                    path: '/customer/Menu',
                    name: 'customer-menu',
                    component: () => import('@/views/pages/customer/Menu.vue')
                },
                {
                    path: '/customer/Rooms',
                    name: 'customer-rooms',
                    component: () => import('@/views/pages/customer/Rooms.vue')
                },
                {
                    path: '/customer/more',
                    name: 'customer-more',
                    component: () => import('@/views/pages/customer/More.vue')
                },
                {
                    path: '/customer/track-order/:id',
                    name: 'customer-track-order',
                    component: () => import('@/views/pages/customer/TrackOrder.vue')
                },
                {
                    path: '/customer/notifications',
                    name: 'customer-notifications',
                    component: () => import('@/views/pages/customer/Notifications.vue')
                }
            ]
        },
        {
            path: '/landing',
            name: 'landing',
            component: () => import('@/views/pages/Landing.vue')
        },
        // {
        //     path: '/pages/notfound',
        //     name: 'notfound',
        //     component: () => import('@/views/pages/NotFound.vue')
        // },

        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue')
        },
        {
            path: '/auth/signup',
            name: 'signup',
            component: () => import('@/views/pages/auth/Signup.vue')
        },
        {
            path: '/auth/welcome',
            name: 'welcome',
            component: () => import('@/views/pages/auth/Welcome.vue')
        },
        {
            path: '/auth/access',
            name: 'accessDenied',
            component: () => import('@/views/pages/auth/Access.vue')
        },
        {
            path: '/auth/error',
            name: 'error',
            component: () => import('@/views/pages/auth/Error.vue')
        }
    ]
});
router.beforeEach((to, from, next) => {
    const publicPages = ['/auth/login', '/auth/signup', '/auth/welcome', '/customer', '/customer/menu'];

    const authRequired = !publicPages.includes(to.path);
    const token = sessionStorage.getItem('token') || localStorage.getItem('token');
    const role = sessionStorage.getItem('role') || localStorage.getItem('role');

    if (token && publicPages.includes(to.path)) {
        if ((to.path === '/customer', '/customer/menu')) {
            // Allow public access to the customer home without redirection
            return next();
        } else {
            // Redirect to a default secure page based on role or to the dashboard
            const redirectTo =
                role === 'customer'
                    ? '/customer'
                    : role === 'staff'
                      ? '/staff'
                      : role === 'waiter'
                        ? '/waiter'
                        : role === 'kitchen'
                          ? '/accountant'
                          : role === 'accountant'
                            ? '/accountant'
                            : role === 'cashier'
                              ? '/cashier'
                              : role === 'admin'
                                ? '/admin'
                                : '/';
            return next(redirectTo);
        }
    }

    if (authRequired && !token) {
        // Navigate to welcome page if not logged in and accessing a protected route
        next('/auth/welcome');
    } else if (authRequired && token) {
        // Role-based access control for authenticated paths
        const routeRole = to.meta?.role;
        if (routeRole && routeRole !== role) {
            next({ name: 'accessDenied' });
        } else {
            next();
        }
    } else {
        // Proceed to public routes
        next();
    }
});

export default router;
