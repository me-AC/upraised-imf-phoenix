const express = require('express');
const router = express.Router();
const {
  getAllGadgets,
  createGadget,
  updateGadget,
  deleteGadget,
  selfDestruct
} = require('../controllers/gadgetController');

// Gadget routes
router.get('/', getAllGadgets);
router.post('/', createGadget);
router.patch('/:id', updateGadget);
router.delete('/:id', deleteGadget);

// Self-destruct route
router.post('/:id/self-destruct', selfDestruct);

module.exports = router; 