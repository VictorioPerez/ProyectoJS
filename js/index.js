const API = 'js/api.json';
let carrito = {};

$(".head").hide();

//se imprime el carrito del Local Storage
$(document).ready(() => {
    if (localStorage.getItem('carrito')) {
        carrito = JSON.parse(localStorage.getItem('carrito'))
        addCarrito();
    }
})
/*
    document.addEventListener('DOMContentLoaded',() =>{
        if (localStorage.getItem('carrito')){
            carrito = JSON.parse(localStorage.getItem('carrito'))
            addCarrito();

    }
}) 
*/


// funcion que obtiene los datos de la api creada y se imprimen en la pagina
const getData = (apiUrl) => {
    return fetch(apiUrl)
        .then(response => response.json())
        .then(json => {
            console.log(json),
                printData(json)
        })
        .catch(error => {
            console.error('Error ', error)
        })

}

// funcion para imprimir los datos en la pagina
const printData = (data) => {
    let html = '';
    data.forEach(c => {
        html += '<div class="col-xl-3 col-lg-6 col-md-12 col-xs-12 carta">' +
            '<div>' +
            '<img src="' + c.img + '" class="imgCart">' +
            '<span class="precio">$' + c.precio + '</span>' +
            '<p class="descripcion">' + c.title + '</p>' +
            '<button class="btn-grad" id="' + c.id + '"> ' + "Agregar" + '</button>' +
            '</div>' +
            '</div>'

    });

    $(".productos").html(html);

}

//funcion por si se hace click en el boton de comprar
$(".productos").click(e => {
    if (e.target.classList.contains('btn-grad')) {
        setCarrito(e.target.parentElement);
    }
    e.stopPropagation();
})

//funcion para el compartamiento de los botones + y - del carrito
$(".carritoPage").click(e => {

    //si se presiona el boton de + la cantidad aumenta 1 
    if (e.target.classList.contains('btn-info')) {
        const producto = carrito[e.target.dataset.id];      
        producto.cantidad = carrito[e.target.dataset.id].cantidad + 1;
        carrito[e.target.dataset.id] = { ...producto };

        addCarrito();
    }

    //si se presiona el boton de - la cantidad disminuye 1 
    if (e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.id];
        producto.cantidad = carrito[e.target.dataset.id].cantidad - 1;
        carrito[e.target.dataset.id] = { ...producto };

        //si la cantidad es 0, el producto se borra del carrito 
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id];
        }
        addCarrito();
    }

    e.stopPropagation();
})


// funcion para vaciar el carrito
$(".vaciar").click(e => {

    carrito = {};
    addCarrito();
    e.stopPropagation();
})

// funcion para crear el carrito de objetos
const setCarrito = objeto => {

    precio = objeto.querySelector('span').textContent;
    precioAct = parseInt(precio.replace('$', ''));

    const producto = {
        id: objeto.querySelector('.btn-grad').id,
        title: objeto.querySelector('p').textContent,
        precio: precioAct,
        img: objeto.querySelector('img').src,
        cantidad: 1,

    }


    // si el objeto ya existe en el carrito, se le suma uno a la cantidad
    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1;


    }

    carrito[producto.id] = { ...producto }
    addCarrito();

}

// funcion para imprimir el carrito 
const addCarrito = () => {
    $(".productoCarrito").html('');
    Object.values(carrito).forEach(producto => {
        $(".productoCarrito").append('<div class="producto" >    <div> <img src="' + producto.img + '" alt=""> </div>' +
            '<div class"datos"> <h4>' + producto.title + '</h4>' +
            '<span class = "precioFinal">$' + producto.precio * producto.cantidad + '</span>' +
            '<div class="cantidad"> <button class= "btn btn-info btn-sm" data-id="' + producto.id + '"> + </button> <span class="cantidad"> ' + producto.cantidad + '</span> <button class= "btn btn-danger btn-sm" data-id="' + producto.id + '"> - </button> </div> </div> </div> '
        )
    })
    // si el carrito no tiene productos sale el mensaje de carrito vacio
    if (Object.keys(carrito).length === 0) {
        $(".productoCarrito").html("<h4>No hay productos en el carrito</h4>");
        $(".head").hide();

    }

    // si tiene elementos el carito aparecen los botones de arriba y el total 
    if (Object.keys(carrito).length > 0) {
        $(".head").show();

        precioFinal = 0;
        // se recorren los objetos del carrito para sacar el precio final de la compra
        Object.values(carrito).forEach(producto => {
            aux = producto.precio * producto.cantidad;
            precioFinal = precioFinal + aux;

        })

        $(".precioTotal").html('<span>Total $' + precioFinal + '</span>');

    }
    //se guarda el carrito en el lcoalStorage
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

// funcion para ver y esconder el carrito de compras presionando la imagen del carrito
$(".fas").click(function () {
    $(".carritoPage").fadeToggle("fast");
});

//se llama a la funcion de la api
getData(API);


