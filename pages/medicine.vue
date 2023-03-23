<template>
  <div v-loading="loading" id="medicine">
    <h1>餵藥及特殊飲食紀錄表</h1>
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
              :disabled="disableShift(item.value)"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="W100">
        <div
          v-for="(cat, index) in formData.cats"
          class="d_flex record_item"
          :key="`${cat.notice}${index}`"
        >
          <div class="name">{{ cat.name }}</div>
          <div class="detail">
            <div class="d_flex treatment">
              <p class="f_blue">事項</p>
              <div class="d_flex">
                <div class="txt">
                  <font class="treatment">{{ cat.treatment }}</font>
                  <font class="f_grey">{{
                    cat.reason && `原因：${cat.reason}`
                  }}</font>
                </div>
                <div class="done">
                  <el-checkbox v-model="cat.done" :disabled="isDisabled"
                    >完成</el-checkbox
                  >
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
        <NuxtLink class="f_red" to="/medicine" target="_blank"
          >回到今天</NuxtLink
        >
        <NuxtLink class="f_red" to="/regular" target="_blank"
          >前往飲食及如廁紀錄</NuxtLink
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
    title: "餵藥及特殊飲食須知",
  },
  data() {
    return {
      loading: true,
      loadingSubmit: false,
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
          //   name: "全員",
          //   treatment: "貓砂全倒",
          //   reason: "蟲蟲危機",
          //   done: false,
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
        name: "medicine",
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
    await this.InitMedicine();

    this.loading = false;

    await this.InitPrevMedicine();
  },
  updated() {},
  mounted() {},
  methods: {
    disableShift(fromShift) {
      const { date } = this.formData;
      return (
        date &&
        date.getDate() == new Date().getDate() &&
        new Date().getHours() < 18 &&
        fromShift == "night"
      );
    },
    dateHandler() {
      let { date, shift } = this.formData;
      date = date || new Date(date);
      if (
        date.getDate() == new Date().getDate() &&
        new Date().getHours() < 18 &&
        shift == "night"
      ) {
        this.$message.error("錯誤，請重新選擇日期");
        return;
      }
      this.$router.push({
        name: "medicine",
        query: {
          date: this.$dayjs(date).format("YYYY-MM-DD"),
          shift,
        },
      });
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
      if (!this.formData.member) {
        this.$message.error("請選擇填表志工");
        return;
      }

      this.loadingSubmit = true;
      await this.UpdateMedicine();
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
    async InitMedicine() {
      try {
        const { date, shift } = this.formData;
        const { data: regular } = await this.$axios.$get("/medicine", {
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

    async InitPrevMedicine() {
      try {
        const { date, shift } = this.prevDateShift;
        const { data: medicine } = await this.$axios.$get("/medicine", {
          params: {
            date: this.$dayjs(date).format("MM/DD/YYYY"),
            shift,
          },
        });
        this.formData.remark = medicine.note;
      } catch (e) {
        console.error(e);
      }
    },

    async UpdateMedicine() {
      try {
        const { recordId, date, shift, cats, note, member } = this.formData;
        await this.$axios.$post("/medicine/update", {
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
#medicine {
  a {
    display: block;
  }
}

.record_item {
  padding-right: 10px;
  .detail {
    > .d_flex {
      align-items: baseline;
      > div {
        .treatment {
          vertical-align: text-top;
          > .d_flex {
            flex-direction: column;
          }
        }
        .done {
          width: 40px;
        }
        .txt {
          text-align: left;
          width: calc(100% - 60px);
          font {
            display: block;
            padding: 5px;
            &.f_grey {
              opacity: 0.9;
              font-size: 14px;
            }
          }
        }
      }
    }
  }
}
</style>
