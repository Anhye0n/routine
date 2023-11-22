<template>
    <div id='mainBoxUi'>
      <div id='mainBoxTopList'>
        <div class='topListNameBox'>
          <RouterLink to='day'>Day</RouterLink>
        </div>
        <div class='topListNameBox'>
          <RouterLink to='week'>Week</RouterLink>
        </div>
        <div class='topListNameBox'>
          <RouterLink to='month'>Month</RouterLink>
        </div>
      </div>
      <RouterView />
    </div>
</template>

<script setup>

</script>

<style scoped>
#mainBoxUi {
  max-width: 600px;
  min-width: 300px;
  display: block;
  text-align: center;
  margin: 200px auto auto;
  background: #3c424a;
}

#mainBoxTopList{
  text-align: center;
  display: flex;
  justify-content: center;
}

.topListNameBox{
  font-family: 'NanumSquareB', serif;
  font-size: 1.2rem;
  padding: 5px 10px 5px 10px;
  margin: 0 5px 0 5px;
}
</style>