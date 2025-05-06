<!-- Please remove this file from your project -->
<template>
  <footer class="bg_blue f_white f12">
    Copyright © {{ currentYear }} 吾等與貓毛.
  </footer>
</template>

<script>
export default {
  data() {
    return {
      currentYear: new Date().getFullYear(),
    };
  },
};
</script>

<style lang="scss" scoped>
footer {
  padding: 10px 20px;
  position: absolute;
  bottom: 0;
  width: 100%;
}
</style>
