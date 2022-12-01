<template>
  <div>
    <button class="btn__float" @click="drawer = !drawer">
      <img v-if="!drawer" src="~/assets/img/ic-menu.svg" alt="" />
      <img v-else src="~/assets/img/ic-close.svg" alt="" />
    </button>
    <el-drawer :visible.sync="drawer" :with-header="false" direction="btt">
      <div class="drawer__content">
        <ul>
          <li class="red" @click="toggleDialogNotice()"># 注意事項</li>
          <li class="red" @click="goto('regular')"># 飲食及如廁紀錄</li>
          <li class="red" @click="goto('medicine')"># 餵藥及特殊飲食表</li>
          <li @click="goto('weekly')">卯咪飲食週表</li>
          <li @click="goto('weekly-medicine')">卯咪餵藥週表</li>
          <li
            @click="
              open(
                'https://docs.google.com/spreadsheets/d/1VcvoYrlp9nwFBrtnJSG4XV8035rh0w-Rxk_x1aKbDwA/edit#gid=0'
              )
            "
          >
            貓咪簡介 / 飲食 / 習慣需知
          </li>
          <li @click="goto('index')">首頁</li>
        </ul>
      </div>
    </el-drawer>

    <el-dialog
      title="注意事項"
      :visible.sync="showDialogNotice"
      width="90%"
      :show-close="false"
      :with-header="false"
    >
      <p v-if="notices.length == 0">LOADING...</p>
      <div
        class="md"
        v-for="(notice, index) in notices"
        :key="`${notice.recordId}${index}`"
        v-html="markdownToHtml(notice.note)"
      ></div>

      <span slot="footer" class="dialog-footer">
        <button @click="toggleDialogNotice()">關閉</button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { marked } from "marked";

export default {
  data() {
    return {
      drawer: false,
      showDialogNotice: false,
      notices: [],
    };
  },
  computed: {},

  methods: {
    open(url) {
      window.open(url, "_blank").focus();
      this.drawer = false;
    },
    goto(name) {
      if (name != this.$route.name) {
        this.$router.push({
          name,
        });
      }

      this.drawer = false;
    },
    markdownToHtml(markdown) {
      return marked(markdown);
    },
    toggleDialogNotice() {
      this.showDialogNotice = !this.showDialogNotice;
      if (this.notices.length == 0) {
        this.GetNotice();
      }
    },

    async GetNotice() {
      const { data: notices } = await this.$axios.$get("/notice/list");
      this.notices = notices;
    },
  },
};
</script>
<style lang="scss" scoped>
.btn__float {
  cursor: pointer;
  position: fixed;
  width: 50px;
  height: 50px;
  bottom: 30px;
  right: 30px;
  color: transparent;
  border-radius: 50px;
  text-align: center;
  padding: 0;
  border: 0;
  z-index: 2099;

  > img {
    width: 100%;
  }
}
.drawer__content {
  width: 100%;
  max-width: 450px;
  margin: 0 auto;
  padding: 16px 32px;
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
  }

  li {
    cursor: pointer;
    text-align: left;
    color: #5a5c5f;
    padding: 16px;
    border-bottom: 1px solid #ababab66;
    &.red {
      color: #b43a39;
    }
  }
}
.md {
  text-align: left;
}
.dialog-footer {
  > button {
    width: 80px;
    height: 40px;
    border-radius: 10px;
    background-color: #b43a39;
    font-size: 14px;
    color: #fff;
  }
}
</style>
