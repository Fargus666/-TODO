//создаем и возвращаем заголовок приложения//
function createAppTitle(title) {
  let appTitle = document.createElement('h2');
  appTitle.innerHTML = title;
  return appTitle;
}

//создаем и возвращаем форму создания дела//
function createTodoItemForm() {
  //создаем элементы html в разделе с формой и ввод данных
  let form = document.createElement('form');
  let input = document.createElement('input');
  let buttonWrapper = document.createElement('div');
  let button = document.createElement('button');

  //добавляем стили элементам разметки и текст кнопки и ввода
  form.classList.add('input-group', 'mb-3');
  input.classList.add('form-control');
  input.placeholder = 'Введите название нового дела';
  buttonWrapper.classList.add('input-group-append');
  button.classList.add('btn', 'btn-primary');
  button.textContent = 'Добавить дело';
  button.setAttribute('disabled', 'disabled'); //делает кнопку неактивной при загрузки страницы

  //добавляем на странницу созданные элменты html разметки 
  //в div добавляем кнопку
  buttonWrapper.append(button);
   //в форму добавляем поле для ввода
  form.append(input);
  //в форму добавляем div  скнопкой
  form.append(buttonWrapper);

  return {
    form,
    input,
    button,
  };
}

//создаем и возвращаем список элементов//
function createTodoList() {
  let list = document.createElement('ul');
  list.classList.add('list-group');
  return list;
}

//создаем функцию по созданию кнопок и их стилей, список и его стили
function createTodoItem(todoElement, todoArray, keyLocalStorage) {
  let item = document.createElement('li');
  //кнопки помещаем в элемент. который красиво их покажет//
  let buttonGroup = document.createElement('div');
  let doneButton = document.createElement('button');
  let deleteButton = document.createElement('button');

  //устанавливаем стили для элемента списка. а также для кнопок
  //в его правой части с помощью flex
  item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
  item.textContent = todoElement.name;

  buttonGroup.classList.add('btn-group', 'btn-group-sm');
  doneButton.classList.add('btn', 'btn-success');
  doneButton.textContent = 'Готово';
  deleteButton.classList.add('btn', 'btn-danger');
  deleteButton.textContent = 'Удалить';

  //вкладываем кнопки в отдельный элемент. чтобы они объединились в один блок
  buttonGroup.append(doneButton);
  buttonGroup.append(deleteButton);
  item.append(buttonGroup);

  if (todoElement.done) { // если true у статуса задачи
    item.classList.add('list-group-item-success');
  }

  doneButton.addEventListener('click', function () {
    item.classList.toggle('list-group-item-success');
    todoElement.done = item.classList.contains('list-group-item-success');
    saveDataToLocalStorage(keyLocalStorage, todoArray);
  });

  deleteButton.addEventListener('click', function () {
    if (confirm('Вы уверены?')) { 
      let index = todoArray.findIndex((elem) => elem.id === todoElement.id);
      todoArray.splice(index, 1);
      item.remove();
      saveDataToLocalStorage(keyLocalStorage, todoArray)
    }
  });

    //приложению нужен доступ к самому элементу и кнопкам, чтобы обрабатывать событие нажатия
  return {
    item,
    doneButton,
    deleteButton,
  }
}

//создаем с помощью  функции приложение  и наполняем его элементами и событиями с помощь вызова других функций
function createTodoApp(container, title = 'Список дел', listName) {
  let todoArray = getDataFromLocalStorage(listName) || [];
  //вызываем функцию создания и возврата загловка приложения
  let todoAppTitle = createAppTitle(title);
  //вызываем функцию, которая получает данные от пользователя через форму
  let todoItemForm = createTodoItemForm();
  //вызываем функцию, которая на основе полученных данных, создает список дел и возвращает данные
  let todoList = createTodoList();
  createTodoApp.todoArray = todoArray;

  // добавление элементов из LocalStorage
  if (todoArray.length) {
    todoArray.forEach((item) => {
    let todoItem = createTodoItem(item, todoArray, listName);
    todoList.append(todoItem.item);
    });
  }

  container.append(todoAppTitle,todoItemForm.form,todoList);

  //генерируем id задачи
  function idForElement() {
    if (!todoArray.length) return 1;
    else return todoArray[todoArray.length - 1].id + 1;
  };

  // манипуляции с кнопкой делает ее заблокированной пока мы не начнем вводить что-то в поле
  todoItemForm.form.addEventListener("input", function () {
    if (!todoItemForm.input.value) {
      todoItemForm.button.setAttribute('disabled', 'disabled');
    } else {
      todoItemForm.button.removeAttribute('disabled');
    };
  });

  //браузер создает событие submit на форме по нажатию Enter или на кнопку создания дела
  todoItemForm.form.addEventListener('submit', function (e) {
    //эта строчка необходим,чтобы предотварить стандартное действие браузера
    //в данном случае мы не хотим. чтобы странница перезагружалась при отправки формы
    e.preventDefault();
      //игнорируем создание элемента. если пользователь ничего не ввел
      if (!todoItemForm.input.value) {
        return;
      }

      let todoElement = {
        id: idForElement(),
        name: todoItemForm.input.value,
        done: false,
      };

    todoArray.push(todoElement);
    let todoItem = createTodoItem(todoElement, todoArray, listName); // создание li
    saveDataToLocalStorage(listName, todoArray);

    todoList.append(todoItem.item); // добавление li в общий список
    todoItemForm.input.value = ''; // изменение в изначальное положение
    todoItemForm.button.setAttribute('disabled', 'disabled'); // изменение кнопки в изначальное положение
  })
}

//создаем функцию, которая вернет данные в виде строки
function dataToJson(data) {
  return JSON.stringify(data);
};

//создаем функцию, которая вернет входящую строку в виде данных
function jsonToData(data) {
  return JSON.parse(data);
};

//создаем функцию. которая вернет данные из LocalStorage
function getData(listName) {
  return localStorage.getItem(listName);
};

//создаем функцию, которая запишет данные в LocalStorage
function setData(listName, data) {
  return localStorage.setItem(listName, data);
};

//создаем функцию, которая устанавливает ключ данных для дальнейшей их передачи
function saveDataToLocalStorage(key, data) {
  const jsonData = dataToJson(data);
  setData(key, jsonData);
}

//создаем функцию, которая возвращает ключ данных
function getDataFromLocalStorage(key) {
  function getCartData() {
    let cartData = localStorage.getItem(key);
    return cartData;
  }
  let result = getCartData();
  return jsonToData(result);
}

window.createTodoApp = createTodoApp;
