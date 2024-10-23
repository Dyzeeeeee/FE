<template>
  <div class="game-container relative w-full h-[80vh] bg-gray-800 overflow-hidden mt-10">
    <!-- Score display -->
    <div class="absolute top-4 left-4 text-white text-2xl font-bold">Score: {{ score }}</div>

    <!-- Falling objects -->
    <div v-for="(object, index) in objects" :key="index" :class="[
      object.type === 'catch' ? 'bg-green-500' : 'bg-red-500',
      { 'exploded': object.type === 'dodge' && object.exploded }
    ]" class="absolute h-[40px] w-[40px] rounded-full cursor-pointer"
      :style="{ top: `${object.y}px`, left: `${object.x}px`, transition: 'all 0.5s' }"
      @click="catchObject(object, index)">
    </div>

    <!-- Game Over Message -->
    <div v-if="gameOver" class="absolute inset-0 flex justify-center items-center bg-black bg-opacity-75">
      <div class="text-white text-4xl font-bold">Game Over</div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue';

const objectFallSpeed = 5;
const spawnInterval = 1000; // Time interval (ms) for spawning objects

// Falling objects
const objects = ref([]);

// Score
const score = ref(0);
const gameOver = ref(false);

// Game loop to move objects
function gameLoop() {
  // Move objects and check if they fall off the screen
  objects.value = objects.value.filter((object) => {
    object.y += objectFallSpeed;

    // Remove objects that fall off the screen
    return object.y <= window.innerHeight;
  });

  // Game loop continues
  if (!gameOver.value) requestAnimationFrame(gameLoop);
}

// Spawn random objects (beneficial or harmful)
function spawnObject() {
  const randomX = Math.random() * (window.innerWidth - 40);
  const randomType = Math.random() > 0.5 ? 'catch' : 'dodge'; // 50% chance for each type
  objects.value.push({ x: randomX, y: 0, type: randomType, exploded: false });
}

// Catch object when clicked
function catchObject(object, index) {
  if (object.type === 'catch') {
    score.value += 1; // Increase score for catching
  } else {
    // Trigger explosion effect
    objects.value[index].exploded = true;
    // Set game over after a short delay
    setTimeout(() => {
      gameOver.value = true; // Game over if a harmful object is clicked
    }, 500); // Adjust duration as needed
  }
  // Remove the object after a short delay if it's harmless or exploded
  setTimeout(() => {
    objects.value.splice(index, 1);
  }, 1000); // Adjust duration as needed
}

// Hook into the Vue lifecycle to start the game loop and listen for mouse events
onMounted(() => {
  // Disable page scroll
  document.body.style.overflow = 'hidden';

  // Start game loop
  gameLoop();

  // Spawn objects at regular intervals
  const spawnIntervalId = setInterval(() => {
    if (!gameOver.value) spawnObject();
  }, spawnInterval);

  // Cleanup when component unmounts
  onBeforeUnmount(() => {
    clearInterval(spawnIntervalId); // Stop object spawning

    // Restore scrolling when leaving the game
    document.body.style.overflow = '';
  });
});
</script>

<style scoped>
.exploded {
  background-color: orange;
  /* Change color to indicate explosion */
  transform: scale(1.5);
  /* Increase size for explosion effect */
  opacity: 0;
  /* Fade out after explosion */
  transition: all 0.5s ease-out;
  /* Smooth transition */
}
</style>
