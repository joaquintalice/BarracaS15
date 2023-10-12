document.addEventListener("DOMContentLoaded", () => {
    const buyBtn = document.getElementById('buy-btn')
    buyBtn.addEventListener('click', () => {
        alert('productos comprados con éxito je')
        localStorage.removeItem('carrito')
        location.reload()
    })
    getLocalStorageData()

})

function getLocalStorageData() {
    const lsData = JSON.parse(localStorage.getItem('carrito'));
    if (lsData) {
        showCartData(lsData)
    }
}

function showCartData(cartDataArray) {
    const dataContainer = document.getElementById("data-container");
    const totalRegister = document.getElementById('total');
    const select = document.getElementById('select');
    const alert = document.getElementById('alerta');

    if (cartDataArray.length == 0) {
        localStorage.removeItem('carrito')
        location.reload()
    }
    if (!cartDataArray) {
        alert.classList.add('d-block')
    } else {
        alert.classList.add('d-none')
    }

    let total = 0;
    cartDataArray.map((element, index) => {
        const row = document.createElement("tr");
        const { id, name, count, cost, currency, stock } = element;
        const subtotal = cost * count;
        total += subtotal
        row.innerHTML += `
                <td>${name}</td>
                <td>${currency} ${cost}</td>
                <td><input type="number" id="prodCount${index}" min="1" max="${stock}" value="${count}"></td>
                <td id="subtotal${index}">${currency} ${subtotal}</td>
                <td class='text-center'><Button class='btn btn-danger' onClick='deleteData(${id} )'><i class="bi bi-trash3"></i></Button></td>
            `;
        dataContainer.appendChild(row);

        // Establece el valor minimo y maximo del input prodCount e impide que se ingresen letras
        document.getElementById(`prodCount${index}`).addEventListener('input', (event) => {
            if (event.target.value < 1) {
                event.target.value = 1;
            }
            if (event.target.value > 1000) {
                event.target.value = 1000;
            }
            let newCount = event.target.value;
            const newSubtotal = (cost) * newCount;

            document.getElementById(`subtotal${index}`).innerText = `${currency} ${newSubtotal.toFixed(2)}`;
            total = (total - subtotal) + newSubtotal
            console.log(newSubtotal)
            totalRegister.innerHTML = total.toFixed(2)
        });
        totalRegister.innerHTML = total.toFixed(2)
    });

    select.addEventListener('change', () => {
        let tempTotal = total
        if (select.value === 'Credit') tempTotal *= 1.07
        if (select.value === 'Debit') tempTotal
        if (select.value === 'Cash') tempTotal *= 0.9
        totalRegister.innerHTML = tempTotal.toFixed(2)
    })

}


function deleteData(id) {
    const lsData = JSON.parse(localStorage.getItem('carrito'));
    const filteredData = lsData.filter(prod => prod.id != id)
    localStorage.removeItem('carrito');
    localStorage.setItem('carrito', JSON.stringify(filteredData));
    location.reload()
}