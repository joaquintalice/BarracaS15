document.addEventListener('DOMContentLoaded', main);
const URL = './products.json'

async function main() {
    const lsData = JSON.parse(localStorage.getItem('data'));
    if (!lsData) {
        const data = await getData()
        showData(data)
        setLocalStorageData(data)
    } else {
        showData(lsData)
    }

}

async function getData() {
    const res = await fetch(URL);
    if (!res.ok) throw new Error(`Je`);
    const data = await res.json();
    return data
}


function showData(data) {
    const dataContainer = document.getElementById('data-container');
    console.log(data)
    let template = ``;

    for (let prod of data) {
        const { id, name, stock, description, currency, cost } = prod
        template += `
        <div class='col-4'>
            <div class="card">
                <div class="card-body">
                    <h5 class="card-title">${name}</h5>
                    <h6 class="card-subtitle mb-2 text-body-secondary">Stock: ${stock}</h6>
                    <h4>${currency} ${cost}</h4>
                    <p class="card-text">${description}</p>
                    <Button class="btn btn-primary" id='addToCartBtn-${id}'>Añadir al carrito</Button>
                </div>
            </div>
        </div>
        `

        setTimeout(() => {
            const cartBtn = document.getElementById(`addToCartBtn-${id}`);
            cartBtn.addEventListener('click', () => {
                addToCart(prod)
                alert('producto agregado al carrito jeje')
            })
        }, 300);
    }
    dataContainer.innerHTML = template

}


function addToCart({ name, stock, description, currency, cost, id }) {

    const productWithCount = {
        id: id,
        name: name,
        stock: stock,
        currency: currency,
        description: description,
        cost: cost,
        count: 1
    }

    const localStorageData = JSON.parse(localStorage.getItem('carrito'));

    if (!localStorageData) {
        localStorage.setItem('carrito', JSON.stringify([productWithCount]));
        return;
    }

    const yaExisteElProducto = localStorageData.some((element) => {
        return id === element.id;
    })


    if (!yaExisteElProducto) {
        localStorage.setItem('carrito', JSON.stringify([...localStorageData, productWithCount]));
        return;
    }

    const productoExistente = localStorageData.find(element => {
        return element.id === id;
    })
    productoExistente.count += 1;

    const filteredArray = localStorageData.filter(elem => {
        return elem.id !== id
    });

    localStorage.removeItem('carrito')
    localStorage.setItem('carrito', JSON.stringify([...filteredArray, productoExistente]));

}