
//#region HTML imports
let saveButton = document.getElementById("saveButton")
let tableBody = document.getElementById("table-body")
let clearButton = document.getElementById("clearButton")
//#endregion

//#region variables
// let database = [
//     {
//         "id": 1,
//         "producto": "chocorramo",
//         "fecha": "2021-09-16",
//         "precio": 2000,
//         "descripcion": "un chocoramo"
//     },
//     {
//         "id": 2,
//         "producto": "Atún",
//         "fecha": "2021-09-16",
//         "precio": 10000,
//         "descripcion": "Compra de atún"
//     }, {
//         "id": 3,
//         "producto": "galletas",
//         "fecha": "2021-09-16",
//         "precio": 2000,
//         "descripcion": "unas galletas"
//     },
//     {
//         "id": 4,
//         "producto": "Jugo",
//         "fecha": "2021-09-16",
//         "precio": 10000,
//         "descripcion": "Compra de un jugo en botella"
//     }, {
//         "id": 5,
//         "producto": "Naranjas",
//         "fecha": "2021-09-16",
//         "precio": 2000,
//         "descripcion": "una bolsa de naranjas"
//     },
//     {
//         "id": 6,
//         "producto": "Gaseosa",
//         "fecha": "2021-09-16",
//         "precio": 10000,
//         "descripcion": "No hay que abusar"
//     },
// ]
let data = []
let server = `http://localhost:8080`
let endpoint = `/gastos`
//#endregion

//#region events
window.addEventListener("load", loadData)
saveButton.addEventListener("click", saveExpense)
clearButton.addEventListener("click", clearForm)
//#endregion

//#region functions
function loadData() {
    sendReadRequest()
}

function readForm() {
    let productInput = document.getElementById("productInput")
    let dateInput = document.getElementById("dateInput")
    let priceInput = document.getElementById("priceInput")
    let descriptionInput = document.getElementById("descriptionInput")
    let expense = {
        id: idInput.value !== "" ? parseInt(idInput.value) : null,
        producto: productInput.value,
        fecha: dateInput.value,
        precio: parseInt(priceInput.value),
        descripcion: descriptionInput.value,
    }
    return expense
}

function clearData() {
    data = []
}

function printTable(data) {
    tableBody.replaceChildren("")
    data.forEach(expense => {
        let tr = document.createElement("TR")
        tr.setAttribute("id", `expense${expense.id}`)
        for (item in expense) {
            let td = document.createElement("TD")
            item === "id" ? td.setAttribute("style", "display: none;") : ""
            td.innerHTML += expense[item]
            td.setAttribute("id", `${item}${expense.id}`)
            tr.appendChild(td)
        }
        let accion = document.createElement("TD")
        let editar = document.createElement("button")
        let borrar = document.createElement("button")
        editar.innerHTML = "Editar"
        borrar.innerHTML = "Borrar"
        editar.classList.add("btn", "btn-warning", "btn-sm", "m-1")
        borrar.classList.add("btn", "btn-danger", "btn-sm", "m-1")
        editar.addEventListener("click", e => editExpense(e))
        borrar.addEventListener("click", e => deleteExpense(e))
        accion.appendChild(editar)
        accion.appendChild(borrar)
        tr.appendChild(accion)
        tableBody.appendChild(tr)
    });
    clearData()
}

function fillForm() {
    document.getElementById("idInput").value = data[0].id
    document.getElementById("productInput").value = data[0].producto
    document.getElementById("dateInput").value = data[0].fecha
    document.getElementById("priceInput").value = data[0].precio
    document.getElementById("descriptionInput").value = data[0].descripcion
}

function clearForm() {
    document.getElementById("idInput").value = ""
    document.getElementById("productInput").value = ""
    document.getElementById("dateInput").value = ""
    document.getElementById("priceInput").value = ""
    document.getElementById("descriptionInput").value = ""
}

function readTableRow(e) {
    let expenseId = e.target.parentElement.parentElement.id
    let expenseNodes = document.getElementById(expenseId).childNodes
    let expenseItems = Array.from(expenseNodes)
    let expense = {
        id: parseInt(expenseItems[0].innerHTML),
        producto: expenseItems[1].innerHTML,
        fecha: expenseItems[2].innerHTML,
        precio: parseInt(expenseItems[3].innerHTML),
        descripcion: expenseItems[4].innerHTML
    }
    data.push(expense)
}

function editExpense(e) {
    clearForm()
    clearData()
    readTableRow(e)
    fillForm()
}

function deleteExpense(e) {
    readTableRow(e)
    sendDeleteRequest(data[0]).then(() => {
        loadData()
    })
}

function saveExpense() {
    let expense = readForm()
    if (expense.id == null) {
        sendCreateRequest(expense)
    }
    else {
        sendUpdateRequest(expense).then(() => {
            clearForm()
            loadData()
        })
    }
}


// Server Requests
function sendCreateRequest(expense) {
    $.ajax({
        headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json' 
        },
        url: server + endpoint,
        data: JSON.stringify(expense),
        method: 'POST',
        dataType: 'json',
        success: function (response) {
            console.log(response)
            clearForm()
            loadData()
        },
        error: function (error) {
            console.log(error)
            console.log(expense)
        }
    });
}

function sendReadRequest(expense) {
    $.ajax({
        url: server + endpoint,
        data: expense,
        method: 'get',
        dataType: 'json',
        success: function (response) {
            console.log(response)
            printTable(response)
            clearData()
        },
        error: function (error) {
            console.log(error)
            console.log(expense)
        }
    });
}

function sendUpdateRequest(expense) {
    $.ajax({
        url: server + endpoint,
        data: expense,
        method: 'post',
        dataType: 'json',
        success: function (response) {
            console.log(response)
        },
        error: function (error) {
            console.log(error)
            console.log(expense)
        }
    });
}

function sendDeleteRequest(expense) {
    let id = `/${expense.id}`
    $.ajax({
        url: server + endpoint + id,
        data: expense,
        method: 'post',
        dataType: 'json',
        success: function (response) {
            console.log(response)
        },
        error: function (error) {
            console.log(error)
            console.log(expense)
        }
    });
}

// Local requests functions
//
// function sendCreateRequest(expense){
//     database.push(expense)
//     console.log(expense)
//     loadData()
// }
// function sendReadRequest() {
//     return database
// }
// 
// function sendUpdateRequest(expense){
//     database.map((e,i)=>{
//         if(e.id === expense.id) {
//             database.splice(i,1,expense)
//         }
//     })
//     loadData()
// }
// function sendDeleteRequest(expense){
//     database.map((e,i)=>{
//         if(e.id === expense.id) {
//             database.splice(i,1)
//         }
//     })
//     loadData()
// }

//#endregion functions