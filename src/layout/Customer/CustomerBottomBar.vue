<template>
    <div class="fixed bottom-0 left-0 right-0 bg-gray-800 text-white flex justify-evenly text-xs">
        <!-- Home -->
        <div @click="$router.push('/customer')" class="flex-1 text-center p-2 cursor-pointer">
            <div :class="{ 'text-yellow-500': $route.path === '/customer' }">Home</div>
            <div class="flex justify-center">
                <Icon icon="ion:home" width="20" height="20"
                    :class="{ 'text-yellow-500': $route.path === '/customer' }" />
            </div>
        </div>

        <!-- Menu -->
        <div @click="$router.push('/customer/menu')" class="flex-1 text-center p-2 cursor-pointer">
            <div :class="{ 'text-yellow-500': $route.path === '/customer/menu' }">Menu</div>
            <div class="flex justify-center">
                <Icon icon="map:food" width="20" height="20"
                    :class="{ 'text-yellow-500': $route.path === '/customer/menu' }" />
            </div>
        </div>

        <!-- Rooms -->
        <div @click="$router.push('/customer/rooms')" class="flex-1 text-center p-2 cursor-pointer">
            <div :class="{ 'text-yellow-500': $route.path === '/customer/rooms' }">Rooms</div>
            <div class="flex justify-center">
                <Icon icon="cbi:roomslounge" width="20" height="20"
                    :class="{ 'text-yellow-500': $route.path === '/customer/rooms' }" />
            </div>
        </div>

        <!-- Profile -->
        <div @click="$router.push('/customer/profile')" class="flex-1 text-center p-2 cursor-pointer">
            <div :class="{ 'text-yellow-500': $route.path === '/customer/profile' }">Profile</div>
            <div class="flex justify-center">
                <Icon icon="iconamoon:profile-duotone" width="20" height="20"
                    :class="{ 'text-yellow-500': $route.path === '/customer/profile' }" />
            </div>
        </div>
    </div>
</template>
