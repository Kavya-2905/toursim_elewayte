const Hotel = require('../models/Hotel');

/**
 * @desc    Get all hotels with filters
 * @route   GET /api/hotels
 */
exports.getHotels = async (req, res) => {
  try {
    const { search, destination, price, rating, amenities, sort, page = 1, limit = 12 } = req.query;

    let query = { status: 'active' };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (destination) query.destination = destination;
    if (rating) query.rating = { $gte: parseFloat(rating) };
    if (price) {
      const [min, max] = price.split('-').map(Number);
      if (min && max) query.price = { $gte: min, $lte: max };
      else if (min) query.price = { $gte: min };
    }
    if (amenities) {
      const amenityList = amenities.split(',');
      query.amenities = { $all: amenityList };
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'rating') sortOption = { rating: -1 };

    const total = await Hotel.countDocuments(query);
    const hotels = await Hotel.find(query)
      .populate('destination', 'name state')
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({
      success: true,
      data: hotels,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get single hotel
 * @route   GET /api/hotels/:id
 */
exports.getHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id).populate('destination', 'name state');
    if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found' });
    res.json({ success: true, data: hotel });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Create hotel (Admin)
 * @route   POST /api/hotels
 */
exports.createHotel = async (req, res) => {
  try {
    const hotel = await Hotel.create(req.body);
    res.status(201).json({ success: true, data: hotel });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update hotel (Admin)
 * @route   PUT /api/hotels/:id
 */
exports.updateHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found' });
    res.json({ success: true, data: hotel });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete hotel (Admin)
 * @route   DELETE /api/hotels/:id
 */
exports.deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);
    if (!hotel) return res.status(404).json({ success: false, message: 'Hotel not found' });
    res.json({ success: true, message: 'Hotel deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
