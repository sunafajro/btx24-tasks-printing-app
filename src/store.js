import Vue from "vue";
import Vuex from "vuex";
import moment from "moment";
import Noty from "noty";
import { init, listsFieldGet, listsElementGet } from "./methods";
import { getNumbers, getDays, getMonths, getYears } from "./utils";

Vue.use(Vuex);
const el = document.getElementById("app");

export default new Vuex.Store({
  state: {
    hourEnd: moment()
    .add(1, "hours")
    .format("HH"),
    hourStart: moment().format("HH"),
    day: moment().format("DD"),
    month: moment().format("MM"),
    year: moment().format("YYYY"),
    hours: getNumbers(0, 23),
    days: getDays({
      month: moment().format("MM"),
      year: moment().format("YYYY")
    }),
    months: getMonths(),
    years: getYears(),
    executor: null,
    executors: [],
    fields: {
      executorId: null,
      taskObjectId: null,
      taskStatusId: null
    },
    finished: null,
    listId: el.dataset.listid,
    loading: true,
    tasks: []
  },
  mutations: {
    updateExecutors(state, data) {
      state.executors = data;
    },
    updateFields(state, data) {
      state.fields = data;
      state.loading = false;
    },
    updateFinished(state, data) {
      state.finished = data;
    },
    updateTasks(state, data) {
      state.tasks = data;
    },
    updateTasksForm(state, data) {
      if (data.hasOwnProperty("executor")) {
        state.executor = data.executor;
      }
      if (data.hasOwnProperty("hourEnd")) {
        state.hourEnd = data.hourEnd;
      }
      if (data.hasOwnProperty("hourStart")) {
        state.hourStart = data.hourStart;
      }
      if (data.hasOwnProperty("day")) {
        state.day = data.day;
      }
      if (data.hasOwnProperty("month")) {
        state.month = data.month;
      }
      if (data.hasOwnProperty("year")) {
        state.year = data.year;
      }
      if (data.hasOwnProperty("month") || data.hasOwnProperty("year")) {
        state.day = "01";
        state.days = getDays({
          month: data.hasOwnProperty("month") ? data.month : state.month,
          year: data.hasOwnProperty("year") ? data.year : state.year
        });
      }
    }
  },
  actions: {
    async appInit({ dispatch }) {
      try {
        await init();
      } catch (e) {
        dispatch("showNotification", {
          text: "Ошибка инициализации приложения!",
          type: "error"
        });
      }
    },
    async getElementFields({ commit, dispatch, state }) {
      try {
        const rawFields = await listsFieldGet({ listId: state.listId });
        const filteredFields = Object.keys(rawFields).reduce((a, v) => {
          switch (rawFields[v].NAME) {
            case "Объект":
              a.taskObjectId = rawFields[v].FIELD_ID;
              break;
            case "Иcполнитель": {
              a.executorId = rawFields[v].FIELD_ID;
              const data = Object.keys(rawFields[v].DISPLAY_VALUES_FORM).map(
                item => {
                  return {
                    text: rawFields[v].DISPLAY_VALUES_FORM[item],
                    value: String(item)
                  };
                }
              );
              commit("updateExecutors", data);
              break;
            }
            case "Статус заявки": {
              a.taskStatusId = rawFields[v].FIELD_ID;
              const finished = Object.keys(
                rawFields[v].DISPLAY_VALUES_FORM
              ).filter(
                item => rawFields[v].DISPLAY_VALUES_FORM[item] === "Завершена"
              )[0];
              commit("updateFinished", finished);
              break;
            }
            default:
          }
          return a;
        }, {});
        commit("updateFields", filteredFields);
      } catch (e) {
        dispatch("showNotification", {
          text: "Ошибка получения списка полей!",
          type: "error"
        });
      }
    },
    async getElements({ commit, dispatch, state }) {
      try {
        const start = state.day + "." + state.month + "." + state.year + " " + state.hourStart + ":" + "00:" + "00";
        const end = state.day + "." + state.month + "." + state.year + " " + state.hourEnd + ":" + "59:" + "59";
        const elements = await listsElementGet({
          start,
          end,
          listId: state.listId,
          executorProp: { name: state.fields.executorId, value: state.executor },
          statusProp: { name: state.fields.taskStatusId, value: state.finished }
        });
        const data = elements.map(e => {
          const to = e[state.fields.taskObjectId];
          return {
            id: e.ID,
            creationDate: e.DATE_CREATE,
            taskObject: to[Object.keys(to)[0]],
            taskDescription: e.PREVIEW_TEXT,
            executorId: e[state.fields.executorId]
          };
        });
        if (Array.isArray(data) && !data.length) {
          dispatch("showNotification", {
            text: "Для исполнителя отсутствуют заявки в указанном интервале времени!",
            type: "info"
          });
        }
        commit("updateTasks", data);
      } catch (e) {
        dispatch("showNotification", {
          text: "Ошибка получения заданий!",
          type: "error"
        });
      }
    },
    showNotification(args, payload) {
      new Noty({
        theme: "bootstrap-v4",
        text: payload.text,
        timeout: 2000,
        type: payload.type
      }).show();
    }
  }
});
