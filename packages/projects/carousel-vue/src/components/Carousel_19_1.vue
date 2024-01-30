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
      { content: '#CB0FF2', backgroundColor: '#CB0FF2' },
      { content: '#9CC176', backgroundColor: '#9CC176' },
      { content: '#8A1ACE', backgroundColor: '#8A1ACE' },
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

