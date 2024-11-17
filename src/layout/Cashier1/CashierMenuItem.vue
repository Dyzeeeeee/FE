<script setup>
import { useLayout } from '@/layout/composables/layout';
import { onBeforeMount, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const { layoutState, setActiveMenuItem, onMenuToggle } = useLayout();

const props = defineProps({
    item: {
        type: Object,
        default: () => ({})
    },
    index: {
        type: Number,
        default: 0
    },
    root: {
        type: Boolean,
        default: true
    },
    parentItemKey: {
        type: String,
        default: null
    }
});

const isActiveMenu = ref(false);
const itemKey = ref(null);

onBeforeMount(() => {
    itemKey.value = props.parentItemKey ? props.parentItemKey + '-' + props.index : String(props.index);

    const activeItem = layoutState.activeMenuItem;

    isActiveMenu.value = activeItem === itemKey.value || activeItem ? activeItem.startsWith(itemKey.value + '-') : false;
});

watch(
    () => layoutState.activeMenuItem,
    (newVal) => {
        isActiveMenu.value = newVal === itemKey.value || newVal.startsWith(itemKey.value + '-');
    }
);

function itemClick(event, item) {
    if (item.disabled) {
        event.preventDefault();
        return;
    }

    if ((item.to || item.url) && (layoutState.staticMenuMobileActive || layoutState.overlayMenuActive)) {
        onMenuToggle();
    }

    if (item.command) {
        item.command({ originalEvent: event, item: item });
    }

    const foundItemKey = item.items ? (isActiveMenu.value ? props.parentItemKey : itemKey) : itemKey.value;

    setActiveMenuItem(foundItemKey);
}

function checkActiveRoute(item) {
    return route.path === item.to;
}
</script>

<template>
    <li :class="{ 'layout-root-menuitem': root, 'active-menuitem': isActiveMenu }">
        <!-- Handling links without navigation (potentially having submenus) -->
        <a v-if="(!item.to || item.items) && item.visible !== false" :href="item.url || 'javascript:;'" @click="itemClick($event, item)" :class="item.class" :target="item.target" tabindex="0">
            <img v-if="item.avatar" :src="item.avatar" alt="Profile Avatar" class="profile-avatar" />
            <i v-else-if="item.icon" :class="item.icon" class="layout-menuitem-icon"></i>
            <div>
                <span class="layout-menuitem-text">{{ item.label }}</span>
                <span class="layout-menuitem-role" v-if="item.role">{{ item.role }}</span>
            </div>
            <i class="pi pi-fw pi-angle-down layout-submenu-toggler" v-if="item.items"></i>
        </a>
        <!-- Handling router-links for navigable items without submenus -->
        <router-link v-if="item.to && !item.items && item.visible !== false" @click.prevent="itemClick($event, item)" :to="item.to" :class="[item.class, { 'active-route': checkActiveRoute(item) }]" tabindex="0">
            <img v-if="item.avatar" :src="item.avatar" alt="Profile Avatar" class="profile-avatar" />
            <i v-else-if="item.icon" :class="item.icon" class="layout-menuitem-icon"></i>
            <div>
                <span class="layout-menuitem-text">{{ item.label }}</span>
                <span class="layout-menuitem-role" v-if="item.role">{{ item.role }}</span>
            </div>
            <i class="pi pi-fw pi-angle-down layout-submenu-toggler" v-if="item.items"></i>
        </router-link>
        <!-- Handling submenus if present -->
        <Transition v-if="item.items && item.visible !== false" name="layout-submenu">
            <ul v-show="root ? true : isActiveMenu" class="layout-submenu">
                <cashier-menu-item v-for="(child, i) in item.items" :key="child" :index="i" :item="child" :parentItemKey="itemKey" :root="false"></cashier-menu-item>
            </ul>
        </Transition>
    </li>
</template>

<style scoped>
.profile-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
    border: 2px solid #4caf50;
    padding: 2px;
}
.layout-menuitem-text {
    font-weight: bold;
}
.layout-menuitem-role {
    display: block;
    font-size: 0.9rem; /* Smaller font size for role */
    color: #a9a9a9; /* Lighter color for role */
    font-style: italic; /* Make the text italic */
}
</style>
