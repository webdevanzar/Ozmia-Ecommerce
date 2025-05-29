import express from 'express';
import {  register, login, 
    getAllProductsController, getProductByIdController,
    addToCartController, deleteCartControll, getCartControll, updateCartControll,
    addwishListControll, deleteWishListControll, getWishlistControll,  placeOrdersController,
    getAllOrdersController
} from '../controllers/userController';
import { authenticateToken } from '../middleware/auth';
import upload from '../middleware/upload';

const router = express.Router();

// user routes
router.post('/login',upload.none(),login);
router.post('/register', register)

//Product Routes
router.get("/products", getAllProductsController);
router.get("/products/:id", getProductByIdController);

//cart routes
router
  .get("/cart", authenticateToken, getCartControll)
  .post("/cart", authenticateToken, addToCartController)
  .delete("/cart", authenticateToken, deleteCartControll)
  .put("/cart", authenticateToken, updateCartControll);

//wishlist routes
router
  .get("/wishlist", authenticateToken, getWishlistControll)
  .post("/wishlist", authenticateToken, addwishListControll)
  .delete("/wishlist", authenticateToken, deleteWishListControll);

//order Routes
router
  .post("/orders", authenticateToken, placeOrdersController)
  .get("/orders", authenticateToken, getAllOrdersController);

export default router;
