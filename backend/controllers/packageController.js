const Package = require('../models/Package');

/**
 * @desc    Get all packages with filters
 * @route   GET /api/packages
 */
exports.getPackages = async (req, res) => {
  try {
    const { search, destination, type, price, rating, duration, sort, page = 1, limit = 12 } = req.query;

    let query = { status: 'active' };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    if (destination) query.destination = destination;
    if (type) query.type = type;
    if (rating) query.rating = { $gte: parseFloat(rating) };
    if (price) {
      const [min, max] = price.split('-').map(Number);
      if (min && max) query.price = { $gte: min, $lte: max };
      else if (min) query.price = { $gte: min };
    }
    if (duration) {
      const [min, max] = duration.split('-').map(Number);
      if (min && max) query.durationDays = { $gte: min, $lte: max };
    }

    let sortOption = { createdAt: -1 };
    if (sort === 'price_asc') sortOption = { price: 1 };
    else if (sort === 'price_desc') sortOption = { price: -1 };
    else if (sort === 'rating') sortOption = { rating: -1 };
    else if (sort === 'duration') sortOption = { durationDays: 1 };

    const total = await Package.countDocuments(query);
    const packages = await Package.find(query)
      .populate('destination', 'name state')
      .sort(sortOption)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    res.json({
      success: true,
      data: packages,
      pagination: { total, page: parseInt(page), pages: Math.ceil(total / limit) }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Get single package
 * @route   GET /api/packages/:id
 */
exports.getPackage = async (req, res) => {
  try {
    const pkg = await Package.findById(req.params.id).populate('destination', 'name state');
    if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });
    res.json({ success: true, data: pkg });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Create package (Admin)
 * @route   POST /api/packages
 */
exports.createPackage = async (req, res) => {
  try {
    const pkg = await Package.create(req.body);
    res.status(201).json({ success: true, data: pkg });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Update package (Admin)
 * @route   PUT /api/packages/:id
 */
exports.updatePackage = async (req, res) => {
  try {
    const pkg = await Package.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });
    res.json({ success: true, data: pkg });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Delete package (Admin)
 * @route   DELETE /api/packages/:id
 */
exports.deletePackage = async (req, res) => {
  try {
    const pkg = await Package.findByIdAndDelete(req.params.id);
    if (!pkg) return res.status(404).json({ success: false, message: 'Package not found' });
    res.json({ success: true, message: 'Package deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
