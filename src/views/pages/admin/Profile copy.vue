<template>
    <div class="flex gap-3">
        <div class="flex-wrap w-9">
            <div class="flex-1 mb-3">
                <Card style="overflow: hidden; position: relative">
                    <template #header>
                        <div class="card-header-image">
                            <img alt="user header" src="https://timelinecovers.pro/facebook-cover/download/tropical-relax-resort-facebook-cover.jpg" />
                        </div>
                        <div class="round-image">
                            <img alt="round user avatar" src="https://thumbs.dreamstime.com/b/vector-illustration-smiling-shark-cartoon-minimalist-flat-style-isolated-white-background-315602043.jpg" />
                        </div>
                    </template>
                    <template #title>
                        <div class="flex">
                            <div class="flex-wrap flex-1">
                                <div class="flex text-4xl" style="margin-left: 170px; margin-top: -10px">
                                    <div class="flex-1">Jan Dyze Malaluan</div>
                                </div>
                                <div class="flex text-base font-italic" style="margin-left: 170px">
                                    <div class="flex-1 font-italic font-light">Cashier</div>
                                </div>
                            </div>
                            <div class="justify-end">
                                <Button label="Edit my profile" icon="pi pi-pencil" severity="info" outlined rounded> </Button>
                            </div></div
                    ></template>

                    <template #subtitle> </template>
                </Card>
            </div>
            <div class="mb-3 max-h-20rem">
                <Card style="overflow: hidden; position: relative">
                    <template #title>
                        <div class="flex text-2xl">
                            <div class="flex-1">Contact Details</div>
                        </div>
                    </template>

                    <template #content>
                        <div class="flex-wrap mt-4 text-lg">
                            <div class="flex mb-2">
                                <div class="w-2 text-end mr-6 font-light">Email:</div>
                                <div class="w-9 ml-4 font-bold">jdmalaluan2@gmail.com</div>
                            </div>
                            <div class="flex mb-2">
                                <div class="w-2 text-end mr-6 font-light">Number:</div>
                                <div class="w-9 ml-4 font-bold">0992 410 3295</div>
                            </div>
                            <div class="flex mb-2">
                                <div class="w-2 text-end mr-6 font-light">Address:</div>
                                <div class="w-9 ml-4 font-bold">Lumangbayan, Calapan City, Oriental Mindoro</div>
                            </div>
                        </div>
                    </template>
                </Card>
            </div>
            <div>
                <Card style="overflow: hidden; position: relative; min-height: 20rem">
                    <template #title>
                        <div class="flex text-2xl">
                            <div class="flex-1">About Me</div>
                        </div>
                    </template>

                    <template #content>
                        <div class="flex-wrap mt-4 text-lg">
                            <div class="flex mb-2">
                                <div class="w-2 text-end mr-6 font-light">Eme:</div>
                                <div class="w-9 ml-4 font-bold">Whatever can be placed here</div>
                            </div>
                        </div>
                    </template>
                </Card>
            </div>
        </div>
        <div class="flex-wrap w-3 h-full">
            <div class="flex card mb-3" style="min-height: 25rem">
                <div class="font-bold flex-1 text-2xl">Recent Activity</div>
            </div>
            <div class="card flex" style="min-height: 30rem">
                <div class="font-bold flex-1 text-2xl">Awards Received</div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.card-header-image img {
    width: 100%;
    height: 190px;
    object-fit: cover;
}

.round-image {
    position: absolute;
    /* top: 50%; */
    left: 20px; /* Adjust this value to position the image properly */
    transform: translateY(-50%);
    width: 150px; /* Adjust size as needed */
    height: 150px; /* Adjust size as needed */
    border-radius: 50%;
    overflow: hidden;
    /* border: 3px solid white;  */
    border: 4px solid #4caf50;
    /* padding: 2px; */
}

.round-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>
