/* global BX24 */

export const init = () => {
  return new Promise(resolve => {
    BX24.init(() => resolve());
  });
};

/**
 * @param { string } groupId
 * @param { string } listId
 * @returns { Array }
 * Метод возвращает данные поля. В случае успеха будет возвращен список полей с данными, иначе пустой массив.
 * https://dev.1c-bitrix.ru/rest_help/lists/fields/lists_field_get.php
 */
export const listsFieldGet = ({ groupId, listId }) => {
  return new Promise((resolve, reject) => {
    BX24.callMethod(
      "lists.field.get",
      {
        IBLOCK_TYPE_ID: "lists_socnet",
        IBLOCK_ID: listId,
        SOCNET_GROUP_ID: groupId
      },
      result => {
        if (result.error()) reject(result.error());
        else resolve(result.data());
      }
    );
  });
};

/**
 * @param { string } groupId
 * @param { string } listId
 * @param { Object } executorProp
 * @param { Object } statusProp
 * @param { Object } unitProp
 * @returns { Array }
 * Метод возвращает список элементов или элемент. В случае успеха возвращает данные по элементу(там), иначе пустой массив.
 * https://dev.1c-bitrix.ru/rest_help/lists/elements/lists_element_get.php
 */
export const listsElementGet = ({
  dateProp,
  groupId,
  listId,
  executorProp,
  statusProp,
  unitProp
}) => {
  const filter = {
    ["=" + unitProp.name]: unitProp.value,
    ["=" + executorProp.name]: executorProp.value,
    ["=" + statusProp.name]: statusProp.value
  };
  if (dateProp !== null) {
    filter[">=" + dateProp.name] = dateProp.value.start;
    filter["<=" + dateProp.name] = dateProp.value.end;
  }
  return new Promise((resolve, reject) => {
    BX24.callMethod(
      "lists.element.get",
      {
        IBLOCK_TYPE_ID: "lists_socnet",
        IBLOCK_ID: listId,
        SOCNET_GROUP_ID: groupId,
        FILTER: filter
      },
      result => {
        if (result.error()) reject(result.error());
        else resolve(result.data());
      }
    );
  });
};
