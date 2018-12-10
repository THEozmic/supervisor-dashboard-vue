<template>
  <div class="data-table">
    <div class="table-wrapper">
      <div class="toolbar">
        <button
          class="delete-button delete-button--visible"
          v-if="selectedItems.length > 0"
          @click="deleteSelectedItems"
        >Delete Selected</button>
        <input class="search-box" type="text" v-model="searchTerm" placeholder="Type to search">
      </div>
      <table class="table" v-if="items.length > 0">
        <tr>
          <th>
            <input
              type="checkbox"
              :checked="selectedItems.length === localItems.length"
              class="checkbox-item"
              @click="() => updateSelectedItems()"
            >
          </th>
          <th @click="() => orderBy(key)" v-for="key in columns" v-bind:key="key">
            <span class="table__icon" v-if="currentOrder[key] === 'desc' ">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <polygon
                  points="9 16.172 2.929 10.101 1.515 11.515 10 20 10.707
                19.293 18.485 11.515 17.071 10.101 11 16.172 11 0 9 0"
                ></polygon>
              </svg>
            </span>
            <span class="table__icon" v-if="currentOrder[key] === 'asc'">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <polygon
                  points="9 3.828 2.929 9.899 1.515 8.485 10 0 10.707 .707 
                18.485 8.485 17.071 9.899 11 3.828 11 20 9 20 9 3.828"
                ></polygon>
              </svg>
            </span>
            {{ key.toUpperCase() }}
          </th>
          <th></th>
        </tr>
        <tr v-for="(item, index) in localItems" v-bind:key="index">
          <td>
            <input
              type="checkbox"
              class="checkbox-item"
              :checked="isSelected(index)"
              @click="() => updateSelectedItems(index)"
            >
          </td>
          <td v-for="(value, key) in item" v-bind:key="key">
            <div
              v-if="options && options[key] && options[key].isEditable"
              class="table-value-wrapper"
            >
              <textarea
                v-on:keyup="resizeTextarea"
                v-model="localItems[index][key]"
                @change="() => options[key].handleChange({ newValue: localItems[index][key], index })"
                class="table-value"
              ></textarea>
            </div>
            <span
              v-else
            >{{ options && options[key] && options[key].presenter ? options[key].presenter(value) : value }}</span>
          </td>
          <td>
            <button class="delete-button" @click="() => handleDelete(index)">Delete</button>
          </td>
        </tr>
      </table>
      <div v-else class="empty-table-message">Nothing to show</div>
      <div class="table-footer">
        <div class="pagination">
          <div>
            <label>Rows per page:</label>
            <select class="pagination__options" v-model="rowsPerPage">
              <option value="10">10</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </div>
          <div class="pagination__controls">
            <span
              :class="`controls-icon ${!canPaginateBack ? 'disabled' : '' }`"
              @click="() => changeCurrentPage({ isFoward: false })"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <polygon
                  points="3.828 9 9.899 2.929 8.485 1.515 0 10 .707 10.707 8.485 18.485 9.899 17.071 3.828 11 20 11 20 9 3.828 9"
                ></polygon>
              </svg>
            </span>
            <span
              :class="`controls-icon ${!canPaginateFront ? 'disabled' : '' }`"
              @click="() => changeCurrentPage({ isFoward: true })"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <polygon
                  points="16.172 9 10.101 2.929 11.515 1.515 20 10 19.293 10.707 11.515 18.485 10.101 17.071 16.172 11 0 11 0 9"
                ></polygon>
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import { debug } from "util";
export default {
  name: "DataTable",
  props: {
    items: {
      type: Array,
      required: true
    },
    columns: {
      type: Array,
      required: true
    },
    options: {
      type: Object
    },
    deleteHandler: {
      types: Function,
      required: true
    }
  },
  data() {
    return {
      localItems: [...this.items],
      currentOrder: {},
      searchTerm: "",
      currentPage: 1,
      canPaginateFront: true,
      canPaginateBack: false,
      rowsPerPage: 10,
      lastOrderKey: null,
      selectedItems: []
    };
  },
  watch: {
    items(val) {
      this.localItems = val;
      this.handlePaginate();
    },
    searchTerm() {
      this.handleSearch();
    },
    rowsPerPage() {
      this.currentPage = 1;
      this.handlePaginate();
    }
  },
  methods: {
    isSelected(index) {
      return this.selectedItems.includes(index);
    },
    updateSelectedItems(index = null) {
      if (index === null) {
        if (this.selectedItems.length === this.localItems.length) {
          this.selectedItems = [];
        } else {
          this.selectedItems = _.range(this.localItems.length);
        }
        return;
      }
      if (!this.isSelected(index)) {
        this.selectedItems.push(index);
      } else {
        this.selectedItems = this.selectedItems.filter(item => item !== index);
      }
    },
    isLastPage() {
      const pageNumbers = this.items.length / this.rowsPerPage;
      if (pageNumbers === 0) return true;
      if (this.currentPage === pageNumbers) {
        return true;
      }
      return false;
    },
    changeCurrentPage({ isFoward }) {
      if (isFoward) {
        if (this.canPaginateFront) {
          this.currentPage = this.currentPage + 1;
          this.handlePaginate();
        }
      } else {
        if (this.canPaginateBack) {
          this.currentPage = this.currentPage - 1;
          this.handlePaginate();
        }
      }
    },
    handlePaginate() {
      this.canPaginateFront = true;
      this.canPaginateBack = true;

      this.localItems = _.orderBy(
        this.items,
        this.lastOrderKey,
        this.currentOrder[this.lastOrderKey]
      ).slice(
        (this.currentPage - 1) * this.rowsPerPage,
        this.currentPage * this.rowsPerPage
      );

      this.rowsPerPage = this.rowsPerPage;
      if (this.isLastPage()) {
        this.canPaginateFront = false;
      }

      if (this.currentPage === 1) {
        this.canPaginateBack = false;
      }
    },
    resizeTextarea(event) {
      event.target.style.height = "auto";
      event.target.style.height = event.target.scrollHeight + 5 + "px";
    },
    orderBy(key, keepOrder = false) {
      this.lastOrderKey = key;
      if (!this.hasPreviouslyOrderedWith(key)) {
        this.currentOrder = {
          [key]: "asc"
        };
      }

      if (!keepOrder) {
        this.flipOrder(key);
      }

      this.localItems = _.orderBy(this.items, key, this.currentOrder[key]);
      this.handlePaginate();
    },
    hasPreviouslyOrderedWith(key) {
      return !!this.currentOrder[key];
    },
    flipOrder(key) {
      if (this.currentOrder[key] === "asc") {
        this.currentOrder[key] = "desc";
      } else {
        this.currentOrder[key] = "asc";
      }
    },
    handleSearch() {
      this.localItems = this.items;
      this.localItems = this.localItems.filter(item => {
        return Object.keys(item).some(key => {
          if (
            this.options &&
            this.options[key] &&
            this.options[key].presenter
          ) {
            return this.options[key]
              .presenter(item[key])
              .toString()
              .toLowerCase()
              .includes(this.searchTerm.toLowerCase());
          }
          return item[key]
            .toString()
            .toLowerCase()
            .includes(this.searchTerm.toLowerCase());
        });
      });
    },
    deleteSelectedItems() {
      this.selectedItems.map(indexItem => {
        this.deleteHandler(this.localItems[indexItem]);
      });
      this.selectedItems = [];
    },
    handleDelete(index) {
      this.deleteHandler(this.localItems[index]);
    }
  }
};
</script>

<style scoped>
.table-wrapper {
  background-color: #ffffff;
  overflow-x: auto;
  border-radius: 4px;
  box-shadow: 0 15px 35px 0 rgba(42, 51, 83, 0.12),
    0 5px 15px rgba(0, 0, 0, 0.06);
}

.table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
}

.empty-table-message {
  width: 100%;
  text-align: center;
  font-size: 20px;
  color: #b2b2b2;
}

.table td,
.table th {
  text-align: left;
  border-bottom: 1px solid #efeded;
  padding: 15px 30px;
  position: relative;
}

.checkbox-item {
  visibility: hidden;
}

.checkbox-item:after {
  padding: 8px;
  position: relative;
  display: block;
  border: 2px solid #3559af;
  content: "";
  border-radius: 4px;
  top: -4px;
  left: -4px;
  color: #ffffff;
  background-color: transparent;
  visibility: visible;
}

.checkbox-item:checked:after {
  background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'><path fill='%23fff' d='M0 11l2-2 5 5L18 3l2 2L7 18z'/></svg>");
  background-color: #3559af;
}

.table th {
  cursor: pointer;
}

.table__icon {
  width: 18px;
  height: 18px;
  position: absolute;
  left: 5px;
  top: 18px;
  fill: #b2b2b2;
}

.toolbar {
  width: 100%;
  display: inline-block;
  text-align: right;
  padding: 16px 30px;
}

.pagination {
  margin: 10px 20px;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.pagination label {
  margin-right: 12px;
  font-size: 18px;
}

.pagination__options {
  font-size: 20px;
  width: 70px;
  height: 48px;
  background-color: #fff;
  border: 1px solid #efeded;
  border-radius: 0;
  outline: none;
}

.controls-icon.disabled {
  fill: #c5c3c3;
  background-color: #f6f6f6;
  cursor: not-allowed;
}

.controls-icon {
  background-color: #f6f6f6;
  width: 50px;
  height: 50px;
  display: inline-block;
  border-radius: 100%;
  margin: 0 10px;
  padding: 15px;
  cursor: pointer;
}

.search-box {
  width: 30%;
  padding: 6px 10px;
  font-size: 16px;
  border: 1px solid #efeded;
  border-radius: 4px;
  background-color: #f6f6f6;
  outline: none;
}

.table-value {
  border: 1px solid transparent;
  font-size: 16px;
  padding: 10px;
  border-radius: 4px;
  background-color: #ffffff;
  resize: none;
  width: 100%;
  overflow: scroll;
  margin-left: -10px;
}

.table tr {
  transition: 0.2s all ease-in;
}

.delete-button {
  border: 1px solid;
  border-radius: 4px;
  min-width: 80px;
  font-size: 16px;
  text-transform: uppercase;
  background-color: #e91e63;
  color: #ffffff;
  padding-top: 5px;
  font-weight: bolder;
  visibility: hidden;
  cursor: pointer;
}

.delete-button--visible {
  visibility: visible;
  margin: 0 20px;
  padding: 8px;
}

.table tr:hover {
  background-color: #f3f3f4;
}

.table tr:hover .table-value {
  border: 1px solid #cecccc;
}

.table tr:hover .delete-button {
  visibility: visible;
}

.table-value:focus {
  padding: 10px;
  outline: none;
}

.table-footer {
  width: 100%;
}

@media screen and (min-width: 501px) and (max-width: 999px) {
  .search-box {
    width: 100%;
  }
}

@media screen and (max-width: 500px) {
  .search-box {
    width: 100%;
  }

  .pagination {
    display: inline-block;
    width: 100%;
    text-align: center;
    margin: 0px;
  }

  .pagination div {
    width: 100%;
    margin: 20px 0;
    text-align: center;
  }
}
</style>
