import { addImage, adminLogin, createProductController,  getAllOrdersController, getAllProductDatas, 
    getAllusersData, getproductbyId,  updateProductController,deleteImage, 
    ToggleProductscontroll} from '../controllers/adminController';
import express from 'express';
import  {authenticateAdmin} from '../middleware/adminauth';
import upload from '../middleware/upload';
const router = express.Router();


router.post('/login',upload.none(),adminLogin);
router.get('/users', authenticateAdmin, getAllusersData);
router.get('/products', authenticateAdmin, getAllProductDatas);
router.get('/products/:id', authenticateAdmin, getproductbyId);
router.post('/products',authenticateAdmin,upload.single('image'),createProductController);

router.put('/products',authenticateAdmin,upload.none(),updateProductController);
router.patch('/products',authenticateAdmin,upload.none(),ToggleProductscontroll);
router.post('/image', upload.single('image'),authenticateAdmin, addImage);
router.delete('/image',authenticateAdmin,deleteImage);
router.get('/orders', authenticateAdmin, getAllOrdersController);


export default router;

