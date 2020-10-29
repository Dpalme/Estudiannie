let questions = [];

let title_tag, text_tag, db_select;

function start() {
	db_select = document.getElementById("db_select")

	title_tag = object({
		type: "h3",
		classList: "margin-v-s"
	})
	text_tag = object({
		type: "p",
		classList: "margin-v-s"
	})

	addToContent(title_tag);
	addToContent(text_tag);

	var db = DBOpenRequest.result;
	// Open a transaction to the database
	var tx = db.transaction("questions", 'readonly');
	let question_db = tx.objectStore("questions");

	questions = [];

	question_db.openCursor().onsuccess = function (event) {
		let cursor = event.target.result;
		// if there is still another cursor to go, keep runing this code
		if (cursor) {
			if (cursor.value.table = "default"){
				// Add all questions that match the table in db to main list of questions.
				questions.push(cursor.value);
			}

			// continue on to the next item in the cursor
			cursor.continue();
		}
	}
	refreshGroupList();
	update_question_list();
}

function set_question(questionObj) {
	title_tag.innerText = questionObj.question;
	text_tag.innerText = questionObj.answer;
}

function clear() {
	title_tag.innerText = "";
	text_tag.innerText = "";
}

function new_question() {
	if (questions.length > 0){
		set_question(questions[Math.floor(Math.random() * questions.length)]);
		clearEdit();
	} else {
		if (confirm("No questions, add new ones") && document.getElementById("editMenu") === null){
			edit_questions();
		}

	}
}

function update_question_list(){
	clear();
	var db = DBOpenRequest.result;
	var groupName = document.getElementById('db_select').value;

	// Open a transaction to the database
	var tx = db.transaction("questions", 'readonly');
	let question_db = tx.objectStore("questions");

	questions = [];

    question_db.openCursor().onsuccess = function (event) {
        let cursor = event.target.result;
        // if there is still another cursor to go, keep runing this code
        if (cursor) {
			if (cursor.value.table == groupName){
				console.log(cursor.value.table);
				console.log(groupName);
				// Add all questions that match the table in db to main list of questions.
				questions.push(cursor.value);
			}

            // continue on to the next item in the cursor
            cursor.continue();
        }
    }
}