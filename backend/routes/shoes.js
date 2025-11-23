import express from 'express';
import Shoe from '../models/Shoe.js';
import { auth, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all shoes
router.get('/', auth, async (req, res) => {
  try {
    const shoes = await Shoe.find({ isActive: true }).sort({ name: 1 });
    res.json(shoes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single shoe
router.get('/:id', auth, async (req, res) => {
  try {
    const shoe = await Shoe.findById(req.params.id);
    if (!shoe) {
      return res.status(404).json({ message: 'Shoe not found' });
    }
    res.json(shoe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create shoe (admin only)
router.post('/', [auth, authorize('admin')], async (req, res) => {
  try {
    const shoe = new Shoe(req.body);
    await shoe.save();
    res.status(201).json(shoe);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;