const uri = 'api/books';
let books = [];

function getItems() {
    fetch(uri)
        .then(response => response.json())
        .then(data => _displayItems(data))
        .catch(error => console.error('Unable to get items.', error));
}

function addItem() {

    const addNameTextbox = document.getElementById('add-name');
    const addPriceTextbox = document.getElementById('add-price');
    const addCategoryTextbox = document.getElementById('add-category');
    const addAuthorTextbox = document.getElementById('add-author');

    const item = {
        Name: addNameTextbox.value.trim(),
        Price: addPriceTextbox.value.trim(),
        Category: addCategoryTextbox.value.trim(),
        Author: addAuthorTextbox.value.trim(),
    };

    fetch(uri, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(response => response.json())
        .then(() => {
            getItems();
            addNameTextbox.value = '';
        })
        .catch(error => console.error('Unable to add item.', error));

    closeInput('addForm');
}

function deleteItem(id) {
    fetch(`${uri}/${id}`, {
        method: 'DELETE'
    })
        .then(() => getItems())
        .catch(error => console.error('Unable to delete item.', error));
}

function displayEditForm(id) {
    const item = books.find(item => item.Id === id);
    document.getElementById('add-button').style.display = 'block';

    document.getElementById('edit-id').value = item.Id;
    document.getElementById('edit-name').value = item.Name;
    document.getElementById('edit-price').value = item.Price;
    document.getElementById('edit-category').value = item.Category;
    document.getElementById('edit-author').value = item.Author;

    document.getElementById('editForm').style.display = 'block';
    document.getElementById('addForm').style.display = 'none';
}

function updateItem() {
    const itemId = document.getElementById('edit-id').value;
    const item = {
        Id: itemId,
        Name: document.getElementById('edit-name').value.trim(),
        Price: document.getElementById('edit-price').value.trim(),
        Category: document.getElementById('edit-category').value.trim(),
        Author: document.getElementById('edit-author').value.trim()
    };

    fetch(`${uri}/${itemId}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(item)
    })
        .then(() => getItems())
        .catch(error => console.error('Unable to update item.', error));

    closeInput('editForm');

    return false;
}

function showAddForm() {
    document.getElementById('addForm').style.display = 'block';
    document.getElementById('editForm').style.display = 'none';
    document.getElementById('add-button').style.display = 'none';
}

function closeInput(name) {
    document.getElementById(name).style.display = 'none';
    document.getElementById('add-button').style.display = 'block';
}

function _displayCount(itemCount) {
    const name = (itemCount === 1) ? 'book' : 'books';

    document.getElementById('counter').innerText = `${itemCount} ${name}`;
}

function _displayItems(data) {
    const tBody = document.getElementById('books');
    tBody.innerHTML = '';

    _displayCount(data.length);

    const button = document.createElement('button');

    data.forEach(item => {

        let editButton = button.cloneNode(false);
        editButton.innerText = 'Edit';
        editButton.setAttribute('onclick', `displayEditForm('${item.Id}')`);

        let deleteButton = button.cloneNode(false);
        deleteButton.innerText = 'Delete';
        deleteButton.setAttribute('onclick', `deleteItem('${item.Id}')`);

        let tr = tBody.insertRow();

        let td0 = tr.insertCell(0);
        let textNode0 = document.createTextNode(item.Name);
        td0.appendChild(textNode0);

        let td1 = tr.insertCell(1);
        let textNode1 = document.createTextNode(item.Price);
        td1.appendChild(textNode1);

        let td2 = tr.insertCell(2);
        let textNode2 = document.createTextNode(item.Category);
        td2.appendChild(textNode2);

        let td3 = tr.insertCell(3);
        let textNode3 = document.createTextNode(item.Author);
        td3.appendChild(textNode3);

        let td4 = tr.insertCell(4);
        td4.appendChild(editButton);

        let td5 = tr.insertCell(5);
        td5.appendChild(deleteButton);
    });

    books = data;
}