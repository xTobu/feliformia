<template>
  <div v-loading="loading" class="wrapper" id="regular">
    <h1>卯咪健康週表</h1>
    <form v-on:submit.prevent="Submit">
      <div class="d_flex">
        <div class="W100 arrow">
          <el-select
            style="width: 100%"
            v-model="recordId"
            placeholder="請選擇貓咪"
            @change="dateHandler"
          >
            <el-option :label="'噗噗'" :value="'噗噗'"> </el-option>
            <el-option :label="'冬瓜'" :value="'冬瓜'"> </el-option>
          </el-select>
        </div>
      </div>
      <div class="W100">
        <div class="d_flex record_item">
          <div class="detail"></div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  layout: "weekly",
  head: {
    title: "卯咪健康週表",
  },
  data() {
    return {
      recordId: "",
      formData: {
        cats: [],
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
        : new Date().getHours() < 15
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
      align-items: end;
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
