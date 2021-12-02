<template>
  <div>
    <nuxt />
    <Footer />
  </div>
</template>

<script>
import Footer from "./../components/Footer.vue";
export default {
  components: {
    Footer,
  },
  // page component definitions
};
</script>
<style lang="scss">
$red: #b33a39;
$grey: #657181;
$blue: #6da2c2;
$light_grey: #f5f7f8;
$brown: #8e8783;

body,
html {
  height: initial !important;
  width: 100%;
  overflow-x: hidden;
  font-family: "Noto Sans TC", "Helvetica Neue", Helvetica, sans-serif;
  text-align: center;
  font-size: 15px;
  min-height: 100vh;
  position: relative;
  margin: 0;
}

* {
  box-sizing: border-box;
  -webkit-touch-callout: none;
  -webkit-tap-highlight-color: rgba(255, 255, 255, 0);
}

.wrapper {
  width: 100%;
  max-width: 450px;
  margin: 0 auto;
  padding: 20px 20px;
}

.W20 {
  width: 20%;
}

.W25 {
  width: 25%;
}

.W33 {
  width: 33%;
}

.W50 {
  width: 50%;
}

.W67 {
  width: 67%;
}

.W75 {
  width: 75%;
}

.W100 {
  width: 100%;
}

.f12 {
  font-size: 12px;
}

.f15 {
  font-size: 15px;
  line-height: 1.5;
}

.f19 {
  font-size: 19px;
  line-height: 1.3;
}

.bg_cover {
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
}

.f_white {
  color: #fff;
}

.f_grey {
  color: $grey;
}

.f_red {
  color: $red;
}

.f_blue {
  color: $blue;
}

.bg_red {
  background-color: $red;
}

.bg_blue {
  background-color: $blue;
}

.f_b {
  font-weight: bold;
}

.t_center {
  text-align: center;
}

.t_left {
  text-align: left;
}

.d_flex {
  display: flex !important;
  flex-wrap: wrap;
}

.d_none {
  display: none;
}

.mb0 {
  margin-bottom: 0 !important;
}

.mb20 {
  margin-bottom: 20px;
}

.mb {
  display: none;
}

.pc {
  display: inline-block;
}

.ham {
  display: none;
}

form {
  padding-bottom: 30px;
}

button,
input,
select,
select {
  -webkit-appearance: none;
  background-color: #fff;
  border: none;
  border-radius: 4px;
  border: 1px solid #ccc;
  height: 50px;
  line-height: 50px;
  padding: 0 10px;
  width: 100%;
  color: #606266;
  font-size: 14px;
  &:focus,
  &.active {
    outline: none;
  }
}

// input[type="checkbox"] {
//   height: 35px;
//   width: 35px;
//   &:checked {
//     background-image: url(/images/v.svg);
//     background-size: 20px;
//     background-position: center;
//     background-repeat: no-repeat;
//   }
// }

.arrow {
  // position: relative;
  // &:after {
  //   content: "";
  //   border-top: 8px solid $grey;
  //   border-left: 6px solid transparent;
  //   border-right: 6px solid transparent;
  //   position: absolute;
  //   right: 15px;
  //   top: 50%;
  //   transform: translate(0, -50%);
  //   display: block;
  // }
}

h1 {
  font-size: 23px;
  font-weight: 500;
  margin-bottom: 30px;
}

a {
  text-decoration: underline;
  margin-bottom: 15px;
}

.btn {
  background-color: $red;
  color: #fff;
  font-size: 17px;
  font-weight: 500;
  padding: 0 20px;
  line-height: 50px;
  text-decoration: none;
  margin-bottom: 20px;
  border-radius: 30px;
  border: none;
}

.d_flex {
  justify-content: space-between;
  .W50 {
    width: calc(50% - 10px) !important;
    margin-bottom: 20px;
  }
  &.j_start {
    justify-content: start;
  }
}

.ui-state-default {
  border: none !important;
  padding: 5px 0.2em !important;
  margin: 2px 0;
  text-align: center !important;
  &.ui-state-highlight {
    border: none;
    background-color: $blue;
    color: #fff;
  }
  &.ui-state-active {
    background-color: $red;
  }
}

.rs-container {
  .rs-selected {
    background-color: $blue;
  }
}
.rs-container {
  * {
    text-align: left;
  }
}

.record_item {
  align-items: center;
  padding: 30px 25px 10px 10px;
  border-bottom: 1px solid #ccc;
  position: relative;
  &:nth-child(even) {
    background-color: #f4f5f5;
  }
  .name {
    display: inline-block;
    padding: 0 13px;
    position: absolute;
    left: 0;
    top: 0;
    background-color: #8e8783;
    color: #fff;
    font-size: 12px;
    line-height: 20px;
    height: 23px;
  }
  .detail {
    // border-left: 1px solid rgba(50, 50, 50, 0.05);
    width: 100%;
    > div {
      margin-bottom: 10px;
    }
    .W50 {
      > * {
        // display: inline-block;
        vertical-align: middle;
      }
      p {
        // margin-right: 20px;
      }
    }
    > .d_flex {
      p {
        width: 40px;
      }
      > div {
        width: calc(100% - 45px);
      }
    }
  }
}

.ps {
  text-align: left;
  line-height: 1.5;
  padding: 20px 0;
}

@media screen and (max-width: 600px) {
  .mb {
    display: inline-block;
  }

  .pc {
    display: none;
  }
}
</style>
