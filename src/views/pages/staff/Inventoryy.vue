<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';

const products = ref([]);

const getPercentage = (quantity, ideal) => (quantity / ideal) * 100;

const getBarColor = (percentage) => {
    if (percentage <= 30) return 'red';
    else if (percentage <= 70) return 'orange';
    else return 'green';
};

onMounted(async () => {
    try {
        const response = await axios.get('/get-food-stocks');
        products.value = response.data;
    } catch (error) {
        console.error("Failed to fetch products:", error);
    }
});
</script>




<template>
    <div class="grid grid-cols-12 gap-3 -m-3">
        <div class="col-span-12 lg:col-span-6 xl:col-span-12 xl:m-0 h-[80vh] flex flex-col justify-between">
            <div class="grid grid-cols-12 gap-2 xl:pb-7 pb-20">
                <!-- UI components for filtering and actions -->
                <div class="col-span-12 xl:flex hidden justify-between items-center mb-4">
                    <div class="flex-grow flex gap-2">
                        <Button size="small">
                            <Icon icon="uiw:filter" width="20" height="20" />
                        </Button>
                        <IconField iconPosition="left">
                            <InputIcon><i class="pi pi-search"></i></InputIcon>
                            <InputText v-model="searchTerm" placeholder="Search..." class="w-full"
                                style="width: 30rem;" />
                        </IconField>
                        <Button size="small">
                            <Icon icon="cil:list" width="20" height="20" />
                        </Button>
                    </div>
                    <Button class="w-auto ml-4" severity="success" @click="visible = true">
                        <Icon icon="mingcute:inventory-line" width="20" height="20" />
                        <div class="font-bold sm:block">Add</div>
                    </Button>
                </div>
                <!-- Data table for displaying products -->
                <div class="col-span-12">
                    <div class="col-span-12 xl:m-0 h-[80vh] flex flex-col justify-between">
                        <DataTable :value="products" dataKey="id" responsiveLayout="scroll">
                            <Column field="ingredient_name" header="Ingredient Name"></Column>
                            <Column field="quantity" header="Quantity"></Column>
                            <Column field="ideal" header="Ideal Quantity"></Column>
                            <Column field="unit_of_measurement" header="Unit"></Column>
                            <Column header="Stock Health">
                                <template #body="slotProps">
                                    <div class="progress-bar">
                                        <div class="progress-bar-value"
                                            :style="{ width: getPercentage(slotProps.data.quantity, slotProps.data.ideal) + '%', backgroundColor: getBarColor(getPercentage(slotProps.data.quantity, slotProps.data.ideal)) }">
                                            {{ getPercentage(slotProps.data.quantity, slotProps.data.ideal).toFixed(0)
                                            }}%
                                        </div>
                                    </div>
                                </template>
                            </Column>
                            <Column field="supplier_name" header="Supplier"></Column>

                        </DataTable>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.progress-bar {
    width: 100%;
    background-color: #e0e0e0;
    border-radius: 3px;
}

.progress-bar-value {
    height: 20px;
    line-height: 20px;
    color: white;
    text-align: center;
    border-radius: 3px;
}
</style>