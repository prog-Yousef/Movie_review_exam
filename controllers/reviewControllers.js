const Review = require('../models/Review');

const addReview = async (req, res) => {
  try {
    const { movieId, rating, comment } = req.body;
    const { userId } = req.user;
    const newReview = new Review({ movieId, userId, rating, comment });
    await newReview.save();
    res.status(201).json(newReview);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getReviews = async (req, res) => {
  try {
    const reviews = await Review.find();
    res.status(200).json(reviews);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getReviewById = async (req, res) => {
  try {
    const { id } = req.params;
    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ error: 'Review not found' });
    res.status(200).json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const updateReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.user;
    const updates = req.body;
    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ error: 'Review not found' });

    if (review.userId.toString() !== userId && role !== 'admin')
      return res.status(403).json({ error: 'Access denied' });

    const updatedReview = await Review.findByIdAndUpdate(id, updates, {
      new: true,
    });

    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, role } = req.user;
    const review = await Review.findById(id);
    if (!review) return res.status(404).json({ error: 'Review not found' });

    if (review.userId.toString() !== userId && role !== 'admin')
      return res.status(403).json({ error: 'Access denied' });

    await Review.findByIdAndDelete(id);
    res.status(200).json({ message: 'deleted success!' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { addReview, getReviews, getReviewById, updateReview, deleteReview };
