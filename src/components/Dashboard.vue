<template>
  <div>
    <div class="flex-container">
      <DataCard title="Total Amount" :content="totalAmount" color="blue"/>
      <DataCard title="Total Items" :content="tableData.length.toString()" color="green"/>
      <DataCard title="Timeline" :content="`${earliestDate} – ${latestDate}`" color="red"/>
    </div>
    <DataTable :tableData="tableData" :options="options" :deleteHandler="deleteItem"/>
  </div>
</template>

<script>
import moment from "moment";
import _ from "lodash";

import DataTable from "./DataTable.vue";
import DataCard from "./DataCard.vue";

import data from "../assets/data.json";

export default {
  name: "Dashboard",
  components: {
    DataTable,
    DataCard
  },
  data() {
    return {
      tableData: [],
      itemsSortedByDate: [],
      options: {
        date: {
          presenter: value => {
            return this.convertDate(value, "LLL");
          }
        },
        description: {
          isEditable: true,
          handleChange: ({ newValue, index }) => {
            // Can persist changes to database here
          }
        }
      }
    };
  },
  mounted() {
    this.tableData = data;
    console.log(this.tableData, ">><<>>");
    this.itemsSortedByDate = _.sortBy(this.tableData, "date", "asc");
    console.log(this.itemsSortedByDate);
  },
  computed: {
    totalAmount() {
      return this.tableData.reduce((a, b) => a + b.amount, 0).toString();
    },
    earliestDate() {
      if (!this.tableData.length) return "";
      return this.convertDate(this.itemsSortedByDate[0].date);
    },
    latestDate() {
      if (!this.tableData.length) return "";

      return this.convertDate(
        this.itemsSortedByDate[this.itemsSortedByDate.length - 1].date
      );
    }
  },
  methods: {
    convertDate(date, format = "Y") {
      return moment(date).format(format);
    },
    deleteItem(value) {
      this.tableData = this.tableData.filter(item => item !== value);
    }
  }
};
</script>

<style>
@import url("https://fonts.googleapis.com/css?family=Hind+Guntur");
* {
  box-sizing: border-box;

  font-family: "Hind Guntur", sans-serif;
}

body {
  padding: 30px;
  background-color: #f6f6f6;
}

.flex-container {
  display: flex;
  justify-content: space-between;
}

@media screen and (max-width: 999px) {
  .flex-container {
    display: inline;
  }
}
</style>
