/* global BX24 */

export const init = () => {
  return new Promise(resolve => {
    BX24.init(() => resolve());
  });
};

export const listsFieldGet = ({ listId }) => {
  return new Promise((resolve, reject) => {
    BX24.callMethod(
      "lists.field.get",
      {
        IBLOCK_TYPE_ID: "bitrix_processes",
        IBLOCK_ID: listId
      },
      result => {
        if (result.error()) reject(result.error());
        else resolve(result.data());
      }
    );
  });
};

export const listsElementGet = ({ start, end, listId, executorProp, statusProp }) => {
  return new Promise((resolve, reject) => {
    BX24.callMethod(
      "lists.element.get",
      {
        IBLOCK_TYPE_ID: "bitrix_processes",
        IBLOCK_ID: listId,
        FILTER: {
          ">=DATE_CREATE": start,
          "<=DATE_CREATE": end,
          [executorProp.name]: executorProp.value,
          ["!" + statusProp.name]: statusProp.value
        }
      },
      result => {
        if (result.error()) reject(result.error());
        else resolve(result.data());
      }
    );
  });
};
