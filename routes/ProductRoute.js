import express from "express";
import { addImages, createProduct, deleteProduct, geAllProducts, getProductById, updateProduct } from "../controllers/Products.js";
import { upload } from "../middleware/uploadImages.js";

const router = express.Router();

router.post("/products/create-product", upload.single("thumbnail"), createProduct);
router.get("/products/", geAllProducts);
router.get("/products/:id", getProductById);
router.put("/products/update-product/:id", upload.single("thumbnail"), updateProduct);
router.delete("/products/delete-product/:id", deleteProduct);

router.put("/products/add-images/:id", upload.array("images", 3), addImages);

export default router;
