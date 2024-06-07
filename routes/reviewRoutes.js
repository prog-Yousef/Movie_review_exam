const express = require('express');
const router = express.Router();
const { protect,admin } = require('../middlewares/authMiddleware');
const reviewController = require('../controllers/reviewControllers');

router.post('/', protect,admin, reviewController.addReview);
router.get('/', reviewController.getReviews);
router.get('/:id', reviewController.getReviewById);
router.put('/:id', protect,admin,reviewController.updateReview);
router.delete('/:id', protect,admin,reviewController.deleteReview);

module.exports = router;
