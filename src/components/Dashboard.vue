<template>
  <div>
    <div class="flex-container">
      <DataCard title="Total Amount" :content="totalAmount" color="blue"/>
      <DataCard title="Total Items" :content="items.length.toString()" color="green"/>
      <DataCard title="Timeline" :content="`${earliestDate} – ${latestDate}`" color="red"/>
    </div>
    <DataTable :columns="columns" :items="items" :options="options" :deleteHandler="deleteItem"/>
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
      items: [],
      columns: ["id", "name", "description", "date", "amount"],
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
    this.items = data;
    this.itemsSortedByDate = _.sortBy(this.items, "date", "asc");
  },
  computed: {
    totalAmount() {
      return this.items.reduce((a, b) => a + b.amount, 0).toString();
    },
    earliestDate() {
      if (!this.items.length) return "";
      return this.convertDate(this.itemsSortedByDate[0].date);
    },
    latestDate() {
      if (!this.items.length) return "";

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
      this.items = this.items.filter(item => item !== value);
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
