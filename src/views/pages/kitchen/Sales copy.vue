<template>
    <div class="gap-3 font-bold" style="height: 89vh">
        <div class="flex-wrap w-full h-full card">
            <div class="flex mb-3 text-3xl">My Sales</div>
            <div class="flex mb-3">
                <div class="flex flex-1 justify-start gap-2">
                    <Button icon="pi pi-filter" />
                    <IconField iconPosition="left">
                        <InputIcon>
                            <i class="pi pi-search" />
                        </InputIcon>
                        <InputText placeholder="Search..." style="width: 20rem" />
                    </IconField>
                </div>
                <div class="flex flex-1 justify-end gap-2">
                    <Button icon="pi pi-envelope" severity="info" label="Print" class="w-2" />
                    <Button icon="pi pi-user" severity="success" label="Download" />
                </div>
            </div>

            <div class="flex mb-3">
                <DataTable :value="orders" dataKey="id" class="w-full" tableStyle="min-width: 60rem" v-model:expandedRows="expandedRows" selectionMode="multiple" v-model:selection="selectedOrder" stripedRows>
                    <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                    <Column expander style="width: 4rem" />
                    <Column field="id" header="ID"> </Column>
                    <Column field="customer_name" header="Customer"> </Column>
                    <Column field="order_date" header="Order Date"> </Column>
                    <Column field="total_price" header="Total"> </Column>
                    <Column field="session_id" header="Session"> </Column>
                    <Column field="tendered" header="Tendered">
                        <template #body="slotProps">
                            {{ slotProps.data.tendered !== null ? slotProps.data.tendered : 'None yet' }}
                        </template>
                    </Column>
                    <Column field="change1" header="Change">
                        <template #body="slotProps">
                            {{ slotProps.data.change1 !== null ? Math.abs(slotProps.data.change1).toFixed(2) : 'None yet' }}
                        </template>
                    </Column>

                    <Column field="status" header="Status" style="width: 2rem">
                        <template #body="slotProps">
                            <Tag :value="slotProps.data.status" :severity="getSeverity(slotProps.data.status)" />
                        </template>
                    </Column>
                    <Column>
                        <template #body="slotProps">
                            <Button icon="pi pi-ellipsis-v" text plain rounded @click="toggle" aria-haspopup="true" aria-controls="overlay_menu"></Button>
                            <Menu ref="menu" id="overlay_menu" :model="items" :popup="true" />
                        </template>
                    </Column>
                    <template #expansion="slotProps">
                        <div class="px-5 mx-5">
                            <!-- <h5 class="text-400">Orders {{ slotProps.data.id }} Details</h5> -->
                            <DataTable :value="slotProps.data.details" selectionMode="multiple">
                                <Column field="menu_item_name" header="menu_item_id" sortable></Column>
                                <Column field="quantity" header="Quantity" sortable> </Column>
                                <Column field="subtotal" header="Subtotal" sortable></Column>
                            </DataTable>
                        </div>
                    </template>
                </DataTable>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
