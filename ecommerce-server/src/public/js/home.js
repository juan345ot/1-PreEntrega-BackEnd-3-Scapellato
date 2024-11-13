const addToCartButtons = document.querySelectorAll('.add-to-cart');

// Función para crear un nuevo carrito
const createCart = async () => {
  try {
    const response = await fetch('/api/carts', { method: 'POST' });
    if (response.ok) {
      const data = await response.json();
      const cartId = data.payload.cartId;
      localStorage.setItem('cartId', cartId);
      return cartId;
    } else {
      throw new Error('Error al crear el carrito');
    }
  } catch (error) {
    console.error('Error al crear el carrito:', error);
    alert('Error al crear el carrito');
    return null;
  }
};

// Función para agregar un producto al carrito
const addProductToCart = async (cartId, productId, quantity) => {
  try {
    const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ quantity })
    });

    if (response.ok) {
      alert('Producto agregado al carrito');
      updateCartLink(cartId);
    } else {
      const data = await response.json();
      alert(`Error: ${data.error}`);
    }
  } catch (error) {
    console.error('Error al agregar al carrito:', error);
    alert('Error al agregar al carrito');
  }
};

// Función para actualizar el enlace del carrito
const updateCartLink = (cartId) => {
  const cartLinkContainer = document.getElementById('cart-link-container');
  cartLinkContainer.innerHTML = '';

  if (cartId) {
    const cartLink = document.createElement('a');
    cartLink.href = `/carts/${cartId}`;
    cartLink.textContent = 'Ver Carrito';
    cartLinkContainer.appendChild(cartLink);
  } else {
    cartLinkContainer.textContent = 'Carrito vacío';
  }
};

// Evento para manejar el botón "Agregar al carrito"
addToCartButtons.forEach(button => {
  button.addEventListener('click', async (event) => {
    const productId = event.target.dataset.productId;
    const quantityInput = document.querySelector(`#quantity-${productId}`);
    const quantity = parseInt(quantityInput.value);

    if (isNaN(quantity) || quantity <= 0) {
      alert('Por favor, ingresa una cantidad válida');
      return;
    }

    let cartId = localStorage.getItem('cartId');

    if (!cartId) {
      cartId = await createCart();
      if (!cartId) return; // Si no se puede crear el carrito, salir
    }

    await addProductToCart(cartId, productId, quantity);
  });
});

// Inicializar el enlace del carrito al cargar la página
const cartId = localStorage.getItem('cartId');
updateCartLink(cartId);
