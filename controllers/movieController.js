const Movie = require('../models/Movie');
const Review = require('../models/Review');




const addMovie = async (req, res) => {
  const { title, director, releaseYear, genre } = req.body;
  try {
    const newMovie = new Movie({ title, director, releaseYear, genre });
    await newMovie.save();
    res.status(201).json(newMovie);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}; 

const getMovieReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ movieId: req.params.id }).populate('userId', 'username');
    res.json(reviews);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, could not retrieve reviews' });
  }
};



const getMovies = async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, could not retrieve movies' });
  }
};

const getMovieById = async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json(movie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, could not retrieve movie' });
  }
};
const deleteMovie = async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }
    res.json({ message: 'Movie deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};


const updateMovie = async (req, res) => {
  const { title, director, releaseYear, genre } = req.body;

  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    movie.title = title || movie.title;
    movie.director = director || movie.director;
    movie.releaseYear = releaseYear || movie.releaseYear;
    movie.genre = genre || movie.genre;
    
    await movie.save();

    res.json(movie);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error, could not update movie' });
  }
};





const getMovieRatings = async (req, res) => {
  try {
    const moviesWithRatings = await Movie.aggregate([
      {
        $lookup: {
          from: 'reviews',
          localField: '_id',
          foreignField: 'movieId',
          as: 'reviews',
        },
      },
      {
        $project: {
          title: 1,
          director: 1,
          releaseYear: 1,
          genre: 1,
          averageRating: { $avg: '$reviews.rating' },
        },
      },
    ]);

    if (moviesWithRatings.length === 0) {
      return res.status(404).json({ message: 'No movies found with ratings' });
    }

    res.status(200).json(moviesWithRatings);
  } catch (error) {
    console.error('Error fetching movies with ratings:', error);
    res.status(500).json({ message: 'Internal server error. Failed to fetch movies with ratings' });
  }
};




module.exports = { addMovie, getMovies, getMovieById, updateMovie, deleteMovie, getMovieReviews, getMovieRatings };
