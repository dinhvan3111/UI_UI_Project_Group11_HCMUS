import express from 'express';
import categoryModel from '../models/category.model.js';

const router = express.Router();

router.get('/:id', async function(req, res) {
    res.render('vwProduct/search_result');
});

export default router;