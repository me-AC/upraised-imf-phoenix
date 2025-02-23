const Gadget = require('../models/Gadget');
const {
	generateCodename,
	generateMissionSuccessProbability,
	generateSelfDestructCode,
} = require('../utils/gadgetUtils');
const { validate: uuidValidate } = require('uuid');


const getAllGadgets = async (req, res) => {
	try {
		const { status } = req.query;
		let gadgets;

		if (status) {
			gadgets = await Gadget.findAll({ where: { status: status } });
		} else {
			gadgets = await Gadget.findAll();
		}

		const gadgetsWithProbability = gadgets.map((gadget) => ({
			...gadget.toJSON(),
			missionSuccessProbability: `${generateMissionSuccessProbability()}%`,
		}));

		res.json(gadgetsWithProbability);
	} catch (error) {
		res.status(500).json({ error: 'Failed to retrieve gadgets' });
	}
};


const createGadget = async (req, res) => {
	try {
		const { name } = req.body;
		if (!name) {
			return res.status(400).json({ error: 'Name is required' });
		}

		const gadget = await Gadget.create({
			name,
			codename: generateCodename(),
		});
		res.status(201).json(gadget);
	} catch (error) {
		res.status(500).json({ error: 'Failed to create gadget' });
	}
};


const updateGadget = async (req, res) => {
	try {
		const { id } = req.params;

		if (!uuidValidate(id)) {
			return res.status(400).json({ error: 'Invalid gadget ID format' });
		}

		const { name, status } = req.body;
		if (!name && !status) {
			return res
				.status(400)
				.json({ error: 'At least one field (name or status) is required' });
		}

		const gadget = await Gadget.findByPk(id);
		if (!gadget) {
			return res.status(404).json({ error: 'Gadget not found' });
		}

		const updateData = {};
		if (name) updateData.name = name;
		if (status) {
			if (
				!['Available', 'Deployed', 'Destroyed', 'Decommissioned'].includes(
					status
				)
			) {
				return res.status(400).json({ error: 'Invalid status value' });
			}
			updateData.status = status;
		}

		await gadget.update(updateData);
		res.status(200).json(gadget);
	} catch (error) {
		res.status(500).json({ error: 'Failed to update gadget' });
	}
};


const deleteGadget = async (req, res) => {
	try {
		const { id } = req.params;

		if (!uuidValidate(id)) {
			return res.status(400).json({ error: 'Invalid gadget ID format' });
		}

		const gadget = await Gadget.findByPk(id);
		if (!gadget) {
			return res.status(404).json({ error: 'Gadget not found' });
		}

		if (gadget.getDataValue('status') == 'Decommisioned') {
			return res.status(400).json({ error: 'Gadget already deleted' });
		}

		await gadget.update({
			status: 'Decommissioned',
			decommissionedAt: new Date(),
		});

		res.json({ message: 'Gadget decommissioned successfully' });
	} catch (error) {
		res.status(500).json({ error: 'Failed to decommission gadget' });
	}
};


const selfDestruct = async (req, res) => {
	try {
		const { id } = req.params;

		if (!uuidValidate(id)) {
			return res.status(400).json({ error: 'Invalid gadget ID format' });
		}

		const gadget = await Gadget.findByPk(id);
		if (!gadget) {
			return res.status(404).json({ error: 'Gadget not found' });
		}

		if (gadget.getDataValue('status') == 'Destroyed') {
			return res.status(400).json({ error: 'Gadget already Destroyed' });
		}

		const confirmationCode = generateSelfDestructCode();
		await gadget.update({ status: 'Destroyed' });

		res.json({
			message: 'Self-destruct sequence initiated',
			confirmationCode,
			gadget,
		});
	} catch (error) {
		res
			.status(500)
			.json({ error: 'Failed to initiate self-destruct sequence' });
	}
};

module.exports = {
	getAllGadgets,
	createGadget,
	updateGadget,
	deleteGadget,
	selfDestruct,
};
