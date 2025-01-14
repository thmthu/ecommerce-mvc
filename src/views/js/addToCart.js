$(document).ready(function() {
    // Add to Cart functionality
    $('.add-to-cart').click(function() {
      const productId = $(this).data('product-id');
      const productPrice = $(this).data('product-price');
      const quantity = parseInt($('#quantity-input').val());

      if (quantity <= 0) {
        alert('Quantity must be greater than 0');
        return;
      }
  
      $.ajax({
        url: '../cart-add',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ product: { product_id: productId, quantity: quantity, price: productPrice, type: 0 } }),
        success: function(response) {
          if (!response.result || response.result === undefined) {
            alert('Please login to add to cart');
          }
          else
          if (response.result.message === 'Product out of stock') {
            alert("Product out of stock!")
          }
          else {
            alert('Product added to cart successfully!');
          }
          $('#cart-num').text(response.numProducts);
        },
      });
    });
  });

  function addToCart(productId, quantity, price) {
    $.ajax({
      url: '../cart-add',
      type: 'POST',
      data: {
        product: {
          product_id: productId,
          quantity: quantity,
          price: price,
          type: 0
        },
      },
      success: function(response) {
        if (!response.result || response.result === undefined) {
          alert('Please login to add to cart');
        }
        else
        if (response.result.message === 'Product out of stock') {
          alert("Product out of stock!")
        }
        else {
          alert('Product added to cart successfully!');
        }
        $('#cart-num').text(response.numProducts);
      },
    });
  }