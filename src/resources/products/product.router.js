import { Router } from "express";
import crud from "./product.controller";

const router = Router();

// /products
router
	.route("/")
	.get(crud.getMany)
	.post(crud.createOne);

// /products/:id
router
	.route("/:id")
	.get(crud.getOne)
	.put(crud.updateOne)
	.delete(crud.removeOne);

export default router;
