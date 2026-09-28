fetch('/api/products')
  .then((response) => response.json())
  .then((products) => {
    document.getElementById('catalogue').textContent =
      products.map((product) => product.name).join(', ');
  });
