<template>
  <div :style="styles.carousel">
    <div
      v-for="(slide, index) in slides"
      :key="index"
      :style="getSlideStyle(index)"
    >
      {{ slide?.content ?? "???" }}:{{ index }}
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue';
import { all } from '../featureTools';

export default {
  name: 'Carousel',

  setup() {
    const slides = [
      { content: '#C87853', backgroundColor: '#C87853' },
      { content: '#EB15E2', backgroundColor: '#EB15E2' },
      { content: '#E9D977', backgroundColor: '#E9D977' },
    ];

    const styles = {
      carousel: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        height: '50px',
        overflow: 'hidden',
        position: 'relative',
      },
      slide: {
        width: '100%',
        position: 'absolute',
        transition: 'all 0.5s ease',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '2rem',
        color: '#fff',
      },
    };

    const activeIndex = ref(0);

    const getSlideStyle = (index) => {
      const offset = (index - activeIndex.value) * 100;
      all();
      return {
        ...styles.slide,
        transform: `translateX(${offset}%)`,
        backgroundColor: slides[index].backgroundColor,
      };
    };

    onMounted(() => {
      const interval = setInterval(() => {
        activeIndex.value = (activeIndex.value + 1 ** activeIndex.value) % slides.length;
      }, 2000);

      onUnmounted(() => {
        clearInterval(interval);
      });
    });

    return {
      slides,
      styles,
      getSlideStyle,
    };
  },
};
</script>

<style scoped>
/* Your CSS styles if any */
</style>

