const Destination = require('../models/Destination');

/**
 * @desc    Get all destinations with filters
 * @route   GET /api/destinations
 */
exports.getDestinations = async (req, res) => {
  try {
    const { search, category, state, budget, rating, season, sort, page = 1, limit = 12 } = req.query;

    let query = { status: 'active' };

    // Text search
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { state: { $regex: search, $options: 'i' } }
      ];
    }

    // Filters
    if (category) query.category = category;
    if (state) query.state = state;
    if (season) query.bestSeason = season;
    if (rating) query.rating = { $gte: parseFloat(rating) };
    if (budget) {
      const [min, max] = budget.split('-').map(Number);
      if (min && max) query.budget = { $gte: min, $lte: max };
      else if (min) query.budget = { $gte: min };
    }

    // Sorting
    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { budget: 1 };
    else if (sort === 'price_desc') sortOption = { budget: -1 };
    else if (sort === 'rating') sortOption = { rating: -1 };
    else if (sort === 'name') sortOption = { name: 1 };

    const total = await Destination.countDocuments(query);
    const destinations = await Destination.find(query)
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({
      success: true,
      data: destinations,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get single destination
 * @route   GET /api/destinations/:id
 */
exports.getDestination = async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id)
      .populate('hotels');

    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }

    res.json({ success: true, data: destination });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Create destination (Admin)
 * @route   POST /api/destinations
 */
exports.createDestination = async (req, res) => {
  try {
    const destination = await Destination.create(req.body);
    res.status(201).json({ success: true, data: destination });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update destination (Admin)
 * @route   PUT /api/destinations/:id
 */
exports.updateDestination = async (req, res) => {
  try {
    const destination = await Destination.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }

    res.json({ success: true, data: destination });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete destination (Admin)
 * @route   DELETE /api/destinations/:id
 */
exports.deleteDestination = async (req, res) => {
  try {
    const destination = await Destination.findByIdAndDelete(req.params.id);
    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }
    res.json({ success: true, message: 'Destination deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get destination suggestions for search
 * @route   GET /api/destinations/search/suggestions
 */
exports.getSearchSuggestions = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.json({ success: true, data: [] });

    const destinations = await Destination.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { state: { $regex: q, $options: 'i' } }
      ],
      status: 'active'
    }).select('name state images').limit(5);

    res.json({ success: true, data: destinations });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get all states for filter
 * @route   GET /api/destinations/filters/states
 */
exports.getStates = async (req, res) => {
  try {
    const states = await Destination.distinct('state', { status: 'active' });
    res.json({ success: true, data: states.sort() });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
