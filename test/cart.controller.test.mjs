import { expect } from 'chai';
import sinon from 'sinon';
import cartController from '../src/controllers/cart.controller.js'; // Import the instance
import CartService from '../src/services/cart.service.js';
import AccessService from '../src/services/access.service.js';

describe('CartController', () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      user: { id: 1 },
      body: {
        product: {
          price: 10.99,
          quantity: 2,
          type: 1
        },
        productId: 1,
      },
      isAuthenticated: sinon.stub().returns(true)
    };
    res = {
      render: sinon.spy(),
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
      redirect: sinon.spy()
    };
    next = sinon.spy();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('getUserCart', () => {
    it('should render cart.ejs with correct data', async () => {
      const cartData = [{ id: 1, name: 'Product 1' }];
      const avatar = 'avatar.png';
      const numProducts = 5;

      sinon.stub(CartService, 'getUserCart').resolves(cartData);
      sinon.stub(AccessService, 'getAvatar').resolves(avatar);
      sinon.stub(CartService, 'getCartProductsSize').resolves(numProducts);

      await cartController.getUserCart(req, res, next);

      expect(res.render.calledOnce).to.be.true;
      expect(res.render.firstCall.args[0]).to.equal('cart.ejs');
      expect(res.render.firstCall.args[1]).to.deep.equal({
        cart: cartData,
        page: 'cart',
        avatar,
        numProducts,
        isAuthenticated: true
      });
    });
  });

  describe('addToCart', () => {
    it('should add a product to the cart and redirect to /shop', async () => {
      const productData = {
        price: 10.99,
        quantity: 2,
        type: 1
      };
      sinon.stub(CartService, 'addToCart').resolves(productData);

      await cartController.addToCart(req, res, next);

      expect(CartService.addToCart.calledOnceWith(1, productData)).to.be.true;
      expect(res.redirect.calledOnceWith('/shop')).to.be.true;
    });
  });
  describe('updateCart', () => {
    it('should update the cart and return a JSON response', async () => {
      const productData = {
        price: 10.99,
        quantity: 2,
        type: 1
      };
      const resultData = { success: true };
      const updateUserCartQuantityStub = sinon.stub(CartService, 'updateUserCartQuantity').resolves(resultData);
      var new_req = req;
      new_req.body = req.body.product;
      await cartController.updateCart(new_req, res, next);
  
      console.log('Called with:', updateUserCartQuantityStub.firstCall.args);
  
      expect(updateUserCartQuantityStub.calledOnceWith(1, productData)).to.be.true;
      expect(res.json.calledOnceWith({
        message: 'ok',
        metadata: resultData
      })).to.be.true;
    });
  });
  describe('removeFromCart', () => {
    it('should remove a product from the cart and return a JSON response', async () => {
      const resultData = { success: true };
      const numProducts = 4;
      sinon.stub(CartService, 'removeProduct').resolves(resultData);
      sinon.stub(CartService, 'getCartProductsSize').resolves(numProducts);

      await cartController.removeFromCart(req, res, next);

      expect(CartService.removeProduct.calledOnceWith(1, 1)).to.be.true;
      expect(res.json.calledOnceWith({
        message: 'Product removed from cart',
        result: resultData,
        numProducts
      })).to.be.true;
    });
  });
});