const express = require('express');
const router = express.Router();
const {
	getAllGadgets,
	createGadget,
	updateGadget,
	deleteGadget,
	selfDestruct,
} = require('../controllers/gadgetController');

router.get('/', getAllGadgets);
router.post('/', createGadget);
router.patch('/:id', updateGadget);
router.delete('/:id', deleteGadget);

router.post('/:id/self-destruct', selfDestruct);

module.exports = router;
