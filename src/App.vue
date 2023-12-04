<template>
  <div>
    <div id='mainBoxUi'>
      <RouterView />
    </div>
  </div>
</template>

<script setup>
import { inject } from 'vue';

const todayDate = inject('todayDate');

</script>

<style scoped>
#mainBoxUi {
  max-width: 600px;
  min-width: 300px;
  text-align: center;
  border-radius: 5px;
  margin: 200px auto auto;
  padding-bottom: 40px;
  background: #3c424a;
}

</style>