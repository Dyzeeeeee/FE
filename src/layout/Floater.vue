<template>
    <div class="fixed bottom-2 right-7 transform mb-4" style="z-index: 99999;">
        <SpeedDial :model="items" direction="up" :transitionDelay="80" :style="{ position: 'relative' }"
            pt:menuitem="m-2">
            <template #button="{ toggleCallback }">
                <Button @click="toggleCallback" style="background-color: black; outline: 1px solid white" rounded>
                    <Icon icon="oui:app-users-roles" height="30" width="30" class="text-white" />
                </Button>
            </template>
            <template #item="{ item, toggleCallback }">
                <Button style="background-color: white; outline: 1px solid black" rounded
                    class="flex flex-col items-center justify-between gap-2 p-2 border rounded w-20 cursor-pointer"
                    @click="navigate(item.route); toggleCallback">
                    <Icon :icon="item.icon" height="20" width="20" class="text-black" />
                    <span class="text-xs">
                        {{ item.label }}
                    </span>
                </Button>
            </template>
        </SpeedDial>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router';

const toast = useToast();
const router = useRouter();

const items = ref([
    {
        label: 'Customer',
        icon: 'bx:face',
        route: '/customer' // Corrected route for customer
    },
    {
        label: 'Staff',
        icon: 'mdi:bow-tie',
        route: '/staff' // Corrected route for staff
    },
    {
        label: 'Admin',
        icon: 'ic:baseline-admin-panel-settings',
        route: '/' // Corrected route for admin
    },
]);

const navigate = (route) => {
    router.push(route);
};
</script>