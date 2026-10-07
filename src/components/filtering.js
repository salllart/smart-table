// import {createComparison, defaultRules} from "../lib/compare.js";

// // @todo: #4.3 — настроить компаратор
// const compare = createComparison(defaultRules);

export function initFiltering(elements, indexes) {
    // @todo: #4.1 — заполнить выпадающие списки опциями
    // Object.keys(indexes)
    //       .forEach((elementName) => {
    //         elements[elementName].append(
    //             ...Object.values(indexes[elementName])
    //                 .map(name => {
    //                     const option = document.createElement('option');
    //                     option.value = name;
    //                     option.textContent = name;
    //                     return option;
    //                 })
    //     )
    // })

    // заполняем селекты опциями
    const updateIndexes = (elements, indexes) => {
        Object.keys(indexes).forEach((elementName) => {
            elements[elementName].append(...Object.values(indexes[elementName]).map(name => {
                const el = document.createElement('option');
                el.textContent = name;
                el.value = name;
                return el;
            }))
        })
    }

    // return (data, state, action) => {
    //     // @todo: #4.2 — обработать очистку поля
    //     if (action && action.name === 'clear') {
    //         const input = action.parentElement
    //                             .querySelector('input');
    //         input.value = '';
    //         state[action.dataset.field] = '';
    //     }
    //     // @todo: #4.5 — отфильтровать данные используя компаратор
    //     return data.filter(row => compare(row, state));
    // }

    const applyFiltering = (query, state, action) => {
        // код с обработкой очистки поля
        if (action && action.name === 'clear') {
            const input = action.parentElement
                                .querySelector('input');
            input.value = '';
            state[action.dataset.field] = '';
        }

        // @todo: #4.5 — отфильтровать данные, используя компаратор
        const filter = {};
        Object.keys(elements).forEach(key => {
            if (elements[key]) {
                if (['INPUT', 'SELECT'].includes(elements[key].tagName) && elements[key].value) { // ищем поля ввода в фильтре с непустыми данными
                    const regexDateTest = /^\d{4}(?:\W\d{2}(?:\W\d{2})?)?$/; // проверяем что в дате указан хотя бы год
                    const regexDateExec = /^(\d{4})\W?(\d{2})?\W?(\d{2})?$/; // регулярное выражение для извлечение года, месяца и дня
                    if (elements[key].name === 'date' && regexDateTest.test(elements[key].value)) { // если поле - дата, проверяем что в дате указан хотя бы год
                        const date = regexDateExec.exec(elements[key].value);
                        // преобразовываем дату для сервера
                        filter[`filter[${elements[key].name}]`] = `${date[1]}-${date[2] || "**"}-${date[3] || "**"}`
                    } else {
                        filter[`filter[${elements[key].name}]`] = elements[key].value; // формируем в query вложенный объект фильтра
                    }
                    
                }
            }
        })

        return Object.keys(filter).length ? Object.assign({}, query, filter) : query; // если в фильтре что-то добавилось, применим к запросу
    }

    return {
        updateIndexes,
        applyFiltering
    }
}