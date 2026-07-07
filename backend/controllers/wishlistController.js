const Wishlist = require('../models/Wishlist');

/**
 * @desc    Get user wishlist
 * @route   GET /api/wishlist
 */
exports.getWishlist = async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id })
      .populate('items.referenceId');

    if (!wishlist) {
      wishlist = { items: [] };
    }

    res.json({ success: true, data: wishlist });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Add item to wishlist
 * @route   POST /api/wishlist
 */
exports.addToWishlist = async (req, res) => {
  try {
    const { type, referenceId } = req.body;

    let wishlist = await Wishlist.findOne({ user: req.user._id });

    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, items: [] });
    }

    // Check if already in wishlist
    const exists = wishlist.items.find(
      item => item.type === type && item.referenceId.toString() === referenceId
    );

    if (exists) {
      return res.status(400).json({ success: false, message: 'Already in wishlist' });
    }

    wishlist.items.push({ type, referenceId });
    await wishlist.save();

    const populated = await Wishlist.findById(wishlist._id).populate('items.referenceId');
    res.json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Remove item from wishlist
 * @route   DELETE /api/wishlist/:type/:referenceId
 */
exports.removeFromWishlist = async (req, res) => {
  try {
    const { type, referenceId } = req.params;

    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) return res.status(404).json({ success: false, message: 'Wishlist not found' });

    wishlist.items = wishlist.items.filter(
      item => !(item.type === type && item.referenceId.toString() === referenceId)
    );
    await wishlist.save();

    const populated = await Wishlist.findById(wishlist._id).populate('items.referenceId');
    res.json({ success: true, data: populated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc    Check if item is in wishlist
 * @route   GET /api/wishlist/check/:type/:referenceId
 */
exports.checkWishlist = async (req, res) => {
  try {
    const { type, referenceId } = req.params;
    const wishlist = await Wishlist.findOne({ user: req.user._id });

    const isInWishlist = wishlist?.items.some(
      item => item.type === type && item.referenceId.toString() === referenceId
    ) || false;

    res.json({ success: true, data: { isInWishlist } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
