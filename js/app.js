const formInput = document.querySelector(`.form--input`)
const formBtn = document.querySelector(`.btn--add`)
const appBody = document.querySelector(`.app__body`)
const appDate = document.querySelector(`.app__header--day`)

let todos = []
let editBtns = []
let doneBtns = []
let deleteBtns = []

const days = [`Sunday`, `Monday`, `Tuesday`, `Wednesday`, `Thursday`, `Friday`, `Saturday`]

appDate.textContent = `~ ${days[new Date().getDay()]}`

const resetForm = () => {
	formInput.value = ``
	formBtn.textContent = `Add`
	formBtn.removeAttribute(`data-id`)
}

const handleEditTodo = (id, value) => {
	todos = todos.map(todo => {
		if (todo.id == id) {
			todo.title = value
			todo.edited = true
		}
		return todo
	})
}

const handleAddTodo = value => {
	const newTodo = {
		id: todos.length + 1,
		title: value,
		time: `${new Date().getHours()}:${new Date().getMinutes()}`,
		edited: false,
		done: false,
	}
	todos.push(newTodo)
}

const handleAdd = async e => {
	e.preventDefault()
	const { value } = formInput
	const id = formBtn.getAttribute(`data-id`)

	if (value.trim() != ``) {
		id ? handleEditTodo(id, value) : handleAddTodo(value)

		resetForm()
		await init()
	}
}

const renderUI = async todos => {
	let output = ``
	todos.forEach(todo => {
		output += `
    <div class="todo flex ${todo.done ? `todo--done` : ``} ${todo.edited ? `todo--edited` : ``}">
      <h4 class="todo__title">${todo.title}</h4>
      <p class="todo__time">${todo.time}</p>
      <div class="todo--side flex">
				${todo.done === false ? `<button class="btn btn--edit" data-id=${todo.id}>Edit</button>` : ``}
				${todo.done === false ? `<button class="btn btn--done" data-id=${todo.id}>Done</button>` : ``}
				<button class="btn btn--delete" data-id=${todo.id}>Delete</button>
			</div>
    </div>
    `
	})
	appBody.innerHTML = output
}

const assignBtns = () => {
	editBtns = [...document.querySelectorAll(`.btn--edit`)]
	doneBtns = [...document.querySelectorAll(`.btn--done`)]
	deleteBtns = [...document.querySelectorAll(`.btn--delete`)]
}

const editBtnClick = () => {
	const handleEdit = async e => {
		e.preventDefault()
		const { id } = e.target.dataset
		const currentTodo = todos.find(todo => todo.id == id)
		formInput.value = currentTodo.title
		formBtn.textContent = `Edit`
		formBtn.setAttribute(`data-id`, currentTodo.id)

		await init()
	}
	editBtns.forEach(btn => btn.addEventListener(`click`, handleEdit))
}

const doneBtnClick = () => {
	const handleDone = async e => {
		e.preventDefault()
		const { id } = e.target.dataset
		todos = todos.map(todo => {
			if (todo.id == id) {
				todo.done = true
			}
			return todo
		})

		resetForm()
		await init()
	}
	doneBtns.forEach(btn => btn.addEventListener(`click`, handleDone))
}

const deleteBtnClick = () => {
	const handleDelete = async e => {
		e.preventDefault()
		const { id } = e.target.dataset
		todos = todos.filter(todo => todo.id != id)

		resetForm()
		await init()
	}
	deleteBtns.forEach(btn => btn.addEventListener(`click`, handleDelete))
}

const init = async () => {
	await renderUI(todos)
		.then(() => assignBtns())
		.then(() => {
			localStorage.setItem(`todos`, JSON.stringify(todos))
		})
		.then(() => {
			doneBtnClick()
			editBtnClick()
			deleteBtnClick()
		})
}

formBtn.addEventListener(`click`, handleAdd)

formInput.addEventListener(`keydown`, e => {
	if (e.code.toLowerCase() === `enter`) {
		handleAdd(e)
	}
})

document.addEventListener(`DOMContentLoaded`, () => {
	todos = JSON.parse(localStorage.getItem(`todos`) || `[]`)
	init()
})
