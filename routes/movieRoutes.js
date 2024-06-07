const express = require('express');
const router = express.Router();
const { protect,admin } = require('../middlewares/authMiddleware');
const movieController = require('../controllers/movieController');


  router.post('/',protect,admin, movieController.addMovie);
router.get('/', movieController.getMovies);
router.get('/:id', movieController.getMovieById);
router.put('/:id', protect,admin, movieController.updateMovie);
router.delete('/:id', protect,admin, movieController.deleteMovie);
router.get('/:id/reviews',protect,admin, movieController.getMovieReviews);
router.get('/ratings', protect,movieController.getMovieRatings);   


module.exports = router;
