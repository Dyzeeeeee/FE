<script setup></script>

<template>
    <router-view />
</template>

<style>
/* Customize the width and height of the scrollbar */
::-webkit-scrollbar {
    width: 7px; /* Thinner scrollbar width */
    height: 7px; /* Thinner scrollbar height */
}

/* Customize the background of the scrollbar track */
::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1); /* Subtle track background */
}

/* Customize the appearance of the scrollbar thumb (the draggable part) */
::-webkit-scrollbar-thumb {
    background-color: darkgrey; /* Scrollbar handle color */
    border-radius: 10px; /* Rounded corners for the scrollbar handle */
    border: 1px solid transparent; /* Optional: Adds a border around the scrollbar handle */
}
</style>
