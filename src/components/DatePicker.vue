<template>
  <div class="row">
    <div class="col-3" style="display: flex">
      <div class="input-group input-group-sm" style="margin-right: 0.5rem">
        <div class="input-group-prepend">
          <label class="input-group-text" for="inputHourStart">с:</label>
        </div>
        <select id="inputHourStart" class="form-control form-control-sm" v-model="hourStart">
          <option
            :key="'opt-hour-from-' + index"
            v-for="(h, index) in hours"
            :value="h.value"
          >{{ h.text }}</option>
        </select>
      </div>
      <div class="input-group input-group-sm">
        <div class="input-group-prepend">
          <label class="input-group-text" for="inputHourEnd">по:</label>
        </div>
        <select id="inputHourEnd" class="form-control form-control-sm" v-model="hourEnd">
          <option
            :key="'opt-hour-to-' + index"
            v-for="(h, index) in hours"
            :value="h.value"
          >{{ h.text }}</option>
        </select>
      </div>
    </div>
    <div class="col-3">
      <div class="input-group input-group-sm" style="margin-right: 0.5rem">
        <div class="input-group-prepend">
          <label class="input-group-text" for="inputDay">Д:</label>
        </div>
        <select id="inputDay" class="form-control form-control-sm" v-model="day">
          <option :key="'opt-day-' + index" v-for="(d, index) in days" :value="d.value">{{ d.text }}</option>
        </select>
      </div>
    </div>
    <div class="col-3">
      <div class="input-group input-group-sm" style="margin-right: 0.5rem">
        <div class="input-group-prepend">
          <label class="input-group-text" for="inputMonth">М:</label>
        </div>
        <select id="inputMonth" class="form-control form-control-sm" v-model="month">
          <option
            :key="'opt-month-' + index"
            v-for="(m, index) in months"
            :value="m.value"
          >{{ m.text }}</option>
        </select>
      </div>
    </div>
    <div class="col-3">
      <div class="input-group input-group-sm" style="margin-right: 0.5rem">
        <div class="input-group-prepend">
          <label class="input-group-text" for="inputYear">Г:</label>
        </div>
        <select id="inputYear" class="form-control form-control-sm" v-model="year">
          <option
            :key="'opt-year-' + index"
            v-for="(y, index) in years"
            :value="y.value"
          >{{ y.text }}</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

export default {
  computed: {
    ...mapState([
      "hourEnd",
      "hourStart",
      "hours",
      "day",
      "days",
      "month",
      "months",
      "year",
      "years"
    ]),
    hourEnd: {
      get() {
        return this.$store.state.hourEnd;
      },
      set(value) {
        this.$store.commit("updateTasksForm", { hourEnd: value });
      }
    },
    hourStart: {
      get() {
        return this.$store.state.hourStart;
      },
      set(value) {
        this.$store.commit("updateTasksForm", { hourStart: value });
      }
    },
    day: {
      get() {
        return this.$store.state.day;
      },
      set(value) {
        this.$store.commit("updateTasksForm", { day: value });
      }
    },
    month: {
      get() {
        return this.$store.state.month;
      },
      set(value) {
        this.$store.commit("updateTasksForm", { month: value });
      }
    },
    year: {
      get() {
        return this.$store.state.year;
      },
      set(value) {
        this.$store.commit("updateTasksForm", { year: value });
      }
    }
  }
};
</script>
