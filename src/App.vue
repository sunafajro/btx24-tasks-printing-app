<template>
  <div id="app" class="container-fluid">
    <form @submit.prevent="getElements">
      <div class="row">
        <div class="col-4">
          <b>Интервал:</b>
          <div class="form-group">
            <select class="form-control form-control-sm" v-model="mode">
              <option value="today">Сегодня</option>
              <option value="all">За все время</option>
            </select>
          </div>
        </div>
        <div class="col-8">
          <b>Подразделение:</b>
          <div class="form-group">
            <select class="form-control form-control-sm" :disabled="!units.length" v-model="unit">
              <option
                :key="'opt-unit-' + index"
                v-for="(ex, index) in units"
                :value="ex.value"
              >{{ ex.text }}</option>
            </select>
          </div>
        </div>
      </div>
      <div>
        <b>Исполнитель:</b>
        <div class="form-group">
          <select
            class="form-control form-control-sm"
            :disabled="!executors.length"
            v-model="executor"
          >
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
      </div>
      <table class="table table-bordered small">
        <thead>
          <tr>
            <th style="width: 100px"></th>
            <th style="width: 200px">Дата поступления задания</th>
            <th>Объект</th>
            <th>Задание (подробное описание)</th>
            <th>Подпись и ФИО принявшего работу</th>
            <th>Комментарий о НЕисполнении</th>
            <th>ФИО обрабатывающего заказ-наряд</th>
            <th>Израсходовано</th>
          </tr>
        </thead>
        <tbody>
          <tr :key="t.id" v-for="t in tasks">
            <td style="width: 100px">{{ t.id}}</td>
            <td style="width: 200px">{{ t.creationDate}}</td>
            <td>{{ t.taskObject }}</td>
            <td v-html="t.taskDescription"></td>
            <td></td>
            <td>{{ t.taskComment }}</td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
      <table :style="customCss.tblMain">
        <tbody>
          <tr>
            <td :style="customCss.tblTdBig">Подпись специалиста</td>
            <td :style="customCss.tblTdBig">_________________/</td>
            <td :style="customCss.tblTdBig">_________________/</td>
          </tr>
          <tr>
            <td :style="customCss.tblTgSmall"></td>
            <td :style="customCss.tblTgSmall">подпись</td>
            <td :style="customCss.tblTgSmall">фио</td>
          </tr>
          <tr>
            <td :style="customCss.tblTdBig">Время сдачи заказ-наряда</td>
            <td colspan="2" :style="customCss.tblTdBig">___________________________________</td>
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

const printD = new Printd();
const cssText = `
  table {
		border-collapse: collapse;
		width: 100%;
  }
	td, th {
    border: 1px solid black;
    font-size: 14px;
    height: 60px;
    padding: 5px;
  }
`;

export default {
  name: "app",
  data() {
    return {
      customCss: {
        tblMain: "margin-top: 5px; margin-bottom: 5px; width: auto",
        tblTdBig: "border: none; font-size: 14px; height: auto",
        tblTgSmall:
          "border: none; font-size: 10px; text-align: center; height: auto"
      }
    };
  },
  computed: {
    ...mapState([
      "executor",
      "executors",
      "loading",
      "mode",
      "tasks",
      "unit",
      "units"
    ]),
    mode: {
      get() {
        return this.$store.state.mode;
      },
      set(value) {
        this.$store.commit("updateTasksForm", { mode: value });
      }
    },
    unit: {
      get() {
        return this.$store.state.unit;
      },
      set(value) {
        this.$store.commit("updateTasksForm", { unit: value });
      }
    },
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
