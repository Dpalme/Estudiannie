function edit_questions() {
	if (document.getElementById("editMenu") === null) {
		clear()

		objectToContent({
			type: "div",
			classList: "card shadow",
			id: "editMenu",
			children: [
				object({
					type: "div",
					classList: "card-body",
					children: [
						object({
							type: "label",
							innerText: "Question:",
							for: "question_inp",
							classList: "col",
							child: object({
								type: "textarea",
								classList: "form-control",
								id: "question_inp"
							})
						}), object({
							type: "label",
							innerText: "Answer:",
							for: "answer_inp",
							classList: "col",
							child: object({
								type: "textarea",
								classList: "form-control",
								id: "answer_inp"
							})
						}), object({
							type: "button",
							classList: "btn btn-primary ml-3",
							onclick: "putQuestInDb()",
							innerText: "Add Question"
						}), object({
							type: "div",
							classList: "alert alert-success ml-3 mt-4 d-none",
							id: "added-suc",
							innerText: "Added Question."
						}), object({
							type: "div",
							classList: "alert alert-danger ml-3 mt-4 d-none",
							id: "added-dan",
							innerText: "Both Question and Answer need to have text."
						})
					]
				}), object({
					type: "div",
					classList: "card-body",
					children: [object({
						type: "button",
						onclick: "createNewGroup()",
						classList: "btn btn-outline-success mr-1 ml-3",
						innerText: "Create Group",
					}), object({
						type: "button",
						classList: "btn btn-outline-danger mr-1",
						onclick: "deleteGroup()",
						innerText: "Delete Group",
					}), object({
						type: "button",
						classList: "btn btn-outline-danger",
						onclick: "clearGroup()",
						innerText: "Clear Question Group",
					})]
				})
			]
		})
	}
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
			db_select.appendChild(object({
				type: "option",
				innerText: names[i]["name"],
				value: names[i]["name"]
			}))
		}
	}
}

function createNewGroup() {
	var groupName = prompt('Name for new question group');
	if (groupName && groupName != "") {
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
	}
}

function deleteGroup() {
	var db = DBOpenRequest.result;
	var groupName = document.getElementById('db_select').value;

	if (confirm('Delete question group ' + groupName + '?')) {
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
	document.getElementById("added-suc").classList.add("d-none")
	document.getElementById("added-dan").classList.add("d-none")

	if (new_question != "" && new_answer != "") {
		addQuestion(new_question, new_answer);
		document.getElementById("added-suc").classList.remove("d-none")
	} else {
		document.getElementById("added-dan").classList.remove("d-none")
	}
}

function addQuestion(new_question, new_answer){
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
	document.getElementById("question_inp").value = "";
	document.getElementById("answer_inp").value = "";
	update_question_list();
	return tx.complete;
}

function clearGroup() {
	var db = DBOpenRequest.result;
	var groupName = document.getElementById('db_select').value;

	if (confirm('Clear question group ' + groupName + '?')) {
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
}

function clearEdit() {
	content.removeChild(document.getElementById("editMenu"));
}