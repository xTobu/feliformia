<template>
  <div class="wrapper" id="regular">
    <h1>飲食及如廁紀錄表</h1>
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
        <div
          class="d_flex record_item"
          :key="cat.name"
          v-for="(cat, index) in formData.catLists"
        >
          <div class="name">{{ cat.name }}</div>
          <div class="detail">
            <div class="feed food d_flex">
              <p class="f_blue">食物</p>
              <div class="d_flex">
                <el-checkbox
                  v-model="cat.feed"
                  @change="(e) => foodHandler('feed', index)"
                  >乾</el-checkbox
                >
                <el-slider
                  v-model="cat.feed_detail"
                  :step="25"
                  :marks="marks"
                  :show-tooltip="false"
                  :disabled="!cat.feed"
                >
                </el-slider>
              </div>
            </div>
            <div class="can food d_flex">
              <p class="f_blue"></p>
              <div class="d_flex">
                <el-checkbox
                  v-model="cat.can"
                  @change="(e) => foodHandler('can', index)"
                  >罐</el-checkbox
                >
                <el-slider
                  v-model="cat.can_detail"
                  :step="25"
                  :marks="marks"
                  :show-tooltip="false"
                  :disabled="!cat.can"
                >
                </el-slider>
              </div>
            </div>
            <div class="excretion d_flex">
              <p class="f_blue">排泄</p>
              <div class="d_flex">
                <div class="W40 d_flex">
                  <el-checkbox v-model="cat.urine">尿</el-checkbox>
                  <el-checkbox
                    v-model="cat.feces"
                    @change="(e) => fecesHandler(e, index)"
                    >便</el-checkbox
                  >
                </div>
                <div class="W60 d_flex">
                  <el-radio-group v-model="cat.feces_warning">
                    <el-radio :label="'正常'" :disabled="!cat.feces"
                      >正常</el-radio
                    >
                    <el-radio :label="'軟'" :disabled="!cat.feces"
                      >軟便</el-radio
                    >
                    <el-radio :label="'拉稀'" :disabled="!cat.feces"
                      >拉稀</el-radio
                    >
                  </el-radio-group>
                </div>
              </div>

              <!-- <div class="W50 d_flex j_start mb0">
                <p class="f_blue">尿</p>
                <div>
                  <input type="checkbox" v-model="cat.urine" id="" />
                </div>
              </div> -->
            </div>
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
          :to="{ name: 'regular', query: { date: formData.date } }"
          >看前班紀錄</NuxtLink
        >
        <NuxtLink class="f_red" to="/medicine">前往餵藥及特殊飲食須知</NuxtLink>
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
          0: {
            name: "大哥",
            feed: true,
            feed_detail: 0,
            can: false,
            can_detail: 0,
            feces: null,
            feces_warning: null,
            urine: false,
          },
          1: {
            name: "噗噗",
            feed: true,
            feed_detail: 0,
            can: false,
            can_detail: 0,
            feces: null,
            feces_warning: null,
            urine: false,
          },
          2: {
            name: "亮亮",
            feed: true,
            feed_detail: 0,
            can: false,
            can_detail: 0,
            feces: null,
            feces_warning: null,
            urine: false,
          },
          3: {
            name: "冬瓜",
            feed: true,
            feed_detail: 0,
            can: false,
            can_detail: 0,
            feces: null,
            feces_warning: null,
            urine: false,
          },
          4: {
            name: "蛋蛋",
            feed: true,
            feed_detail: 0,
            can: false,
            can_detail: 0,
            feces: null,
            feces_warning: null,
            urine: false,
          },
          5: {
            name: "烏魯木",
            feed: true,
            feed_detail: 0,
            can: false,
            can_detail: 0,
            feces: null,
            urine: false,
          },
          6: {
            name: "大樹",
            feed: true,
            feed_detail: 0,
            can: false,
            can_detail: 0,
            feces: null,
            urine: false,
          },
        },
        desc: "",
        member: "",
      },
    };
  },
  created() {},
  beforeMount() {
    const {
      query: { date, time },
    } = this.$route;
    if (!date) {
      this.formData.date = new Date();
    }
    if (!time) {
      this.formData.time = new Date().getHours() > 15 ? "晚班" : "早班";
    }
  },
  updated() {
    // console.log(this.catLists);
  },
  mounted() {},
  methods: {
    fecesHandler(e, index) {
      this.formData.catLists[index].feces_warning = e ? "正常" : null;
    },
    foodHandler(type, index) {
      if (type === "can") {
        this.formData.catLists[index].can_detail = 0;
        return;
      }
      this.formData.catLists[index].feed_detail = 0;
    },
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
#regular {
  a {
    display: block;
  }

  .el-slider {
    &.disabled {
      opacity: 0.5;
      .el-slider__marks-text {
        color: #bbb;
      }
    }
  }

  .detail {
    .food {
      .el-slider {
        width: calc(100% - 60px);
        transform: translate(0, -6px);
      }

      .el-checkbox {
        width: 40px;
      }
    }
  }

  .can {
    .el-radio-group {
      width: calc(100% - 40px) !important;
    }
  }
  .excretion {
    > .d_flex {
      justify-content: start;
    }
    .W40 {
      justify-content: start;
      padding-top: 10px;
      width: 80px;
    }
    .W60 {
      padding-top: 10px;
      width: calc(100% - 80px);
      .el-radio-group {
        justify-content: start;
        width: 100%;
        > label {
          width: 45px;
        }
      }
    }
  }
}
</style>
