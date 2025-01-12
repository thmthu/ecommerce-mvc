import { expect } from "chai";
import sinon from "sinon";
import orderController from "../src/controllers/order.controller.js";
import OrderService from "../src/services/order.service.js";
import CartService from "../src/services/cart.service.js";
import AccessService from "../src/services/access.service.js";
import ProductService from "../src/services/product.service.js";
import { hashId } from "../src/utils/hash.js";

describe("OrderController", () => {
  let req, res, next;

  beforeEach(() => {
    req = {
      user: { id: 1 },
      body: {
        price: 100,
        fullName: "John Doe",
        email: "john@example.com",
        phoneNumber: "1234567890",
        address: "123 Main St",
      },
      params: { id: 1 },
      isAuthenticated: sinon.stub().returns(true),
    };
    res = {
      render: sinon.spy(),
      status: sinon.stub().returnsThis(),
      json: sinon.spy(),
      redirect: sinon.spy(),
    };
    next = sinon.spy();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe("getOrder", () => {
    it("should render order.ejs with correct data", async () => {
      const orders = [{ id: 1, name: "Order 1" }];
      const avatar = "avatar.png";
      const numProducts = 5;

      sinon.stub(OrderService, "getAllUserOrders").resolves(orders);
      sinon.stub(AccessService, "getAvatar").resolves(avatar);
      sinon.stub(CartService, "getCartProductsSize").resolves(numProducts);

      await orderController.getOrder(req, res, next);

      expect(res.render.calledOnce).to.be.true;
      expect(res.render.firstCall.args[0]).to.equal("order.ejs");
      expect(res.render.firstCall.args[1]).to.deep.equal({
        page: "order",
        avatar,
        numProducts,
        isAuthenticated: true,
        orders,
        hashId,
      });
    });
  });

  describe("getDetail", () => {
    it("should render order-detail.ejs with correct data", async () => {
      const order = {
        id: 1,
        order_products: [{ product_id: 1, quantity: 2 }],
        totalPrice: 100,
      };
      const avatar = "avatar.png";
      const numProducts = 5;

      sinon.stub(OrderService, "getOrderById").resolves(order);
      sinon.stub(AccessService, "getAvatar").resolves(avatar);
      sinon.stub(CartService, "getCartProductsSize").resolves(numProducts);

      await orderController.getDetail(req, res, next);

      expect(res.render.calledOnce).to.be.true;
      expect(res.render.firstCall.args[0]).to.equal("order-detail.ejs");
      expect(res.render.firstCall.args[1]).to.deep.equal({
        orderId: 1,
        cart: order.order_products,
        totalPrice: order.totalPrice,
        page: "detail",
        avatar,
        numProducts,
        isAuthenticated: true,
      });
    });
  });
});
