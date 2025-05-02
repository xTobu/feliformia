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
                  @change="
                    (e) => {
                      foodHandler('feed', index);
                      onAutoSave();
                    }
                  "
                  >乾</el-checkbox
                >
                <el-slider
                  v-model="cat.feed_detail"
                  :step="25"
                  :marks="marks"
                  :show-tooltip="false"
                  :disabled="isDisabled || !cat.feed"
                  @change="
                    (e) => {
                      onAutoSave();
                    }
                  "
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
                  @change="
                    (e) => {
                      onAutoSave();
                    }
                  "
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
                  @change="
                    (e) => {
                      foodHandler('can', index);
                      onAutoSave();
                    }
                  "
                  >罐</el-checkbox
                >
                <el-slider
                  v-model="cat.can_detail"
                  :step="25"
                  :marks="marks"
                  :show-tooltip="false"
                  :disabled="isDisabled || !cat.can"
                  @change="
                    (e) => {
                      onAutoSave();
                    }
                  "
                >
                </el-slider>
              </div>
            </div>
            <div class="excretion d_flex">
              <p class="f_blue">排泄</p>
              <div class="d_flex">
                <div class="W40 d_flex">
                  <el-checkbox
                    v-model="cat.urine"
                    :disabled="isDisabled"
                    @change="
                      (e) => {
                        onAutoSave();
                      }
                    "
                    >尿</el-checkbox
                  >
                  <el-checkbox
                    v-model="cat.feces"
                    :disabled="isDisabled"
                    @change="
                      (e) => {
                        fecesHandler(e, index);
                        onAutoSave();
                      }
                    "
                    >便</el-checkbox
                  >
                </div>
                <div class="W60 d_flex">
                  <el-radio-group
                    v-model="cat.feces_warning"
                    :disabled="isDisabled || !cat.feces"
                    @change="
                      (e) => {
                        onAutoSave();
                      }
                    "
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
          @change="onAutoSave"
        ></el-input>
      </div>
      <div class="W100">
        <el-select
          v-model="formData.member"
          filterable
          :disabled="isDisabled"
          placeholder="請選擇填表志工"
          class="mb20 W100"
          @change="onAutoSave"
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
        <!-- <button type="submit" class="btn" v-show="!isDisabled">
          {{ loadingSubmit ? "儲存中..." : "送出" }}
        </button> -->
        <p
          v-if="lastSavedAt"
          class="saved-time"
          style="margin-bottom: 10px; float: right"
        >
          上次儲存：{{ $dayjs(lastSavedAt).format("HH:mm:ss") }}
        </p>
        <button type="submit" class="btn" v-show="!isDisabled">
          <template v-if="saveStatus === 'saving'">儲存中...</template>
          <template v-else-if="saveStatus === 'error'"
            >儲存失敗，請手動重試</template
          >
          <template v-else>儲存表單</template>
        </button>

        <button
          type="button"
          class="btn line-green"
          v-show="!isDisabled"
          @click="ManualNotifyLine"
        >
          {{ loadingNotify ? "通知中..." : "LINE 手動發送" }}
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
import debounce from "lodash/debounce";
import FloatButton from "./../components/FloatButton.vue";
import { ShiftMap } from "../server-middleware/api/helper/constant";

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
      realtimeChannel: null,
      autoSave: null,
      saveStatus: "success", // success | saving | error
      lastSavedAt: null,
      loading: true,
      loadingSubmit: false,
      loadingNotify: false,
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

  created() {
    this.autoSave = debounce(this.UpdateRegular, 300);
  },

  async beforeMount() {
    try {
      this.InitDateAndShift();
      await Promise.all([this.InitMemberList(), this.InitRegular()]);
    } catch (error) {
      console.error(error);

      this.$swal.fire({
        html: `網路連線異常<br>請確認 4G 和 Wi-Fi 連線後重試<br>或聯繫俊翔。<br><br>錯誤資訊：<br>${error.message}`,
        showClass: {
          popup: "animate__animated animate__fadeIn animate__faster",
        },
        hideClass: {
          popup: "",
        },
        confirmButtonColor: "#b33a39",
        confirmButtonText: "關閉",
      });
    } finally {
      this.loading = false;
    }
  },

  async mounted() {
    await this.InitPrevRegular();
  },

  updated() {},

  methods: {
    onAutoSave() {
      if (this.formData.recordId) {
        this.autoSave();
      }
    },
    subscribeToRealtime(recordId) {
      this.realtimeChannel = this.$supabase
        .channel("regular-realtime")
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "regulars",
            filter: `id=eq.${recordId}`,
          },
          (payload) => {
            console.log("payload", payload);
            if (payload.new) {
              const {
                id: recordId,
                cats,
                date: strDate,
                shift: strShift,
                member,
                note,
              } = payload.new;

              this.formData.recordId = recordId;
              this.formData.date = new Date(strDate);
              this.formData.shift = strShift;
              this.formData.cats = JSON.parse(cats);
              this.formData.note = note;
              this.formData.member = member;
            }
          }
        )
        .subscribe();
    },
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

      await this.SubmitForm();
      return;
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
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    async SubmitForm() {
      try {
        this.loadingSubmit = true;

        await this.UpdateRegular();
        return;
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
          confirmButtonText: "關閉",
        });
      } catch (error) {
        this.$swal.fire({
          html: "表單送出失敗。<br>請確認網路狀態後重試，<br>或聯繫俊翔。",
          showClass: {
            popup: "animate__animated animate__fadeIn animate__faster",
          },
          hideClass: {
            popup: "",
          },
          showCancelButton: false,
          confirmButtonColor: "#b33a39",
          confirmButtonText: "關閉",
        });

        console.error(error);
      } finally {
        this.loadingSubmit = false;
      }
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
        } = regular;

        this.formData.recordId = recordId;
        this.formData.date = new Date(strDate);
        this.formData.shift = strShift;
        this.formData.cats = cats;
        this.formData.note = note;
        this.formData.member = member;

        this.subscribeToRealtime(recordId);
      } catch (e) {
        console.error(e);
        throw e;
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
        throw e;
      }
    },

    async UpdateRegular() {
      try {
        this.saveStatus = "saving";

        const { recordId, date, shift, cats, note, member } = this.formData;

        await this.$axios.$post("/regular/update", {
          recordId,
          date: this.$dayjs(date).format("MM/DD/YYYY"),
          shift,
          cats,
          note,
          member,
        });

        this.saveStatus = "success";
        this.lastSavedAt = new Date();
      } catch (e) {
        console.error(e);
        this.saveStatus = "error";
        throw e;
      }
    },

    async ManualNotifyLine() {
      try {
        this.loadingNotify = true;

        const textDate = this.$dayjs(this.formData.date).format("YYYY/MM/DD");
        const textShift = ShiftMap(this.formData.shift);
        const textPush = `飲食及如廁紀錄\n---------------\n日期： ${textDate}\n班別： ${textShift}\n志工： ${
          this.formData.member || ""
        }\n回報：\n${this.formData.note || ""}`;
        const textSite =
          process.env.deploySite == "feliformia"
            ? ""
            : `[${process.env.deploySite || "Local"}]\n`;
        const textManual = "[大哥通知]\n";

        const htmlPush = `<div style="text-align: left;"><b><h3>將以下訊息通知大哥</h3></b>飲食及如廁紀錄<br>---------------<br>日期： ${textDate}<br>班別： ${textShift}<br>志工： ${
          this.formData.member || ""
        }<br>回報：<br>${this.formData.note || ""}</div>`;

        const { isConfirmed } = await this.$swal.fire({
          // title: "",
          html: htmlPush,
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
          try {
            await this.$axios.$post("/line/message/push", {
              text: textSite + textManual + textPush,
            });

            this.$swal.fire({
              text: "手動發送成功",
              showClass: {
                popup: "animate__animated animate__fadeIn animate__faster",
              },
              hideClass: {
                popup: "",
              },
              showCancelButton: false,
              confirmButtonColor: "#b33a39",
              confirmButtonText: "關閉",
            });
          } catch (e) {
            this.$swal.fire({
              html: "手動發送失敗。<br>請確認網路狀態後重試，<br>或聯繫俊翔。",
              showClass: {
                popup: "animate__animated animate__fadeIn animate__faster",
              },
              hideClass: {
                popup: "",
              },
              confirmButtonColor: "#b33a39",
              confirmButtonText: "關閉",
            });
          }
        }
      } catch (e) {
        console.error(e);
        throw e;
      } finally {
        this.loadingNotify = false;
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

  .line-green {
    background-color: #03c100; // Line 綠色
    color: white;
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
