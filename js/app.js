const form = document.getElementById("form-table");

class Product {
    constructor(name, count, price) {
        this.name = name;
        this.count = count;
        this.price = price;
    }
}

let product = new Array(6);// создаём начальный список товаров

for (let i = 0; i < product.length; i++) {
    product[i] = new Product('Товар' + i, i, 1200 + i)
}
CreateTable(product.length);

CreateProduct();

const add = document.getElementById('add');
add.addEventListener('click', e => {
    let UpdateAdd = document.getElementById("button-status");
    UpdateAdd.innerHTML = "Add";

    UpdateAdd.addEventListener('click', e => {
        f = validate.call(form);
        e.preventDefault()
        name1 = document.getElementById("nameInput");
        count = document.getElementById("countInput");
        price = document.getElementById("priceInput");

        if ((name1.value != "") && (f)) {
            if (price.value == "") {
                price.value = 0;
            }
            product.push(new Product(name1.value, count.value, price.value));

            name1.value = "";
            count.value = "";
            price.value = "";
            UpdateAdd.innerHTML = "Add";
            CreateTable(1);//добавляем одну строку
            CreateProduct();//создаём новый список товаров
        }
    })
});

//фильтрация
const search = document.getElementById("button-search")
search.addEventListener('click', e => {
    Filter();
});

//сортировка по цене
const priceSort = document.getElementById('price');
let x = false;
priceSort.addEventListener('click', e => {
    SortPrice();
    if (x) {
        priceSort.innerHTML = "";
        priceSort.style.background = 'url(img/Up.png) no-repeat';
        CreateProduct();
    } else {
        priceSort.innerHTML = "";
        priceSort.style.background = 'url(img/Down.png) no-repeat';
        product.reverse();
        CreateProduct();
    }
    x = !x
});

//сортировка по имени
const nameSort = document.querySelector(".sort")

let y = false;
nameSort.addEventListener('click', e => {
    SortName();
    if (y) {
        nameSort.style.background = 'url(img/Up.png) no-repeat';
        CreateProduct();
    } else {
        nameSort.style.background = 'url(img/Down.png) no-repeat';
        product.reverse();
        CreateProduct();
    }
    y = !y
});

// Удаление и редактирование товаров
const table = document.getElementsByTagName("tbody")[0];

function callbackFactory() {
    let lastCallback = null;
    return function (callback) {
        if (lastCallback) {
            const element = document.getElementById("button-status");
            element.removeEventListener('click', lastCallback, false);
        }
        const cb = function (e) {
            callback.call(this, e);
        };
        lastCallback = cb;
        return cb;
    }
}

const callbackCaller = callbackFactory();

table.addEventListener('click', event => {
    let target = event.target; // где был клик?

    if (target.innerHTML == "Delete") {
        let confirmation = confirm("Вы уверены?");
        if (confirmation) {
            // const number = target.getAttribute("number");
            product.splice(target.parentNode.parentNode.parentNode.rowIndex - 1, 1);//удаляем товар из этой строки
            table.deleteRow(target.parentNode.parentNode.parentNode.rowIndex);
        }
    } else if (target.innerHTML == "Edit") {
        const c = document.querySelector(".column>button");
        const UpdateAdd = document.getElementById("button-status");
        c.innerHTML = "Update";

        const editHandler = e => {
            e.preventDefault();
            const number = target.getAttribute("number");
            const name1 = document.getElementById("nameInput"),
                count = document.getElementById("countInput"),
                price = document.getElementById("priceInput");
            f = validate.call(form);
            if ((name1.value != "") && (f)) {

                product[number].name = String(name1.value);
                product[number].count = Number(count.value);
                if (price.value == "") {
                    product[number].price = 0;
                } else {
                    product[number].price = Number(price.value);
                }
                product.push(product[number]);
                product.splice(target.parentNode.parentNode.parentNode.rowIndex - 1, 1);
                name1.value = "";
                count.value = "";
                price.value = "";
                CreateProduct();
            }
        };

        UpdateAdd.addEventListener(
            'click',
            callbackCaller(editHandler)
        );
    }
});

function CreateProduct() {// вывод товаров в таблицу

    const tbody = document.getElementsByTagName("tbody")[0];
    const nameList = document.querySelectorAll("td>a");
    const countList = document.querySelectorAll(".count");
    const priceList = document.querySelectorAll("td:nth-child(2)");

    for (let i = 0; i < product.length; i++) {
        nameList[i].innerHTML = product[i].name;
        countList[i].innerHTML = product[i].count;
        priceList[i].innerHTML = '$' + String(product[i].price);
    }
}

function SortPrice() {// сортировка по цене
    for (let i = 0; i < product.length - 1; i++) {

        for (let j = 0; j < product.length - 1 - i; j++) {

            if (product[j].price > product[j + 1].price) {
                let buf = product[j];
                product[j] = product[j + 1];
                product[j + 1] = buf;
            }
        }
    }
    return product;
}

function SortName() {// пузырьковая сортировка по имени
    for (let i = 0; i < product.length - 1; i++) {

        for (let j = 0; j < product.length - 1 - i; j++) {

            if (product[j + 1].name < product[j].name) {
                let buf = product[j + 1];
                product[j + 1] = product[j];
                product[j] = buf;
            }
        }
    }
    return product;
}

function Filter() {
    const filter = document.getElementsByTagName('input');
    const trs = document.querySelectorAll('tr');
    for (let j = 1; j < trs.length; j++) {// при каждом нажатии делаем строки видимыми
        trs[j].style.display = "";
    }
    if (filter[0].value != "") {
// находим по подстроке название товара, если не удовлетворяет критериям - прячем строку таблицы
        for (let j = 1; j < trs.length; j++) {
            if (String(product[j - 1].name).toUpperCase().indexOf(String(filter[0].value).toUpperCase()) == -1) {
                trs[j].style.display = 'none';
            }
        }
    }
}

function CreateTable(n)//структура таблицы
{
    const tbody = document.getElementsByTagName("tbody")[0];
    for (let i = 0; i < n; i++) {
        let row = document.createElement("tr");
        let td1 = document.createElement("td");
        let td2 = document.createElement("td");
        let td3 = document.createElement("td");
        row.appendChild(td1);
        row.appendChild(td2);
        row.appendChild(td3);
        tbody.appendChild(row);

        row.setAttribute("number", i);
        let link = document.createElement("a");

        td1.appendChild(link);
        link.setAttribute("href", "#");
        let div = document.createElement("div");
        td1.appendChild(div);
        div.classList.add('count');

        let buttonDelete = document.createElement("div");
        let buttonEdit = document.createElement("div");
        buttonEdit.classList.add('button');
        buttonDelete.classList.add('button');
        td3.appendChild(buttonDelete);
        td3.appendChild(buttonEdit);

        let DeleteLink = document.createElement("button");
        buttonDelete.appendChild(DeleteLink);
        DeleteLink.setAttribute("number", i);
        DeleteLink.innerHTML = "Delete";

        let EditLink = document.createElement("button");
        buttonEdit.appendChild(EditLink);
        EditLink.setAttribute("number", i);
        EditLink.innerHTML = "Edit";
    }
}

function showError(container, errorMessage) {
    container.className = 'error';
    const msgElem = document.createElement('span');
    msgElem.className = "error-message";
    msgElem.innerHTML = errorMessage;
    container.appendChild(msgElem);
}

function resetError(container) {
    container.className = '';
    if (container.lastChild.className === "error-message") {
        container.removeChild(container.lastChild);
    }
}

function validate() {
    let err = 0;
    let elems = this.elements;

    resetError(elems.name.parentNode);
    if (!elems.name.value) {
        showError(elems.name.parentNode, ' Укажите наименование');
        elems.name.style.border = "1px solid #ff0000";
        err++;

    } else if (elems.name.value.search(/[A-zА-яЁё]/) == -1) {
        showError(elems.name.parentNode, 'Введите буквы');
        elems.name.style.border = "1px solid #ff0000";
        err++;
    } else if (elems.name.value.length > 15) {
        showError(elems.name.parentNode, 'Максимальная длина 15 букв');
        elems.name.style.border = "1px solid #ff0000";
        err++;
    }

    resetError(elems.count.parentNode);
    if (!elems.count.value) {
        showError(elems.count.parentNode, ' Укажите количество.');
        elems.count.style.border = "1px solid #ff0000";
        err++
    } else if ((elems.count.value.search(/[1-9]/) == -1) || (elems.count.value.search(/[A-zА-яЁё]/) != -1)) {
        showError(elems.count.parentNode, 'Введите число');
        elems.count.style.border = "1px solid #ff0000";
        err++;
    }
    if (err > 0) {
        return false;
    } else {
        elems.name.removeAttribute("style");
        elems.count.removeAttribute("style");
        return true;
    }
}