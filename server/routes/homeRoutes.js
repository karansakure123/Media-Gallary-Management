import { createCards, deleteCards, updCards } from "../controller/homeController.js";
import express from "express";
import { getCards } from "../controller/homeController.js";
const cardRouter = express.Router();
cardRouter.post('/create',createCards);
cardRouter.get('/get',getCards);
cardRouter.put('/update/:id',updCards)
cardRouter.delete('/delete/:id',deleteCards)

export default cardRouter;