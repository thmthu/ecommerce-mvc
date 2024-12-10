function loadPage(page) {
  const searchQuery = document.querySelector('input[name="search"]').value;
  const price = Array.from(document.querySelectorAll('input[name="price"]:checked')).map(checkbox => checkbox.value);
  const color = Array.from(document.querySelectorAll('input[name="color"]:checked')).map(checkbox => checkbox.value);
  const size = Array.from(document.querySelectorAll('input[name="size"]:checked')).map(checkbox => checkbox.value);
  const gender = Array.from(document.querySelectorAll('input[name="gender"]:checked')).map(checkbox => checkbox.value);

    $.ajax({
      url: '/shop',
      type: 'GET',
      data: {
        currentPage: page,
        search: searchQuery,
        price: price,
        color: color,
        size: size,
        gender: gender,
      },
      success: function(data) {
        // Update the product list
        $('#product-list').html('');
        data.products.forEach(product => {
          $('#product-list').append(`
            <div class="col-lg-4 col-md-6 col-sm-12 pb-1">
              <div class="card product-item border-0 mb-4">
                <div
                  class="card-header product-img position-relative overflow-hidden bg-transparent border p-0"
                >
                  <img
                    class="img-fluid w-100 img-product"
                    src="${product.product_thumb}"
                    alt=""
                  />
                </div>
                <div
                  class="card-body border-left border-right text-center p-0 pt-4 pb-3"
                >
                  <h6 class="text-truncate mb-3">${product.product_name}</h6>
                  <div class="d-flex justify-content-center">
                    <h6 class="ml-2">$${product.product_price}</h6>
                    <h6 class="text-muted ml-2">
                      <del>$${Math.round(product.product_price * 1.1)}</del>
                    </h6>
                  </div>
                </div>
                <div
                  class="card-footer d-flex justify-content-between bg-light border"
                >
                  <a
                    href="./detail/${product._id} "
                    class="btn btn-sm text-dark p-0"
                  >
                    <i class="fas fa-eye text-primary mr-1"></i>View Detail
                  </a>
                  <form id="add-to-cart" action="/cart-add" method="POST" style="display: inline;">
                    <input type="hidden" name="product[product_id]" value="${product._id}">
                    <input type="hidden" name="product[quantity]" value="1">
                    <input type="hidden" name="product[price]" value="${product.product_price}">
                    <button type="submit" class="btn btn-sm text-dark p-0">
                      <i class="fas fa-shopping-cart text-primary mr-1"></i>Add To Cart
                    </button>
                  </form>
                </div>
              </div>
            </div>
          `);
        });

        // Update the pagination
        $('#pagination').html('');
        for (let i = 1; i <= data.totalPages; i++) {
          $('#pagination').append(`
            <li class="page-item ${data.currentPage === i ? 'active' : ''}">
              <a class="page-link" href="#" onclick="loadPage(${i})">${i}</a>
            </li>
          `);
        }

        // Attach event listeners to the new pagination links
        attachPaginationEventListeners();
      },
      error: function(err) {
        console.error('Failed to load page:', err);
      }
    });
  }