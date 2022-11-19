<template>
  <div class="wrapper" id="medicine">
    <h1>卯咪餵藥週表</h1>
    <form v-on:submit.prevent="Submit">
      <div class="d_flex">
        <div class="W100 arrow">
          <el-select
            style="width: 100%"
            v-model="selectedCat"
            placeholder="請選擇卯咪"
          >
            <el-option
              v-for="(cat, key) in optionsCats"
              :label="cat"
              :value="cat"
              :key="key"
            >
            </el-option>
          </el-select>
        </div>
      </div>
    </form>
    <el-empty v-if="!selectedCat" description="請選擇卯咪"></el-empty>
    <template v-for="data in computedTableData">
      <div class="date-label">{{ data.date }} - {{ data.shift }}</div>
      <el-table
        class="weekly-table"
        :data="data.treatment"
        header-cell-class-name="weekly-head"
        cell-class-name="weekly-cell"
        border
        style="width: 100%"
        empty-text="尚未選擇卯咪"
      >
        <el-table-column
          align="center"
          prop="name"
          label="事項"
          min-width="80%"
        >
          <template slot-scope="scope">
            <span>
              {{ scope.row.treatment }}
            </span>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          prop="name"
          label="完成"
          min-width="20%"
        >
          <template slot-scope="scope">
            <i
              v-if="scope.row.done"
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
      </el-table>
    </template>

    <!-- <el-table
      class="weekly-table"
      :data="computedTableData"
      header-cell-class-name="weekly-head"
      cell-class-name="weekly-cell"
      border
      stripe
      style="width: 100%"
      empty-text="尚未選擇卯咪"
    >
      <el-table-column align="center" fixed label="班別" min-width="20%">
        <template slot-scope="scope">
          {{ scope.row.date }} {{ scope.row.shift }}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="name" label="事項" min-width="60%">
        <template slot-scope="scope">
          <span :class="{ warning: isWarningCell(scope.row.feed) }">
            {{ scope.row.feed }}
          </span>
        </template>
      </el-table-column>

      <el-table-column align="center" prop="name" label="完成" min-width="20%">
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
    </el-table> -->
  </div>
</template>

<script>
export default {
  layout: "weekly",
  head: {
    title: "卯咪餵藥週表",
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
          const cat = cats.filter(function (item, index, array) {
            return item.name == selectedCat;
          });
          if (!cat) {
            return accumulator;
          }
          // 班別 - 日期
          const newDate = this.$dayjs(date).format("MM/DD");

          // 班別 - 早晚班
          const shiftMap = {
            morning: "早",
            night: "晚",
          };
          const newShift = shiftMap[shift];

          return !cat
            ? accumulator
            : [
                ...accumulator,
                {
                  id,
                  date: newDate,
                  shift: newShift,
                  treatment: cat,
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
          "/medicine/between",
          {
            dateStart: this.$dayjs().subtract(7, "day").format("MM/DD/YYYY"),
            dateEnd: this.$dayjs().format("MM/DD/YYYY"),
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

      const objCats = dataWeekly.reduce(
        (accumulator, currentValue, currentIndex, array) => {
          let cats = {};
          currentValue.cats.forEach((dataCat) => {
            cats[dataCat.name] = true;
            // TODO : Medicine 超連結
            // if (queryCat && queryCat === dataCat.cat.recordId) {
            //   this.selectedCat = dataCat.cat.recordId;
            // }
          });
          return { ...accumulator, ...cats };
        },
        {}
      );

      const arrCats = Object.keys(objCats).map((key) => {
        return key;
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
    margin: 0 0 32px 0;
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

#medicine {
  a {
    display: block;
  }
  div.date-label {
    float: left;
    padding: 4px 6px;
    font-size: 14px;

    color: #fff;
    border-radius: 4px;
    background-color: #b28c6e;
  }
}
</style>
