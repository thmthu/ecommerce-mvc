$(document).ready(function() {
  function debounce(func, wait) {
    let timeout;
    return function(...args) {
      const context = this;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
    };
  }

  function updateTotal() {
    let total = 0;
    $('.total').each(function() {
      total += parseFloat($(this).text().replace('$', ''));
    });
    $('.total-value').text('$' + total.toFixed(2));
  }

  updateTotal();

  $('.btn-minus').onclick(debounce(function() {
    const productId = $(this).data('product-id');
    const input = $(this).closest('.quantity').find('input');
    let quantity = parseInt(input.val());

    if (quantity > 1) {
      quantity--;
      input.val(quantity);

      fetch('/cart-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({product: { productId: productId, quantity: quantity }})
      })
      .then(response => response.json())
      .then(data => {
        const row = input.closest('tr');
        const price = parseFloat(row.find('td:nth-child(2)').text().replace('$', ''));
        row.find('.total').text('$' + (price * quantity).toFixed(2));
        updateTotal();
      })
      .catch(error => {
        alert('Error updating cart.');
      });
    }
  }, 300)); // 300ms delay

  $('.btn-plus').onclick(debounce(function() {
    const productId = $(this).data('product-id');
    const input = $(this).closest('.quantity').find('input');
    let quantity = parseInt(input.val());

    quantity++;
    input.val(quantity);

    fetch('/cart-update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({product: { productId: productId, quantity: quantity }})
    })
    .then(response => response.json())
    .then(data => {
      const row = input.closest('tr');
      const price = parseFloat(row.find('td:nth-child(2)').text().replace('$', ''));
      row.find('.total').text('$' + (price * quantity).toFixed(2));
      console.log(price);
      updateTotal();
    })
    .catch(error => {
      alert('Error updating cart.');
    });
  }, 300)); // 300ms delay

  $('.remove-from-cart').onclick(function() {
    const productId = $(this).data('product-id');
    const row = $(this).closest('tr');

    $.ajax({
      url: '/cart-remove-product',
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ productId: productId }),
      success: function(response) {
        row.remove();
        updateTotal();
      },
      error: function(error) {
        alert('Error removing product from cart.');
      }
    });
  });
});