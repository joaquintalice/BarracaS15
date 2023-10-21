// import { jsPDF } from "jspdf";

document.addEventListener("DOMContentLoaded", () => {
    const buyBtn = document.getElementById('buy-btn')
    buyBtn.addEventListener('click', () => {
        alert('productos comprados con éxito je')
        generateBill();
        localStorage.removeItem('carritoJe')
        location.reload()
    })
    getLocalStorageData()

})


function generateBill() {
    const lsData = JSON.parse(localStorage.getItem('carritoJe'));

    // Crear un nuevo documento jsPDF en modo retrato
    const doc = new jsPDF();

    // Configurar el encabezado del ticket
    doc.setFontSize(16);
    doc.text("Barraca Ladrillos SRL", 70, 10);
    doc.setFontSize(12);
    doc.text("Dirección: Groenlandia", 70, 20);
    doc.text("Teléfono: 123-456-7890", 70, 30);
    doc.text("Fecha: " + new Date().toLocaleString(), 10, 50);

    // Configurar la tabla de productos
    doc.setFontSize(14);
    doc.text("Producto", 10, 70);
    doc.text("Precio por unidad", 90, 70);
    doc.text("Cantidad", 150, 70);
    doc.text("Subtotal", 190, 70);

    let y = 80; // Posición inicial de la tabla

    let total = 0;

    // Iterar a través de los productos en el carrito
    lsData.forEach((product) => {
        const { name, cost, count } = product;
        const subtotal = cost * count;
        total += subtotal;

        doc.setFontSize(12);
        doc.text(name, 10, y);
        doc.text('$' + cost.toFixed(2), 90, y);
        doc.text(count.toString(), 150, y);
        doc.text('$' + subtotal.toFixed(2), 190, y);

        y += 10;
    });

    // Agregar el total al final
    doc.setFontSize(14);
    doc.text("Total:", 160, y + 10);
    doc.text('$' + total.toFixed(2), 180, y + 10);

    // Generar el contenido del PDF en formato blob
    const pdfBlob = doc.output('blob');

    // Crear una URL de objeto para el blob del PDF
    const pdfURL = URL.createObjectURL(pdfBlob);

    // Abrir el PDF en una nueva ventana o pestaña
    window.open(pdfURL);

    // No es necesario guardar el documento como archivo físico en este caso

    // Finalmente, limpiar la URL de objeto cuando no sea necesario
    URL.revokeObjectURL(pdfURL);
}





function getLocalStorageData() {
    const lsData = JSON.parse(localStorage.getItem('carritoJe'));
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
        localStorage.removeItem('carritoJe')
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
    const lsData = JSON.parse(localStorage.getItem('carritoJe'));
    const filteredData = lsData.filter(prod => prod.id != id)
    localStorage.removeItem('carritoJe');
    localStorage.setItem('carritoJe', JSON.stringify(filteredData));
    location.reload()
}