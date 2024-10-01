<template>
    <div class="fixed bottom-0 left-0 right-0 bg-gray-800 text-white flex justify-evenly text-xs">
        <!-- Home -->
        <div @click="$router.push('/customer')" class="flex-1 text-center p-2 cursor-pointer">
            <div :class="{ 'text-yellow-500 font-bold text-sm': $route.path === '/customer' }">Home</div>
            <div class="flex justify-center">
                <Icon icon="ion:home" width="20" height="20"
                    :class="{ 'text-yellow-500': $route.path === '/customer' }" />
            </div>
        </div>

        <!-- Menu -->
        <div @click="$router.push('/customer/menu')" class="flex-1 text-center p-2 cursor-pointer">
            <div :class="{ 'text-yellow-500 font-bold text-sm': $route.path === '/customer/menu' }">Menu</div>
            <div class="flex justify-center">
                <Icon icon="map:food" width="20" height="20"
                    :class="{ 'text-yellow-500': $route.path === '/customer/menu' }" />
            </div>
        </div>

        <!-- <div @click="$router.push('/customer/notifications')" class="flex-1 text-center p-2 cursor-pointer">

            <div :class="{ 'text-yellow-500': $route.path === '/customer/notifications' }">Notifications</div>
            <div class="flex justify-center">
                <OverlayBadge severity="danger">
                    <Icon icon="quill:notifications" width="20" height="20"
                        :class="{ 'text-yellow-500': $route.path === '/customer/notifications' }" />
                </OverlayBadge>

            </div>

        </div> -->

        <!-- Rooms -->
        <div @click="$router.push('/customer/rooms')" class="flex-1 text-center p-2 cursor-pointer">
            <div :class="{ 'text-yellow-500 font-bold text-sm': $route.path === '/customer/rooms' }">Rooms</div>
            <div class="flex justify-center">
                <Icon icon="cbi:roomslounge" width="20" height="20"
                    :class="{ 'text-yellow-500': $route.path === '/customer/rooms' }" />
            </div>
        </div>

        <!-- Profile -->
        <div @click="$router.push('/customer/more')" class="flex-1 text-center p-2 cursor-pointer">
            <div :class="{ 'text-yellow-500 font-bold text-sm': $route.path === '/customer/more' }">More</div>
            <div class="flex justify-center">
                <Icon icon="icon-park-outline:more-app" width="20" height="20"
                    :class="{ 'text-yellow-500': $route.path === '/customer/more' }" />
            </div>
        </div>
    </div>
</template>
