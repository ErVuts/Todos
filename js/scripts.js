(function (){
	'use strict'

	// Блок переменных

	let todoInput     = document.getElementById('todoInput'),
		addBTN        = document.getElementById('addBTN'),
		form          = document.querySelector('form');

	// Вывод существующих задач из локального хранилища


	let existTodos = getStorage();

	existTodos.forEach(function(todo){
		createTask('todos', todo);
	})


	// Добавление событий

	todoInput.addEventListener('input', function(event){

			
			if (todoInput.value.length > 3) {       					// Определяем длину строки которую ввели в Input
				addBTN.removeAttribute('disabled');  					// Разблокируем кнопку путем удаления атрибута

			} else {
				addBTN.setAttribute('disabled', true); 					// Блокируем кнопку путем добавления атрибута
			}

		});

	form.addEventListener('submit', function(event){  
		event.preventDefault();											// Запрещаем отправку формы

		createTask('todos', todoInput.value);      						// Вызывов функции создания введенной задачи в списке todos

		createTaskAtStorage(todoInput.value)								// Вызов функции сохранения задачи в Local storage

		todoInput.value = '';											// Очистка поля ввода
		addBTN.setAttribute('disabled', true)      						// Блокирование кнопки путем добавления кнопки disabled

	});



	// Блок функций

	function createTask(targetList, text) {
		let newLi = document.createElement('li');  						// Создание элемента списка
		let html  = `							
							<label>
								<input type="checkbox">
								<span class="tds__txt">${text}</span>
							</label>
							<input type="text" value="${text}" hidden>
							<button class="editBTN">Edit</button>
							<button class="deleteBTN">Delete</button>
							<button class="saveBTN" hidden>Save</button>
							<button class="cancelBTN" hidden>Cancel</button>
						   `;     										// Готовим html для элемента списка todos

		if (targetList == 'completed') {
			html = `<span class="cmpltd__txt">${text}</span> <button class="deleteBTN">Delete</button>`; // Готовим html для элемента списка completed
		}

		newLi.innerHTML = html;  										// Записываем html в элемент списка

		document.getElementById(targetList).appendChild(newLi); 		// Выводим элемент списка в указанный список (todos or completed)
																		// completed при перемещении элемента, todos при создании элемента


		addEvents(newLi);												// Вызываем функцию добавления событий

		}

	function addEvents (li){ 											

		let checkbox 	= li.querySelector('input[type="checkbox"]'),	// Находим checkbox
			label    	= li.querySelector('label'),					// Находим label 
			deleteBTN 	= li.querySelector('.deleteBTN'),				// Находим кнопку удаления задачи
			editBTN 	= li.querySelector('.editBTN'), 				// Находим кнопку редактирования задачи
			editInput   = li.querySelector('input[type="text"]'),       // Находим поле редактирования текста задачи
			saveBTN     = li.querySelector('.saveBTN'),					
			cancelBTN   = li.querySelector('.cancelBTN');

		if (checkbox) {
			checkbox.addEventListener('change', function(){				// Добавляем обработчик события change для checkbox, если он есть
				createTask('completed', label.innerText);				// Вызов функции создания задачи в списке completed
				deleteElem(li);											// Вызов функции удаления элемента, передаем туда элемент списка
			})
		}	

		if (deleteBTN) {
			deleteBTN.addEventListener('click', function(){    			// Добавляем обработчик события нажатия на кнопку удаления, если она есть
				deleteElem(li);											// Вызов функции удаление элемента, передаем туда элемент списка
				if(label){
				deleteTaskFromStorage(label.innerText);
				}
			});
		}
		if (editBTN) {
			editBTN.addEventListener('click', function() {
				toggleVisibility([label, deleteBTN, editBTN], true)
				toggleVisibility([editInput, saveBTN, cancelBTN], false)

			})
		}
		if (cancelBTN) {
			cancelBTN.addEventListener('click', function() {
				toggleVisibility([label, deleteBTN, editBTN], false)
				toggleVisibility([editInput, saveBTN, cancelBTN], true)

			})
		}
		if (saveBTN) {
			saveBTN.addEventListener('click', function() {
				toggleVisibility([label, deleteBTN, editBTN], false)
				toggleVisibility([editInput, saveBTN, cancelBTN], true)

				let span = label.querySelector('span');
				if(editInput.value.length > 0){
					updateTaskAtStorage(span.innerText, editInput.value);
				}else {
					deleteTaskFromStorage(span.innerText);
					deleteElem(li);
				}

				span.innerText = editInput.value;

		})
	}
		if (editInput) {
			editInput.addEventListener('keypress', function(event){
				console.log(event)
				if(event.keyCode == 13){ // код клавиши Enter
					saveBTN.click()
				}
			})	
		}
	}

	function toggleVisibility(elems, status) {
		elems.forEach(function(elem){
			elem.hidden = status;
		});
	}

	function deleteElem(elem) {
		elem.remove(); 													// Удаляем элемент, который передали в параметре elem
	}

	function createTaskAtStorage(todo) {
		let todos = getStorage();
		todos.push(todo);
		setStorage(todos);
	}

	function deleteTaskFromStorage(todo){
		let todos = getStorage(),
			index = todos.indexOf(todo.trim());

		if (index > -1) {
			todos.splice(index, 1)
		}

		setStorage(todos);
	}

	function updateTaskAtStorage(oldTodo, newTodo){
		let todos = getStorage();

		todos.forEach(function(todo, index){
			if (todo == oldTodo.trim()) {
				todos[index] = newTodo.trim();
			}
		});

		setStorage(todos);
	}

	function getStorage() {
		let todos = localStorage.getItem('todos');  					// Забираем из локального хранилища строку с задачами
		todos = todos ? todos.split('**') : [];
		return todos;
	}

	function setStorage(todos) {
		todos = todos.join('**');
		localStorage.setItem('todos', todos);
	}

			

})()