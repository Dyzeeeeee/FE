<template>
    <div class="grid grid-cols-12 gap-3 -m-3">
        <div class="col-span-12 lg:col-span-6 xl:col-span-12 -mx-7 -my-7 xl:m-0">
            <div class="card mb-0 h-[85vh] sm:p-4 xl:p-8">
                <div class="grid grid-cols-12 mb-4 gap-2">
                    <div class="col-span-8 xl:col-span-5 mb-2">
                        <div class="flex flex-1 justify-start gap-2 font-bold">
                            <div class="xl:block">

                                <Button class="w-1/7" size="small">
                                    <Icon icon="uiw:filter" width="20" height="20" />
                                </Button>
                            </div>
                            <IconField iconPosition="left" class="w-full">
                                <InputIcon>
                                    <i class="pi pi-search" />
                                </InputIcon>
                                <InputText v-model="searchTerm" placeholder="Search..." class="w-full" />
                            </IconField>
                        </div>
                    </div>
                    <div class="col-span-4 xl:col-span-7">
                        <div class="flex flex-1 justify-end gap-2">
                            <Button severity="info" class="w-full xl:w-auto" size="small">
                                <Icon icon="ic:outline-print" width="20" height="20" />
                                <div class="font-bold hidden sm:block">Print</div>
                            </Button>
                            <Button class="w-full xl:w-auto" severity="success" size="small">
                                <Icon icon="material-symbols:download-sharp" width="20" height="20" />
                                <div class="font-bold hidden sm:block">Download</div>
                            </Button>
                        </div>
                    </div>
                    <div class="col-span-12 xl:col-span-12 mb-2">
                        <DataTable :value="orders" dataKey="id" class="w-full" tableStyle="min-width: 60rem"
                            v-model:expandedRows="expandedRows" selectionMode="multiple"
                            v-model:selection="selectedOrder" stripedRows>
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
                                    {{ slotProps.data.change1 !== null ? Math.abs(slotProps.data.change1).toFixed(2) :
                                        'None yet' }}
                                </template>
                            </Column>

                            <Column field="status" header="Status" style="width: 2rem">
                                <template #body="slotProps">
                                    <Tag :value="slotProps.data.status"
                                        :severity="getSeverity(slotProps.data.status)" />
                                </template>
                            </Column>
                            <Column>
                                <template #body="slotProps">
                                    <Button icon="pi pi-ellipsis-v" text plain rounded @click="toggle"
                                        aria-haspopup="true" aria-controls="overlay_menu" size="small"></Button>
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
        </div>
    </div>
</template>

<style scoped></style>
