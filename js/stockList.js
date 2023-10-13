document.addEventListener('DOMContentLoaded', main);
const URL = './products.json'

async function main() {
    const lsData = JSON.parse(localStorage.getItem('dataJe'));
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
    const dataContainer = document.getElementById('stock-container');
    let template = ``;

    for (let prod of data) {
        const { id, name, stock, description, currency, cost } = prod
        template += `
            <tr class="text-center">
                <td>${id}</td>
                <td>${name}</td>
                <td>${stock}</td>
                <td>${description}</td>
                <td>${currency} ${cost}</td>
                <td><Button class='btn btn-danger' onClick='deleteData(${id} )'><i class="bi bi-trash3"></i></Button></td>
            </tr>
        `
    }

    dataContainer.innerHTML = template
}


function deleteData(id) {
    console.log(id)
    const lsData = JSON.parse(localStorage.getItem('dataJe'));
    console.log(lsData)
    const filteredData = lsData.filter(prod => prod.id != id)
    console.log(filteredData)
    localStorage.removeItem('dataJe');
    localStorage.setItem('dataJe', JSON.stringify(filteredData));
    location.reload()
}

function setLocalStorageData(data) {
    const lsData = JSON.parse(localStorage.getItem('dataJe'));

    if (!lsData) {
        localStorage.setItem('dataJe', JSON.stringify(data));
        return;
    }

    return;
}