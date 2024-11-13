const cartProductList = document.getElementById('cart-product-list');
const emptyCartButton = document.getElementById('empty-cart-button');
const cartTotalContainer = document.getElementById('cart-total-container');

// Función para manejar la respuesta del servidor
const handleResponse = async (response) => {
  if (response.ok) {
    const data = await response.json();
    if (data.status === 'success') {
      return data;
    } else {
      throw new Error(data.error);
    }
  } else {
    const data = await response.json();
    throw new Error(data.error);
  }
};

// Actualizar el total del carrito
const updateCartTotal = () => {
  const cartProducts = cartProductList.querySelectorAll('li');
  let total = 0;

  cartProducts.forEach(item => {
    const quantity = parseInt(item.querySelector('.quantity-input').value);
    const price = parseFloat(item.querySelector('.unit-price').textContent.replace('Precio unitario: $', ''));
    total += quantity * price;
  });

  cartTotalContainer.innerHTML = '';

  if (cartProducts.length > 0) {
    const totalElement = document.createElement('p');
    totalElement.textContent = `Total del Carrito: $${total.toFixed(2)}`;
    cartTotalContainer.appendChild(totalElement);
  }
};

// Eliminar producto del carrito
const deleteProductFromCart = async (cartId, productId, listItem) => {
  try {
    const response = await fetch(`/api/carts/${cartId}/product/${productId}`, { method: 'DELETE' });
    await handleResponse(response);
    listItem.remove();
    alert('Producto eliminado del carrito');
    updateCartTotal();
  } catch (error) {
    console.error('Error al eliminar producto:', error.message);
    alert('Error al eliminar producto');
  }
};

// Actualizar la cantidad de productos en el carrito
const updateProductQuantity = async (cartId, productId, listItem, newQuantity) => {
  try {
    const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity: newQuantity })
    });
    await handleResponse(response);

    const unitPrice = parseFloat(listItem.querySelector('.unit-price').textContent.replace('Precio unitario: $', ''));
    listItem.querySelector('.quantity-input').value = newQuantity;
    listItem.querySelector('.subtotal').textContent = `Subtotal: $${(newQuantity * unitPrice).toFixed(2)}`;
    alert('Cantidad actualizada');
    updateCartTotal();
  } catch (error) {
    console.error('Error al actualizar la cantidad:', error.message);
    alert('Error al actualizar la cantidad del producto');
  }
};

// Evento para manejar clicks en el carrito
cartProductList.addEventListener('click', (event) => {
  const listItem = event.target.closest('li');
  const productId = listItem?.dataset.productId;
  const cartId = cartProductList.dataset.cartId;

  if (!productId || !cartId) return;

  if (event.target.classList.contains('delete-product')) {
    deleteProductFromCart(cartId, productId, listItem);
  } else if (event.target.classList.contains('quantity-input')) {
    const newQuantity = parseInt(event.target.value);
    if (newQuantity > 0) {
      updateProductQuantity(cartId, productId, listItem, newQuantity);
    }
  }
});

// Vaciar el carrito
emptyCartButton.addEventListener('click', async () => {
  const cartId = emptyCartButton.dataset.cartId;

  try {
    const response = await fetch(`/api/carts/${cartId}`, { method: 'DELETE' });
    await handleResponse(response);
    alert('Carrito vaciado');
    cartProductList.innerHTML = '';
    localStorage.removeItem('cartId');
    window.location.href = '/';
  } catch (error) {
    console.error('Error al vaciar el carrito:', error.message);
    alert('Error al vaciar el carrito');
  }
});

updateCartTotal();
