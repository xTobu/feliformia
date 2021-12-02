<template>
  <div class="wrapper" id="medicine">
    <h1>餵藥及特殊飲食紀錄表</h1>
    <form v-on:submit.prevent="sendMessage">
      <div class="d_flex">
        <div class="W50">
          <el-date-picker
            v-model="formData.date"
            type="date"
            placeholder="請選擇日期"
          >
          </el-date-picker>
        </div>
        <div class="W50 arrow">
          <el-select v-model="formData.time" placeholder="請選擇班別">
            <el-option
              v-for="item in timeLists"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="W100">
        <div class="d_flex record_item th">
          <div class="name">貓名</div>
          <div class="notice">注意事項</div>
          <div class="done">確認</div>
        </div>

        <div
          class="d_flex record_item"
          :key="cat.notice"
          v-for="cat in formData.catLists"
        >
          <div class="name">{{ cat.name }}</div>
          <div class="notice">{{ cat.notice }}</div>
          <div class="done">
            <input type="checkbox" v-model="cat.done" id="" />
          </div>
        </div>
      </div>
      <div class="W100 ps f_grey">
        *前班備註：
        <br />
        {{ remark }}
      </div>
      <div class="W100 mb20">
        <el-input
          type="textarea"
          v-model="formData.desc"
          placeholder="額外狀況回報"
        ></el-input>
      </div>
      <div class="W100">
        <el-select
          v-model="formData.member"
          placeholder="請選擇填表志工"
          class="mb20 W100"
        >
          <el-option
            v-for="member in memberLists"
            :key="member.value"
            :label="member.label"
            :value="member.value"
          >
          </el-option>
        </el-select>
      </div>
      <div class="W100">
        <button type="submit" class="btn">
          {{ loading ? "loading" : "送出" }}
        </button>
        <NuxtLink
          class="f_red"
          :to="{ name: 'medicine', query: { date: formData.date } }"
          >看前班紀錄</NuxtLink
        >
        <NuxtLink class="f_red" to="/regular">前往飲食及便便紀錄</NuxtLink>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  layout: "default",
  data() {
    return {
      loading: false,
      timeLists: [
        {
          value: "早班",
          label: "早班",
        },
        {
          value: "晚班",
          label: "晚班",
        },
      ],
      marks: {
        0: "沒吃",
        25: "吃1/3",
        50: "吃1/2",
        75: "吃2/3",
        100: "吃光",
      },
      memberLists: [
        {
          value: "小萬",
          label: "小萬",
        },
        {
          value: "Flo",
          label: "Flo",
        },
        {
          value: "阿俐",
          label: "阿俐",
        },
        {
          value: "小貝",
          label: "小貝",
        },
        {
          value: "俊翔",
          label: "俊翔",
        },
      ],
      remark: "很多貓咪都拉稀，請再留意狀況！",
      formData: {
        date: "",
        time: "",
        catLists: {
          0: { name: "全員", notice: "貓砂全倒", done: false },
          1: { name: "蛙蛙", notice: "給腸胃處方", done: false },
          2: { name: "冬瓜", notice: "禁罐頭", done: false },
          3: { name: "冬瓜", notice: "冬瓜皮膚藥袋", done: false },
        },
        desc: "",
        member: "",
      },
    };
  },
  created() {},
  beforeMount() {
    const {
      query: { date },
    } = this.$route;
    if (!date) {
      this.formData.date = new Date();
    }
  },
  updated() {
    // console.log(this.catLists);
  },
  mounted() {},
  methods: {
    sendMessage() {
      this.loading = true;
      this.$axios
        .post("/messages", {
          name: this.name,
          email: this.email,
          phone: this.phone,
          message: this.message,
        })
        .then((response) => {
          this.success = true;
          this.errored = false;
        })
        .catch((error) => {
          this.errored = true;
        })
        .finally(() => {
          this.loading = false;
        });
    },
  },
};
</script>

<style lang="scss" scoped>
#medicine {
  a {
    display: block;
  }
}

.record_item {
  padding: 5px 0;
}

.th {
  background-color: #6da2c2;
  line-height: 40px;
  padding: 0;

  div {
    color: #fff;
    text-align: center;
    padding: 0;
  }
  .notice,
  .done {
    border-left: 1px solid #fff;
  }
}
.notice {
  width: calc(100% - 135px);
  text-align: left;
  padding: 0 10px;
}
.done {
  width: 60px;
}
</style>
