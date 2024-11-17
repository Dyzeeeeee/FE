<script setup></script>

<template>
    <div class="flex gap-3 font-bold" style="height: 89vh">
        <div class="w-8 card h-full flex-wrap">
            <div class="flex mb-3">
                <div class="flex flex-1 justify-start gap-2">
                    <Button icon="pi pi-filter" />
                    <IconField iconPosition="left">
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText v-model="searchTerm" placeholder="Search menu items..." />
                    </IconField>
                    <Button icon="pi pi-list" />
                </div>
                <div class="flex flex-1 justify-end gap-2">
                    <Button icon="pi pi-envelope" severity="info" label="Note" />
                    <Button icon="pi pi-user" severity="info" label="Customer" />
                    <Button icon="pi pi-plus" label="New Order" />
                </div>
            </div>
            <div class="flex gap-2 pb-3" style="overflow-x: auto; white-space: no-wrap">
                <Button rounded style="min-width: 10rem">All</Button>
                <Button rounded style="min-width: 10rem" outlined>Cold Drinks</Button>
                <Button rounded style="min-width: 10rem" outlined>Alcoholic Drinks</Button>
                <Button rounded style="min-width: 10rem" outlined>Mixed Cocktails</Button>
                <Button rounded style="min-width: 10rem" outlined>Hot Drinks</Button>
                <Button rounded style="min-width: 10rem" outlined>Hot Drinks</Button>
                <Button rounded style="min-width: 10rem" outlined>Hot Drinks</Button>
                <Button rounded style="min-width: 10rem" outlined>Hot Drinks</Button>
                <Button rounded style="min-width: 10rem" outlined>Hot Drinks</Button>
                <Button rounded style="min-width: 10rem" outlined>Hot Drinks</Button>
                <Button rounded style="min-width: 10rem" outlined>Hot Drinks</Button>
                <Button rounded style="min-width: 10rem" outlined>Hot Drinks</Button>
                <Button rounded style="min-width: 10rem" outlined>Hot Drinks</Button>
                <Button rounded style="min-width: 10rem" outlined>Hot Drinks</Button>
                <Button rounded style="min-width: 10rem" outlined>Hot Drinks</Button>
            </div>
        </div>
        <div class="w-4 h-full card flex flex-col justify-content-between">
            <div>
                <div class="flex mb-3">
                    <div class="flex flex-1 justify-start">
                        <span class="font-bold text-2xl">Order #1234</span>
                    </div>
                    <div class="flex flex-1 justify-end gap-2">
                        <Button icon="pi pi-folder" severity="info" label="Orders" />
                    </div>
                </div>
                <div class="flex mb-3 gap-2">
                    <Button rounded style="max-width: 10rem">Dine in</Button>
                    <Button rounded style="max-width: 10rem" outlined>Take out</Button>
                </div>
                <div class="flex mb-3 gap-2">
                    <!-- Data Table here containing Item, Quantity, Subtotal, and an extra column -->
                    <div>Data Table content here</div>
                </div>
            </div>
            <div class="flex-wrap mb-3 gap-2">
                <div class="flex mb-3">
                    <div class="flex flex justify-start pr-4">
                        <span class="font-bold text-2xl">Total Price</span>
                    </div>
                    <div class="flex-1 align-items-end text-end gap-2 align-self-end">
                        <span class="font-bold text-2xl">P 1000</span>
                    </div>
                </div>
                <div class="flex justify-content-end">
                    <div class="flex-1 text-end">
                        <Button severity="warn" outlined icon="pi pi-window-minimize" class="mr-2" label="Hold Order"></Button>
                        <Button severity="success" icon="pi pi-wallet" label="Proceed to Payment"></Button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style></style>
