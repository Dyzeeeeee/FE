<template>
    <div class="fixed bottom-20 right-10">
        <!-- Chatbot Button -->
        <button v-if="!isOpen" @click="toggleChat">
            <img src="@/assets/pics/chathehe.png" alt="" class="h-[6rem]">
            <!-- <Icon icon="teenyicons:chatbot-solid" height="20"/> -->
        </button>

        <!-- Chatbot Popup -->
        <div v-if="isOpen"
            class="absolute bottom-2 right-0 w-72 bg-surface-900 shadow-lg rounded-lg border border-gray-300 overflow-hidden">
            <div class="bg-yellow-300 text-black p-3 font-semibold flex justify-between items-center">
                <span>Anahaw Chatbot</span>
                <button class="text-black" @click="toggleChat">
                    <Icon icon="zondicons:close-outline" height="20" />
                </button>
            </div>
            <div ref="chatContainer" class="p-4 max-h-64 overflow-y-auto space-y-2">
                <div v-for="(message, index) in chatHistory" :key="index"
                    :class="{ 'text-right': message.type === 'user' }" class="mb-2">
                    <div :class="{
                        'bg-yellow-300 text-black p-2 rounded-lg inline-block': message.type === 'bot',
                        'bg-gray-200 text-gray-800 p-2 rounded-lg inline-block': message.type === 'user',
                    }">
                        {{ message.text }}
                    </div>
                </div>
            </div>

            <div class="p-3 border-t">
                <input type="text" v-model="userMessage"
                    class="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                    placeholder="Type your message..." @keyup.enter="sendMessage" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, nextTick } from 'vue';

// State variables
const isOpen = ref(false);
const userMessage = ref('');
const chatHistory = ref([
    { text: "Welcome to Anahaw Island View Resort! How can I help you today?", type: "bot" }
]);
const chatContainer = ref(null); // Ref for the chat container

// Predefined replies
const predefinedReplies = {
    reservation: "Would you like to make a reservation? Please provide the date, time, and the number of guests.",
    menu: "Here's our menu: We offer a variety of cuisines including seafood, vegetarian dishes, and desserts. Let me know what you're interested in!",
    hours: "We are open from 8 AM to 10 PM every day. Do you need more details about our timings?",
    location: "We are located by the beachside at Anahaw Resort. Would you like directions?",
    activities: "We have live music every evening and a beach barbecue on weekends. Let me know if you'd like more information!",
    feedback: "We appreciate your feedback! Please share your experience or any suggestions.",
    goodbye: "Goodbye! We look forward to seeing you soon at Anahaw Resort.",
    default: "I'm here to assist you. Please ask about reservations, menu, hours, location, or activities!"
};

// Keywords mapping to replies
const keywords = {
    reservation: ["reservation", "book", "table"],
    menu: ["menu", "food", "dish"],
    hours: ["hours", "time", "open"],
    location: ["location", "address", "where"],
    activities: ["activities", "events", "music", "barbecue"],
    feedback: ["feedback", "review", "suggestion"],
    goodbye: ["bye", "goodbye", "see you"]
};

// Toggle chat visibility
const toggleChat = () => {
    isOpen.value = !isOpen.value;
};

// Analyze message and generate reply
const analyzeMessage = (message) => {
    message = message.toLowerCase();
    for (const [key, triggers] of Object.entries(keywords)) {
        if (triggers.some((word) => message.includes(word))) {
            return predefinedReplies[key];
        }
    }
    return predefinedReplies.default;
};

// Handle user message
const sendMessage = async () => {
    if (!userMessage.value.trim()) return;

    // Add user message to chat history
    chatHistory.value.push({ text: userMessage.value, type: "user" });

    // Generate bot reply
    const reply = analyzeMessage(userMessage.value);
    chatHistory.value.push({ text: reply, type: "bot" });

    // Clear user input
    userMessage.value = '';

    // Wait for DOM updates and scroll to bottom
    await nextTick();
    if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
};
</script>


<style scoped></style>