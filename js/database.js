// IndexedDB
var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.OIndexedDB || window.msIndexedDB;
var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.OIDBTransaction || window.msIDBTransaction;
var dbVersion = 1;

// Create/open database
let DBOpenRequest = indexedDB.open("cuestList", dbVersion),

    createDefault = function (dataBase) {
        // Create an objectStore
        console.log("Creating objectStore default");
        let questions = dataBase.createObjectStore("questions", {
            keyPath: 'id',
            autoIncrement: true
        });
        questions.createIndex("question", "question", {
            unique: false
        });
        questions.createIndex("answer", "answer", {
            unique: false
        });
        questions.createIndex("group", "group", {
            unique: false
        });

        let list_ref = dataBase.createObjectStore("list_ref", {
            keyPath: 'name',
            autoIncrement: false,
            unique: true
        });

        list_ref.add({name: "default", unique: true});
        questions.add({question: "How do I add new questions?", answer: "Click the Edit Questions button", group: "default"});
    }


DBOpenRequest.onerror = function (e) {
    console.log("Error creating/accessing IndexedDB database");
};

DBOpenRequest.onsuccess = function (e) {
    console.log("Success creating/accessing IndexedDB database");
    db = DBOpenRequest.result;

    db.onerror = function (e) {
        console.log("Error creating/accessing IndexedDB database");
    };

    if (DBOpenRequest.result.objectStoreNames.length == 0) {
        createDefault(e.target.result, "default");
    }

    db.onversionchange = function (e) {
        location.reload();
    }
}

DBOpenRequest.onupgradeneeded = function (e) {
    createDefault(e.target.result, "default");
}

getObjectStore = function (name) {
    console.log("Getting objectStore " + name);
    var db = DBOpenRequest.result;

    var tx = db.transaction(name, 'readonly');
    let store = tx.objectStore(name);

    values = [];

    store.openCursor().onsuccess = function (event) {
        let cursor = event.target.result;
        // if there is still another cursor to go, keep runing this code
        if (cursor) {  
            // Add all questions in db to main list of questions.
            values.push(cursor.value);

            // continue on to the next item in the cursor
            cursor.continue();
        }
    }
}