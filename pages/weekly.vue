<template>
  <div id="regular">
    <h1>卯咪健康週表</h1>
    <form v-on:submit.prevent="Submit">
      <div class="d_flex">
        <div class="W100 arrow">
          <el-select
            style="width: 100%"
            v-model="selectedCat"
            placeholder="請選擇卯咪"
          >
            <el-option
              v-for="cat in optionsCats"
              :label="cat.name"
              :value="cat.id"
              :key="cat.id"
            >
            </el-option>
          </el-select>
        </div>
      </div>
    </form>

    <el-table
      class="weekly-table"
      :data="computedTableData"
      header-cell-class-name="weekly-head"
      cell-class-name="weekly-cell"
      border
      stripe
      style="width: 100%"
      empty-text="尚未選擇卯咪"
    >
      <el-table-column align="center" fixed label="班別" min-width="25%">
        <template slot-scope="scope">
          {{ scope.row.date }} {{ scope.row.shift }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="name" label="乾" min-width="18.75%">
        <template slot-scope="scope">
          <span :class="{ warning: isWarningCell(scope.row.feed) }">
            {{ scope.row.feed }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="name" label="罐" min-width="18.75%">
        <template slot-scope="scope">
          <span :class="{ warning: isWarningCell(scope.row.can) }">
            {{ scope.row.can }}
          </span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="name" label="尿" min-width="18.75%">
        <template slot-scope="scope">
          <i
            v-if="scope.row.urine"
            style="color: #0071b0; font-size: 20px"
            class="el-icon-check"
          ></i>
          <i
            v-else
            style="color: #740a00; font-size: 20px"
            class="el-icon-close"
          ></i>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="name" label="屎" min-width="18.75%">
        <template slot-scope="scope">
          <i
            style="color: #0071b0; font-size: 20px"
            v-if="scope.row.feces == '正常'"
            class="el-icon-check"
          ></i>
          <i
            v-else-if="scope.row.feces == false"
            style="color: #740a00; font-size: 20px"
            class="el-icon-close"
          ></i>
          <span v-else :class="{ warning: isWarningCell(scope.row.feces) }">
            {{ scope.row.feces }}
          </span>
        </template>
      </el-table-column>
    </el-table>
    <FloatButton />
  </div>
</template>

<script>
import FloatButton from "./../components/FloatButton.vue";
export default {
  components: {
    FloatButton,
  },
  layout: "weekly",
  head: {
    title: "卯咪健康週表",
  },
  data() {
    return {
      selectedCat: "",
      optionsCats: [],
      tableData: [
        {
          date: "03-01",
          shift: "早",
          feed: true,
          feed_detail: 100,
          can: false,
          can_detail: 0,
          feces: true,
          feces_warning: "正常",
          urine: true,
        },
      ],

      dataWeekly: [],
    };
  },
  computed: {
    computedTableData() {
      const { dataWeekly, selectedCat, tableData } = this;

      if (!selectedCat) {
        return [];
      }

      const arrCatWeek = dataWeekly.reduce(
        (accumulator, { id, date, shift, cats }, currentIndex, array) => {
          const cat = cats.find(function (item, index, array) {
            return item.cat.Id == selectedCat;
          });
          if (!cat) {
            return accumulator;
          }

          const {
            feed,
            feed_detail,
            can,
            can_detail,
            feces,
            feces_warning,
            urine,
          } = cat;

          // 映射表
          const shiftMap = {
            morning: "早",
            night: "晚",
          };
          const markMap = {
            0: "沒吃",
            25: "吃1/3",
            50: "吃1/2",
            75: "吃2/3",
            100: "吃光",
          };

          // 班別 - 日期
          const newDate = this.$dayjs(date).format("MM/DD");

          // 班別 - 早晚班
          const newShift = shiftMap[shift];

          // 乾
          let newFeed = "";
          if (feed) {
            newFeed = markMap[feed_detail];
          }

          // 罐
          let newCan = "";
          if (can) {
            newCan = markMap[can_detail];
          }

          // 尿
          let newUrine = urine;

          // 便
          let newFeces = false;
          if (feces) {
            newFeces = feces_warning;
          }

          return !cat
            ? accumulator
            : [
                ...accumulator,
                {
                  id,
                  date: newDate,
                  shift: newShift,
                  feed: newFeed,
                  can: newCan,
                  feces: newFeces,
                  urine: newUrine,
                },
              ];
        },
        []
      );

      if (arrCatWeek.length > 0) return [...arrCatWeek];
    },
  },

  created() {},

  async beforeMount() {},

  async mounted() {
    await this.InitWeekly();
    await this.InitCatList();
  },

  methods: {
    async InitWeekly() {
      try {
        const { data: dataWeekly } = await this.$axios.$post(
          "/regular/between",
          {
            dateStart: this.$dayjs().subtract(7, "day").format("YYYY-MM-DD"),
            dateEnd: this.$dayjs().format("YYYY-MM-DD"),
          }
        );
        this.dataWeekly = [...dataWeekly];
      } catch (e) {
        console.error(e);
      }
    },

    async InitCatList() {
      const { dataWeekly } = this;
      const queryCat = this.$route.query.cat;

      // tmp: nocodb 轉換時期的短暫修正
      const catMap = {
        rec0xzYZAVfQCjxLV: "1",
        recB3enypPUcjz8fJ: "2",
        recBAaWZDsH2Vzggq: "3",
        recD5bj4jRSWIwwer: "4",
        recLofdWO4ZtBz7iz: "5",
        recNdlkK4kSrVsCUt: "6",
        recPA6UKMhB1PzWM8: "7",
        recTNLtGAL6KwXkTd: "8",
        recUBheGMfjVkFjlQ: "9",
        recW7li1OBfpVVUm5: "10",
        recWT0W5XkQDtxg2R: "11",
        reciPLimCpNQOcoRN: "12",
        recjyz4JspGJLphhk: "13",
        reclhSCimZ4JnCLUu: "14",
        recoGIWcdBwY99LCR: "15",
        recqfphUWxeNYHLcw: "17",
        recrVZroAQeESrYJj: "18",
        recs0gPLGMrFnWzic: "20",
        recsjezmAMjQoROJ2: "21",
      };

      const objCats = dataWeekly.reduce(
        (accumulator, currentValue, currentIndex, array) => {
          let cats = {};
          currentValue.cats.forEach((dataCat) => {
            // tmp: nocodb 轉換時期的短暫修正
            if (!dataCat.cat.Id) {
              dataCat.cat.Id = catMap[dataCat.cat.recordId];
            }

            cats[dataCat.cat.Id] = dataCat.cat.name;
            if (queryCat && queryCat === dataCat.cat.Id) {
              this.selectedCat = dataCat.cat.Id;
            }
          });
          return { ...accumulator, ...cats };
        },
        {}
      );

      const arrCats = Object.keys(objCats).map((key) => {
        return { id: key, name: objCats[key] };
      });

      this.optionsCats = [...arrCats];
    },

    isWarningCell(status) {
      return ~["沒吃", "軟便", "拉稀"].indexOf(status);
    },
  },
};
</script>

<style lang="scss">
.el-table {
  &.weekly-table {
    margin: 0 0 48px 0;
  }
  .weekly-head {
    height: 36px;
    background: #a58f86 !important;
    color: #fff;
    font-size: 16px;
    line-height: 16px;
    font-weight: 400;
    padding: 4px 0;
  }
  .weekly-cell {
    // font-size: 16px !important;
    // line-height: 16px;
    > .cell {
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }
  span.warning {
    color: #b7282e;
  }
}

#regular {
  a {
    display: block;
  }
}
</style>
