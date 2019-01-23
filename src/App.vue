<template>
  <div id="app" class="container-fluid">
    <form @submit.prevent="getElements">
      <div>
        <b>Дата:</b>
        <div class="form-group">
          <date-picker/>
        </div>
      </div>
      <div v-if="executors.length">
        <b>Исполнитель:</b>
        <div class="form-group">
          <select class="form-control form-control-sm" v-model="executor">
            <option
              :key="'opt-executor-' + index"
              v-for="(ex, index) in executors"
              :value="ex.value"
            >{{ ex.text }}</option>
          </select>
        </div>
      </div>
      <div class="form-group">
        <button
          class="btn btn-sm btn-info"
          :disabled="loading || !executor"
          type="submut"
        >Получить задания!</button>
      </div>
    </form>
    <div id="print-block" v-if="executor && tasks.length">
      <div style="text-align: center">
        <p style="font-size: 18px; margin-bottom: 5px; margin-top: 5px">
          <b>ЗАКАЗ-НАРЯД</b>
        </p>
        <p style="font-size: 18px; margin-bottom: 5px; margin-top: 5px">
          <b>на производство работ</b>
        </p>
        <p style="font-size: 14px; margin-bottom: 5px; margin-top: 5px">
          должность, ФИО специалиста
          <i style="text-decoration: underline">{{ executorName }}</i>
        </p>
        <p style="font-size: 14px; margin-bottom: 5px; margin-top: 5px">
          За смену с
          <u>{{ hourStart }}</u> до
          <u>{{ hourEnd }}</u>
          часов{{ ' ' }}
          «<u>{{ day }}</u>»
          <u>{{ monthName }}</u>
          {{ ' ' }}
          <u>{{ year }}</u> г.
        </p>
      </div>
      <table class="table table-bordered small">
        <thead>
          <tr>
            <th style="width: 100px"></th>
            <th style="width: 200px">Дата поступления задания</th>
            <th>Объект</th>
            <th>Задание (подробное описание)</th>
            <th>Подпись и ФИО принявшего работу</th>
            <th>Комментарий по выполнению заявки</th>
          </tr>
        </thead>
        <tbody>
          <tr :key="t.id" v-for="t in tasks">
            <td style="width: 100px">{{ t.id}}</td>
            <td style="width: 200px">{{ t.creationDate}}</td>
            <td>{{ t.taskObject }}</td>
            <td>{{ t.taskDescription }}</td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
    <button
      class="btn btn-sm btn-success"
      @click="printDocument"
      v-if="executor && tasks.length"
    >Распечатать!</button>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import { Printd } from "printd";
import DatePicker from "./components/DatePicker.vue";

const printD = new Printd();
const cssText = `
  table {
		border-collapse: collapse;
		width: 100%;
	}
	td, th {
		padding: 3px;
		border: 1px solid black;
  }
`;

export default {
  name: "app",
  components: {
    "date-picker": DatePicker
  },
  computed: {
    ...mapState([
      "day",
      "executor",
      "executors",
      "hourEnd",
      "hourStart",
      "loading",
      "month",
      "months",
      "tasks",
      "year"
    ]),
    executor: {
      get() {
        return this.$store.state.executor;
      },
      set(value) {
        this.$store.commit("updateTasksForm", { executor: value });
      }
    },
    executorName() {
      if (
        Array.isArray(this.executors) &&
        this.executors.length &&
        this.executor
      ) {
        return this.executors.filter(ex => ex.value === this.executor)[0].text;
      } else {
        return null;
      }
    },
    monthName() {
      if (Array.isArray(this.months) && this.months.length && this.month) {
        return this.months.filter(m => m.value === this.month)[0].text;
      } else {
        return null;
      }
    }
  },
  async created() {
    await this.appInit();
    await this.getElementFields();
  },
  methods: {
    ...mapActions(["appInit", "getElementFields", "getElements"]),
    printDocument() {
      printD.print(document.getElementById("print-block"), cssText);
    }
  }
};
</script>
