import Vue from "vue";
import Vuex from "vuex";
import Noty from "noty";
import moment from "moment";
import { init, listsFieldGet, listsElementGet } from "./methods";

Vue.use(Vuex);
const el = document.getElementById("app");

export default new Vuex.Store({
  state: {
    // выбранный в форме исполнитель
    executor: null,
    // список доступных элементов поля "Исполнитель"
    executors: [],
    fields: {
      // идентификатор поля "Дата поступления заявки"
      createdId: null,
      // идентификатор поля "Исполнитель"
      executorId: null,
      taskObjectId: null,
      // идентификатор поля "Статус заявки"
      taskStatusId: null,
      // идентификатор поля "Подразделеие"
      unitId: null
    },
    mode: "today",
    statuses: null,
    // идентификатор группы
    groupId: el.dataset.groupid,
    // идентификатор универсального списка
    listId: el.dataset.listid,
    loading: true,
    // список заданий
    tasks: [],
    // за текущйй день
    today: {
      start: moment()
        .startOf("day")
        .format("YYYY-MM-DD HH:mm:ss"),
      end: moment()
        .endOf("day")
        .format("YYYY-MM-DD HH:mm:ss")
    },
    // выбранное подразделение
    unit: null,
    // список доступных элементов поля "Подразделение"
    units: []
  },
  mutations: {
    updateExecutors(state, data) {
      state.executors = data;
    },
    updateFields(state, data) {
      state.fields = data;
      state.loading = false;
    },
    updateStatuses(state, data) {
      state.statuses = data;
    },
    updateTasks(state, data) {
      state.tasks = data;
    },
    updateTasksForm(state, data) {
      if (data.hasOwnProperty("executor")) {
        state.executor = data.executor;
      }
      if (data.hasOwnProperty("unit")) {
        state.unit = data.unit;
      }
      if (data.hasOwnProperty("mode")) {
        state.mode = data.mode;
      }
    },
    updateUnits(state, data) {
      state.units = data;
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
        const rawFields = await listsFieldGet({
          groupId: state.groupId,
          listId: state.listId
        });
        const filteredFields = Object.keys(rawFields).reduce((a, v) => {
          switch (rawFields[v].NAME) {
            case "Дата поступления задания":
              a.createdId = rawFields[v].FIELD_ID;
              break;
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
              // сохраняем список состояний, за исключением "Завершена"
              const data = Object.keys(rawFields[v].DISPLAY_VALUES_FORM).filter(
                item => rawFields[v].DISPLAY_VALUES_FORM[item] !== "Завершена"
              );
              commit("updateStatuses", data);
              break;
            }
            case "Подразделение": {
              a.unitId = rawFields[v].FIELD_ID;
              const data = Object.keys(rawFields[v].DISPLAY_VALUES_FORM).map(
                item => {
                  return {
                    text: rawFields[v].DISPLAY_VALUES_FORM[item],
                    value: String(item)
                  };
                }
              );
              commit("updateUnits", data);
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
        const elements = await listsElementGet({
          dateProp:
            state.mode === "today"
              ? { name: state.fields.createdId, value: state.today }
              : null,
          groupId: state.groupId,
          listId: state.listId,
          executorProp: {
            name: state.fields.executorId,
            value: state.executor
          },
          statusProp: {
            name: state.fields.taskStatusId,
            value: state.statuses
          },
          unitProp: { name: state.fields.unitId, value: state.unit }
        });
        const data = elements.map(e => {
          const d = e[state.fields.createdId];
          const to = e[state.fields.taskObjectId];
          return {
            id: e.ID,
            creationDate: d[Object.keys(d)[0]],
            taskObject: to[Object.keys(to)[0]],
            taskDescription: e.PREVIEW_TEXT,
            executorId: e[state.fields.executorId],
            taskComment: e.DETAIL_TEXT
          };
        });
        if (Array.isArray(data) && !data.length) {
          dispatch("showNotification", {
            text: "Для исполнителя отсутствуют незавершенные заявки!",
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
