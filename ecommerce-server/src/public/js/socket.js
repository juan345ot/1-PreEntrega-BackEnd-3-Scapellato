const socket = io();

// Función para renderizar la lista de productos
const renderProductList = (products) => {
  const productList = document.getElementById('product-list');
  productList.innerHTML = '';

  // Validar que los productos sean un array y tengan el formato correcto
  if (Array.isArray(products) && products.length > 0) {
    products.forEach(product => {
      const li = document.createElement('li');
      li.textContent = `${product.title} - $${product.price.toFixed(2)}`;
      productList.appendChild(li);
    });
  } else {
    const noProductsMessage = document.createElement('li');
    noProductsMessage.textContent = 'No hay productos disponibles';
    productList.appendChild(noProductsMessage);
  }
};

// Manejar la recepción de productos desde el servidor
socket.on('products', (products) => {
  if (products && products.payload && Array.isArray(products.payload)) {
    renderProductList(products.payload);
  } else {
    console.error('Error: Los datos recibidos no son un array o no tienen la propiedad "payload":', products);
  }
});

// Manejar errores recibidos del servidor
socket.on('error', (errorMessage) => {
  console.error('Error del servidor:', errorMessage);
  alert('Ocurrió un error en el servidor. Por favor, inténtalo de nuevo más tarde.');
});
