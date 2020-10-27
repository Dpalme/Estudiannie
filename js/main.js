let questions = [];

class Pregunta {
	constructor(question, answer) {
		this.question = question;
		this.answer = answer;
	}

	get_question() {
		return this.question;
	}

	get_answer() {
		return this.answer;
	}
}

function create_quest(question, answer) {
	var quest = new Pregunta(question, answer);
	questions.push(quest);
}

Pregunta.prototype.toString = function() {
	return '<a class="block four columns blue margin-none gutter-margin-bottom" onclick="get_quest(`' + this.question + '`, `' + this.answer + '`)"></a>';
}

function start() {
	content = document.getElementById("main");
	title_tag = document.createElement("h3");
	title_tag.classList.add("margin-v-s");
	text_tag = document.createElement("p");

	content.appendChild(title_tag);
	content.appendChild(text_tag);
}

function set_question(question){
	title_tag.innerText = question.get_question();
	text_tag.innerText = question.get_answer();
}

function clear(){
	title_tag.innerText = "";
	text_tag.innerText = "";
}

function new_question() {
	var question = questions[Math.floor(Math.random() * questions.length)];
	set_question(question);
}
