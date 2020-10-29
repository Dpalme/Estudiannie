function edit_questions() {
	clear()

	objectToContent({
		type: "div",
		classList: "card white",
		id: "editMenu",
		children: [
			object({
				type: "div",
				classList: "padding-v-s block col-9",
				children: [
					object({
						type: "label",
						classList: "w-3 black",
						innerText: "Question",
						child: object({
							type: "input",
							classList: "w-3",
							id: "question_inp"
						})
					}), object({
						type: "label",
						classList: "w-3 black",
						innerText: "Answer",
						child: object({
							type: "input",
							classList: "w-3",
							id: "answer_inp"
						})
					}), object({
						type: "button",
						classList: "padding-v-s w-3 col-1-o margin-v-s",
						onclick: "putQuestInDb()",
						innerText: "CREAR PREGUNTA"
					})
				]
			}), object({
				type: "button",
				onclick: "createNewGroup()",
				classList: "padding-v-s w-3 margin-v-s",
				innerText: "CREATE GROUP",
			}), object({
				type: "button",
				classList: "padding-v-s w-3 col-1-o margin-v-s",
				onclick: "deleteGroup()",
				innerText: "DELETE GROUP",
			}), object({
				type: "button",
				classList: "padding-v-s w-3 col-1-o margin-v-s",
				onclick: "clearGroup()",
				innerText: "CLEAR QUESTIONS",
			}), object({
				type: "button",
				classList: "padding-v-s w-3 col-1-o margin-v-s",
				onclick: "clearEdit()",
				innerText: "CLOSE",
			})
		]
	})
}

function refreshGroupList() {
	var db = DBOpenRequest.result;

	var tx = db.transaction(["list_ref", "questions"], 'readonly');
	let list_ref = tx.objectStore("list_ref");

	var request = list_ref.getAll();

	request.onsuccess = function (e) {
		var names = e.target.result;

		var db_select = document.getElementById("db_select")
		while (db_select.firstChild) {
			db_select.removeChild(db_select.firstChild);
		}

		for (i = 0; i < names.length; i++) {
			option = object({
				type: "option",
				innerText: names[i]["name"]
			})
			option.setAttribute("value", names[i]["name"]);
			db_select.appendChild(option)
		}
	}
}

function createNewGroup() {
	var groupName = prompt('Name for new question group');
	if (groupName != "") {
		var db = DBOpenRequest.result;

		// Open a transaction to the database
		var tx = db.transaction("list_ref", 'readwrite');
		var store = tx.objectStore("list_ref");

		store.add({
			name: groupName
		});
		confirm("Added question group " + groupName);
		refreshGroupList();
		update_question_list();
		return tx.complete;
	} else {
		confirm("No group was created");
	}
}

function deleteGroup() {
	var db = DBOpenRequest.result;
	var groupName = document.getElementById('db_select').value;

	if (confirm('Delete question group ' + groupName + '?')){
		if (groupName != "default") {
			// Open a transaction to the database
			var tx = db.transaction(["list_ref", "questions"], 'readwrite');
			let list_ref = tx.objectStore("list_ref");
	
			list_ref.delete(groupName);
	
			clearGroup();
			update_question_list();
			confirm("Deleted question group " + groupName);
		} else {
			confirm("Can't delete the default group")
		}
	}
}

function putQuestInDb() {
	var new_question = document.getElementById("question_inp").value;
	var new_answer = document.getElementById("answer_inp").value;

	document.getElementById("question_inp").value = "";
	document.getElementById("answer_inp").value = "";

	if (new_question != "" && new_answer != "") {
		var db = DBOpenRequest.result;

		// Open a transaction to the database
		var tx = db.transaction("questions", 'readwrite');
		var store = tx.objectStore("questions");
		store.add({
			question: new_question,
			answer: new_answer,
			table: document.getElementById("db_select").value
		});
		console.log("Added question");
		update_question_list();
		return tx.complete;
	}
}

function clearGroup() {
	var db = DBOpenRequest.result;
	var groupName = document.getElementById('db_select').value;

	// Open a transaction to the database
	var tx = db.transaction(["list_ref", "questions"], 'readwrite');
	let question_db = tx.objectStore("questions");

	var request = question_db.getAll();

	request.onsuccess = function (e) {
		var questions = e.target.result;
		for (i = 0; i < questions.length; i++) {
			if (questions[i]["table"] == groupName) {
				question_db.delete(questions[i]["id"])
			}
		}
		console.log("Cleared question group " + groupName);
		refreshGroupList()
		update_question_list()
		return tx.complete;
	}
}

function clearEdit() {
	content.removeChild(document.getElementById("editMenu"));
}