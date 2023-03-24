// Get references to DOM elements
export const dom = {
	tasksList: document.querySelector("#tasks_list"),
	taskTemplate: document.querySelector("#task_template"),
	doneCount: document.querySelector("#done_count"),
	totalCount: document.querySelector("#total_count")
};

// Initialize data. Do we have anything stored?
if (localStorage.tasks) {
	let tasks = JSON.parse(localStorage.tasks);
	for (let task of tasks) {
		addItem(task);
	}
}
else {
	// Add one empty task to start with
	addItem();
}

// Keyboard shortcuts
dom.tasksList.addEventListener("keyup", e => {
	if (!e.target.matches("input.title")) {
		// We are only interested in key events on the text field
		return;
	}

	let li = e.target.closest("li");

	if (e.key === "Enter") {
		addItem();
	}
	else if (e.key === "Backspace" && e.target.previousValue === "") {
		li.querySelector(".delete").click();
	}
});


dom.tasksList.addEventListener("keydown", e => {
	if (!e.target.matches("input.title")) {
		// We are only interested in key events on the text field
		return;
	}

	let li = e.target.closest("li");

	if (e.key === "Backspace") {
		// Store previous value so we know whether to delete on keyup
		// (which is fired after the value has changed)
		e.target.previousValue = e.target.value;
	} else if (e.key === "ArrowDown") {
		focusTask(li.nextElementSibling ?? dom.tasksList.firstElementChild);
	} else if (e.key === "ArrowUp") {
		focusTask(li.previousElementSibling ?? dom.tasksList.lastElementChild);
	}
});

// Store data when page is closed
globalThis.addEventListener("beforeunload", () => {
	localStorage.tasks = JSON.stringify(getData());
});

/**
 * Add a new item at the end of the todo list
 * @param {Object} data data for the item to be added
 */
export function addItem (data = { done: false, title: "" }) {
	dom.tasksList.insertAdjacentHTML("beforeend", dom.taskTemplate.innerHTML);

	let element = dom.tasksList.lastElementChild;

	element.querySelector(".delete").addEventListener(
		"click",
		(event) => {
			if (element.previousElementSibling) {
				focusTask(element.previousElementSibling);
			} else {
				focusTask(element.nextElementSibling)
			}
			element.remove();
			updateCounts();
			
		}
	);

	element.querySelector(".title").value = data.title;

	let done = element.querySelector(".done");
	done.checked = data.done;

	updateCounts();
	focusTask(element);
}

/**
 * Delete all tasks that are marked as done
 */
export function clearCompleted () {
	// TODO implement this (see step 4)

	const doneDeleteButtons = document.querySelectorAll("li:has(.done:checked) .delete");
	for (const button of doneDeleteButtons) {
		button.click();
	}
}

/**
* Focus the title field of the specified task
* @param {Node} element Reference to DOM element of the task to focus (or any of its descendants)
*/
export function focusTask (element) {
	element?.closest("li")?.querySelector("input.title").focus();
}

export function getData () {
	return Array.from(dom.tasksList.children).map(element => ({
		title: element.querySelector(".title").value,
		done: element.querySelector(".done").checked
	}));
}

function updateDoneCount () {
	dom.doneCount.textContent = dom.tasksList.querySelectorAll(".done:checked").length;
}

function updateTotalCount () {
	dom.totalCount.textContent = dom.tasksList.children.length;
}

// Update expressions etc when data changes
function updateCounts () {
	updateDoneCount();
	updateTotalCount();
}

const doneButtons = document.querySelectorAll(".done");
console.log(doneButtons);
for (const button of doneButtons) {
	button.addEventListener(
		"click",
		(event) => (updateCounts())
	);
}

const clearCompletedButton = document.querySelector(".clearCompleted");
clearCompletedButton.addEventListener(
	"click",
	() => {clearCompleted();}
)
