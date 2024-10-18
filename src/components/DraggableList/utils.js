export const applyDrag = (arr, dragResult) => {
    const { removedIndex, addedIndex, payload } = dragResult;
    if (removedIndex === null && addedIndex === null) return arr;
  
    const result = [...arr];
    let itemToAdd = payload;
  
    if (removedIndex !== null) {
      itemToAdd = result.splice(removedIndex, 1)[0];
    }
  
    if (addedIndex !== null) {
      result.splice(addedIndex, 0, itemToAdd);
    }
  
    // Создаем новый массив с обновленными порядковыми номерами
    return result.map((item, index) => ({
      ...item,  // Копируем свойства оригинального объекта
      order: index  // Устанавливаем новое значение order
    }));
  };
  