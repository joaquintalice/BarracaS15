document.addEventListener("DOMContentLoaded", main)


function main() {
    createForm()
}

function createForm() {
    const formulario = document.getElementById("create-form");
    formulario.addEventListener("submit", handleSubmit);
}

function handleSubmit(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const stock = document.getElementById('stock').value;
    const currency = document.getElementById('currency').value;
    const price = document.getElementById('price').value;
    const description = document.getElementById('description').value;

    console.log(name)
    console.log(stock)
    console.log(currency)
    console.log(price)
    console.log(description)
    const data = {
        id: Math.floor((Math.random() * 1000000)),
        name: name,
        stock: parseInt(stock),
        currency: currency,
        cost: parseFloat(price),
        description: description
    }
    console.log(data)
    const lsData = JSON.parse(localStorage.getItem('data'));

    if (lsData) {
        localStorage.removeItem('data');
        localStorage.setItem('data', JSON.stringify([...lsData, data]));
        alert('producto agregado al stock con éxito')
        location.href = 'index.html'
    }
}