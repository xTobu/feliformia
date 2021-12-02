<template>
  <div class="wrapper" id="index">
    <h1 class="f_grey">貓毛輪值線上表單</h1>
    <NuxtLink class="btn" to="/regular">飲食及便便紀錄</NuxtLink>
    <NuxtLink class="btn" to="/medicine">餵藥及特殊飲食紀錄</NuxtLink>
  </div>
</template>

<script>
export default {
  layout: "default",
  // page component definitions
};
</script>

<style lang="scss" scoped>
#index {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  a {
    display: block;
  }
}
</style>
