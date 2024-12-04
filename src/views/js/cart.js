
$(document).ready(function() {

  function updateTotal() {
    let total = 0;
    $('.total').each(function() {
      total += parseFloat($(this).text().replace('$', ''));
    });
    $('.total-value').text('$' + total.toFixed(2));
  }

  updateTotal();

  $('.remove-from-cart').click(function() {
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
