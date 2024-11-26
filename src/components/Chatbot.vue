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
            <div class="bg-yellow-500 text-black p-3 font-semibold flex justify-between items-center">
                <span>Anahaw Chatbot</span>
                <button class="text-black" @click="toggleChat">✖️</button>
            </div>
            <div ref="chatContainer" class="p-4 max-h-64 overflow-y-auto space-y-2">
                <!-- Chat History -->
                <div v-for="(message, index) in chatHistory" :key="index"
                    :class="{ 'text-right': message.type === 'user' }" class="mb-2">
                    <div :class="{
                        'bg-yellow-500 text-black p-2 rounded-lg inline-block':
                            message.type === 'bot',
                        'bg-gray-200 text-gray-800 p-2 rounded-lg inline-block':
                            message.type === 'user',
                    }">
                        {{ message.text }}
                    </div>
                </div>

                <!-- Star Rating for Feedback -->
                <div v-if="showRating" class="mt-4 flex justify-center space-x-2">
                    <span v-for="star in 5" :key="star" @click="rateResort(star)" class="cursor-pointer text-3xl">
                        <Icon :icon="star <= selectedRating ? 'mdi:star' : 'mdi:star-outline'"
                            class="transition duration-200" :class="{
                                'text-yellow-500': star <= selectedRating,
                                'text-gray-400': star > selectedRating,
                            }"></Icon>
                    </span>
                </div>

            </div>
            <div class="p-3 border-t">
                <!-- User Input -->
                <input type="text" v-model="userMessage"
                    class="w-full p-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                    placeholder="Type your message..." @keyup.enter="sendMessage" />
            </div>
        </div>

    </div>
</template>

<script setup>
import { ref, nextTick, onMounted, onBeforeUnmount } from 'vue';

const chatHistory = ref([]); // Chat history
const isOpen = ref(false);
const userMessage = ref('');
const chatContainer = ref(null); // Ref for the chat container
const showRating = ref(false);
const selectedRating = ref(0);

const predefinedReplies = {
    reservation: "Would you like to make a reservation? Please provide the date, time, and the number of guests.",
    menu: "Here's our menu: We offer a variety of cuisines, including seafood, vegetarian dishes, and desserts. Let me know if you’d like more details.",
    hours: "We are open from 8 AM to 10 PM every day. Let me know if you need help planning your visit.",
    location: "We are located by the beachside at Anahaw Resort. Would you like directions or a map?",
    activities: "We have live music every evening and a beach barbecue on weekends. Would you like to know about our upcoming events?",
    feedback: "We value your feedback! Please share your experience or suggestions so we can serve you better.",
    goodbye: "Goodbye! We look forward to seeing you soon at Anahaw Resort.",
    greeting: "Hello there! Welcome to Anahaw Resort Chatbot. How can I assist you today?",
    gratitude: "You're welcome! Feel free to ask if you need anything else.",
    help: "I'm here to help! You can ask about reservations, menu, activities, location, or anything else related to Anahaw Resort.",
    default: "I'm here to assist you. Please ask about reservations, menu, hours, location, or activities!"
};

const keywords = {
    reservation: ["reservation", "book", "table", "schedule", "reserve"],
    menu: ["menu", "food", "dish", "specialty", "offerings"],
    hours: ["hours", "time", "open", "closing", "schedule"],
    location: ["location", "address", "where", "directions", "map"],
    activities: ["activities", "events", "entertainment", "music", "barbecue"],
    feedback: ["feedback", "review", "suggestion", "complain", "improve"],
    goodbye: ["bye", "goodbye", "see you", "later", "take care"],
    greeting: ["hello", "hi", "hey", "good morning", "good afternoon"],
    gratitude: ["thanks", "thank you", "appreciate", "grateful"],
    help: ["help", "assist", "support", "problem", "question"]
};

// Load chat history from local storage on mount
onMounted(() => {
    const savedHistory = localStorage.getItem('chatHistory');
    chatHistory.value = savedHistory ? JSON.parse(savedHistory) : [
        { text: "Welcome to Anahaw Island View Resort! How can I help you today?", type: "bot" }
    ];
});

// Save chat history to local storage before unmount
onBeforeUnmount(() => {
    localStorage.setItem('chatHistory', JSON.stringify(chatHistory.value));
});

// Toggle chat visibility
const toggleChat = async () => {
    isOpen.value = !isOpen.value;
    await nextTick();
    if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
};

// Analyze message and generate reply
const analyzeMessage = (message) => {
    const lowerMessage = message.toLowerCase();
    for (const [key, triggers] of Object.entries(keywords)) {
        if (triggers.some((word) => lowerMessage.includes(word))) {
            if (key === "feedback") showRating.value = true;
            return predefinedReplies[key];
        }
    }
    if (lowerMessage.includes("not good") || lowerMessage.includes("bad")) {
        return "I'm sorry to hear that. Can you share more details so we can improve?";
    }
    if (lowerMessage.includes("amazing") || lowerMessage.includes("love")) {
        return "Thank you for your kind words! We're thrilled to hear you enjoyed it.";
    }
    if (lowerMessage.endsWith("can I")) {
        return "Could you clarify what you'd like to know or do?";
    }
    return predefinedReplies.default;
};

// Handle user message
const sendMessage = async () => {
    if (!userMessage.value.trim()) return;

    chatHistory.value.push({ text: userMessage.value, type: "user" });
    const reply = analyzeMessage(userMessage.value);
    chatHistory.value.push({ text: reply, type: "bot" });
    userMessage.value = '';

    await nextTick();
    if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
};

// Rate the resort
const rateResort = (rating) => {
    selectedRating.value = rating;
    showRating.value = false;
    chatHistory.value.push({
        text: `Thank you for rating us ${rating} star${rating > 1 ? 's' : ''}!`,
        type: "bot",
    });

    nextTick(() => {
        if (chatContainer.value) {
            chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
        }
    });
};
</script>


<style scoped></style>