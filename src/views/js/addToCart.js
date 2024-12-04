$(document).ready(function() {
    // Add to Cart functionality
    $('.add-to-cart').click(function() {
      const productId = $(this).data('product-id');
      const productPrice = $(this).data('product-price');
      const quantity = parseInt($('#quantity-input').val());
  
      $.ajax({
        url: '../cart-add',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ product: { product_id: productId, quantity: quantity, price: productPrice } })
      });
    });
  });