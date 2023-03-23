<template>
  <div v-loading="loading" id="regular">
    <h1>飲食及如廁紀錄表</h1>
    <form v-on:submit.prevent="Submit">
      <div class="d_flex">
        <div class="W50">
          <el-date-picker
            v-model="formData.date"
            :picker-options="pickerOptions"
            type="date"
            :clearable="false"
            @change="dateHandler"
            placeholder="請選擇日期"
          >
          </el-date-picker>
        </div>
        <div class="W50 arrow">
          <el-select
            v-model="formData.shift"
            placeholder="請選擇班別"
            @change="dateHandler"
          >
            <el-option
              v-for="item in shiftList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="W100 shift">
        <el-checkbox v-model="noMorningShift" v-if="false">
          &nbsp;&nbsp;今日無早班</el-checkbox
        >
      </div>
      <div class="W100">
        <div
          class="d_flex record_item"
          v-for="(cat, index) in formData.cats"
          :key="`${cat.name}${index}`"
        >
          <img
            v-if="cat.cat.reminder"
            class="warning"
            src="~/assets/img/ic-warning.svg"
            alt=""
          />
          <a
            class="name"
            target="_blank"
            :href="'weekly?cat=' + cat.cat.recordId"
            >{{ cat.name }}</a
          >
          <div class="detail">
            <div class="feed food d_flex">
              <p class="f_blue">食物</p>
              <div class="d_flex">
                <el-checkbox
                  v-model="cat.feed"
                  :disabled="isDisabled"
                  @change="(e) => foodHandler('feed', index)"
                  >乾</el-checkbox
                >
                <el-slider
                  v-model="cat.feed_detail"
                  :step="25"
                  :marks="marks"
                  :show-tooltip="false"
                  :disabled="isDisabled || !cat.feed"
                  v-if="!noMorningShift"
                >
                </el-slider>
                <el-slider
                  v-model="cat.feed_detail_noMorningShift"
                  :step="10"
                  :marks="marksNoMorningShift"
                  :show-tooltip="true"
                  :format-tooltip="formatTooltip"
                  :disabled="isDisabled || !cat.feed"
                  v-if="noMorningShift"
                >
                </el-slider>
                <!-- <div class="remain_key_in" v-if="noMorningShift">
                 <el-select
                    value-key="id"
                    v-model="cat.feed_detail"
                    placeholder="請選擇剩餘乾乾"
                    :disabled="isDisabled || !cat.feed"
                    class="remain_select"
                  >
                    <el-option
                      v-for="(item, idx) in feedRemainList"
                      :key="idx"
                      :label="item.value"
                      :value="item.label"
                    ></el-option>
                  </el-select>
                </div>-->
              </div>
            </div>
            <div class="can food d_flex">
              <p class="f_blue"></p>
              <div class="d_flex">
                <el-checkbox
                  v-model="cat.can"
                  :disabled="isDisabled"
                  @change="(e) => foodHandler('can', index)"
                  >罐</el-checkbox
                >
                <el-slider
                  v-model="cat.can_detail"
                  :step="25"
                  :marks="marks"
                  :show-tooltip="false"
                  :disabled="isDisabled || !cat.can"
                >
                </el-slider>
              </div>
            </div>
            <div class="excretion d_flex">
              <p class="f_blue">排泄</p>
              <div class="d_flex">
                <div class="W40 d_flex">
                  <el-checkbox v-model="cat.urine" :disabled="isDisabled"
                    >尿</el-checkbox
                  >
                  <el-checkbox
                    v-model="cat.feces"
                    :disabled="isDisabled"
                    @change="(e) => fecesHandler(e, index)"
                    >便</el-checkbox
                  >
                </div>
                <div class="W60 d_flex">
                  <el-radio-group
                    v-model="cat.feces_warning"
                    :disabled="isDisabled || !cat.feces"
                  >
                    <el-radio label="正常">正常</el-radio>
                    <el-radio label="軟便">軟便</el-radio>
                    <el-radio label="拉稀">拉稀</el-radio>
                  </el-radio-group>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="W100 ps f_grey">
        <template v-if="formData.remark">
          <b>*前班備註：</b>
          <span style="white-space: pre-line">
            {{ formData.remark }}
          </span>
        </template>
      </div>
      <div class="W100 mb20">
        <el-input
          type="textarea"
          v-model="formData.note"
          :disabled="isDisabled"
          placeholder="額外狀況回報"
        ></el-input>
      </div>
      <div class="W100">
        <el-select
          v-model="formData.member"
          filterable
          :disabled="isDisabled"
          placeholder="請選擇填表志工"
          class="mb20 W100"
        >
          <el-option
            v-for="member in memberList"
            :key="member.value"
            :label="member.label"
            :value="member.value"
          >
          </el-option>
        </el-select>
      </div>
      <div class="W100">
        <button type="submit" class="btn" v-show="!isDisabled">
          {{ loadingSubmit ? "儲存中..." : "送出" }}
        </button>
        <NuxtLink class="f_red" :to="prevLink" target="_blank"
          >看前班紀錄</NuxtLink
        >
        <NuxtLink class="f_red" to="/regular" target="_blank"
          >回到今天</NuxtLink
        >
        <NuxtLink class="f_red" to="/medicine" target="_blank"
          >前往餵藥及特殊飲食須知</NuxtLink
        >
      </div>
    </form>
    <FloatButton />
  </div>
</template>

<script>
import FloatButton from "./../components/FloatButton.vue";
export default {
  components: {
    FloatButton,
  },
  layout: "default",
  head: {
    title: "飲食及如廁紀錄表",
  },
  data() {
    return {
      loading: true,
      loadingSubmit: false,
      noMorningShift: false,
      pickerOptions: {
        disabledDate(time) {
          // 不可選未來的日期
          let dateFrom = new Date(process.env.releaseDate);
          dateFrom.setDate(dateFrom.getDate() - 1);
          return time.getTime() > Date.now() || time.getTime() < dateFrom;
        },
      },
      shiftList: [
        {
          value: "morning",
          label: "早班",
        },
        {
          value: "night",
          label: "晚班",
        },
      ],
      marksNoMorningShift: {
        0: "沒吃",
        50: "剩5匙",
        100: "吃光",
      },
      marks: {
        0: "沒吃",
        25: "吃1/3",
        50: "吃1/2",
        75: "吃2/3",
        100: "吃光",
      },
      memberList: [
        // {
        //   value: "小萬",
        //   label: "小萬",
        // },
      ],
      formData: {
        recordId: "",
        date: "",
        shift: "",
        cats: [
          // {
          //   name: "大哥",
          //   feed: true,
          //   feed_detail: 0,
          //   can: false,
          //   can_detail: 0,
          //   feces: false,
          //   feces_warning: null,
          //   urine: false,
          // },
        ],
        note: "",
        member: "",
        remark: "",
      },
    };
  },
  computed: {
    prevDateShift() {
      let date = this.formData.date
        ? this.$dayjs(this.formData.date)
        : this.$dayjs();
      if (this.formData.shift == "morning") {
        date = date.subtract(1, "day");
      }
      const shift = this.formData.shift == "morning" ? "night" : "morning";
      return {
        date: date.toDate(),
        shift,
      };
    },
    prevLink() {
      return {
        name: "regular",
        query: {
          date: this.$dayjs(this.prevDateShift.date).format("YYYY-MM-DD"),
          shift: this.prevDateShift.shift,
        },
      };
    },
    isDisabled() {
      const { date } = this.formData;
      const day = this.$dayjs(date);
      const disabled = this.$dayjs().subtract(process.env.disabledDays, "day");
      return day < disabled;
    },
  },

  created() {},

  async beforeMount() {
    await this.InitDateAndShift();
    await this.InitMemberList();
    await this.InitRegular();

    this.loading = false;

    await this.InitPrevRegular();
  },

  async mounted() {},

  updated() {},

  methods: {
    dateHandler() {
      let { date, shift } = this.formData;
      date = date || new Date(date);
      this.$router.push({
        name: "regular",
        query: {
          date: this.$dayjs(date).format("YYYY-MM-DD"),
          shift,
        },
      });
    },

    fecesHandler(e, index) {
      this.formData.cats[index].feces_warning = e ? "正常" : null;
    },
    foodHandler(type, index) {
      if (type === "can") {
        this.formData.cats[index].can_detail = 0;
        return;
      }
      this.formData.cats[index].feed_detail = 0;
    },

    shiftHandler() {
      this.noMorningShift = !this.noMorningShift;
    },
    formatTooltip(val) {
      if (val === 0) {
        return "沒吃";
      } else if (val == 100) {
        return "吃光";
      }
      return `剩${10 - val / 10}匙`;
    },
    async Submit() {
      if (!this.formData.member) {
        this.$message.error("請選擇填表志工");
        return;
      }

      try {
        const shiftMap = {
          morning: "早班",
          night: "晚班",
        };
        const { date, shift, member } = this.formData;
        const { isConfirmed, dismiss } = await this.$swal.fire({
          // title: "",
          html: `<b><h3>您即將送出資料</h3></b>${this.$dayjs(date).format(
            "YYYY-MM-DD"
          )}<br/>${shiftMap[shift]}<br/>${member}`,
          showClass: {
            popup: "animate__animated animate__fadeIn animate__faster",
          },
          hideClass: {
            popup: "",
          },
          showCancelButton: true,
          cancelButtonText: "取消",
          confirmButtonColor: "#b33a39",
          confirmButtonText: "是的",
        });
        if (isConfirmed) {
          await this.SubmitForm();
        }
      } catch (error) {}
    },
    async SubmitForm() {
      this.loadingSubmit = true;
      await this.UpdateRegular();
      this.loadingSubmit = false;
      this.$swal.fire({
        text: "表單已成功送出",
        showClass: {
          popup: "animate__animated animate__fadeIn animate__faster",
        },
        hideClass: {
          popup: "",
        },
        showCancelButton: false,
        confirmButtonColor: "#b33a39",
        confirmButtonText: "是的",
      });
    },
    async InitDateAndShift() {
      const {
        query: { date, shift },
      } = this.$route;

      this.formData.date = date ? new Date(date) : new Date();
      this.formData.shift = shift
        ? shift == "morning"
          ? "morning"
          : "night"
        : new Date().getHours() < 18
        ? "morning"
        : "night";

      // 有效日期限制
      let dateRelease = new Date(process.env.releaseDate);
      dateRelease.setDate(dateRelease.getDate() - 1);
      if (
        this.formData.date > Date.now() ||
        this.formData.date <= dateRelease
      ) {
        this.$router.push({
          name: "regular",
        });
      }
    },
    async InitMemberList() {
      const { data: volunteers } = await this.$axios.$get("/volunteer/list");
      this.memberList = volunteers.map((volunteer) => {
        return {
          label: volunteer.name,
          value: volunteer.name,
        };
      });
    },

    async InitRegular() {
      try {
        const { date, shift } = this.formData;
        const { data: regular } = await this.$axios.$get("/regular", {
          params: {
            date: this.$dayjs(date).format("MM/DD/YYYY"),
            shift,
          },
        });

        const {
          recordId,
          cats,
          date: strDate,
          shift: strShift,
          member,
          note,
          remark,
        } = regular;

        this.formData.recordId = recordId;
        this.formData.date = new Date(strDate);
        this.formData.shift = strShift;
        this.formData.cats = cats;
        this.formData.note = note;
        this.formData.remark = remark;
        this.formData.member = member;
      } catch (e) {
        console.error(e);
      }
    },

    async InitPrevRegular() {
      try {
        const { date, shift } = this.prevDateShift;
        const { data: regular } = await this.$axios.$get("/regular", {
          params: {
            date: this.$dayjs(date).format("MM/DD/YYYY"),
            shift,
          },
        });
        this.formData.remark = regular.note;
      } catch (e) {
        console.error(e);
      }
    },

    async UpdateRegular() {
      try {
        const { recordId, date, shift, cats, note, member } = this.formData;
        await this.$axios.$post("/regular/update", {
          recordId,
          date: this.$dayjs(date).format("YYYY-MM-DD"),
          shift,
          cats,
          note,
          member,
        });
      } catch (e) {
        console.error(e);
      }
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
      .el-slider,
      .remain_key_in {
        width: calc(100% - 60px);
        transform: translate(0, -6px);
      }

      .el-checkbox {
        width: 40px;
      }

      .remain_select {
        // margin-left: 10px;
        // margin-right: 10px;
        width: 100%;
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

  .shift {
    margin-bottom: 15px;
    .el-checkbox {
      width: 100%;
      flex-direction: row;
      align-items: flex-end;
      display: flex;
      justify-content: flex-end;
    }
    span {
      padding-left: 10px !important;
      padding-top: 0 !important;
    }
  }
}
</style>
