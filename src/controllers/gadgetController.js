const Gadget = require('../models/Gadget');
const { 
  generateCodename, 
  generateMissionSuccessProbability, 
  generateSelfDestructCode 
} = require('../utils/gadgetUtils');
const { validate: uuidValidate } = require('uuid');

// Get all gadgets
const getAllGadgets = async (req, res) => {
  try {
    const gadgets = await Gadget.findAll();
    const gadgetsWithProbability = gadgets.map(gadget => ({
      ...gadget.toJSON(),
      missionSuccessProbability: `${generateMissionSuccessProbability()}%`
    }));
    res.json(gadgetsWithProbability);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve gadgets' });
  }
};

// Add a new gadget
const createGadget = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Name is required' });
    }

    const gadget = await Gadget.create({
      name,
      codename: generateCodename()
    });
    res.status(201).json(gadget);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create gadget' });
  }
};

// Update a gadget
const updateGadget = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate UUID format
    if (!uuidValidate(id)) {
      return res.status(400).json({ error: 'Invalid gadget ID format' });
    }

    const { name, status } = req.body;
    if (!name && !status) {
      return res.status(400).json({ error: 'At least one field (name or status) is required' });
    }

    const gadget = await Gadget.findByPk(id);
    if (!gadget) {
      return res.status(404).json({ error: 'Gadget not found' });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (status) {
      if (!['Available', 'Deployed', 'Destroyed', 'Decommissioned'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status value' });
      }
      updateData.status = status;
    }

    await gadget.update(updateData);
    res.json(gadget);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update gadget' });
  }
};

// Delete (decommission) a gadget
const deleteGadget = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate UUID format
    if (!uuidValidate(id)) {
      return res.status(400).json({ error: 'Invalid gadget ID format' });
    }

    const gadget = await Gadget.findByPk(id);
    if (!gadget) {
      return res.status(404).json({ error: 'Gadget not found' });
    }

    await gadget.update({
      status: 'Decommissioned',
      decommissionedAt: new Date()
    });

    res.json({ message: 'Gadget decommissioned successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to decommission gadget' });
  }
};

// Trigger self-destruct sequence
const selfDestruct = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate UUID format
    if (!uuidValidate(id)) {
      return res.status(400).json({ error: 'Invalid gadget ID format' });
    }

    const gadget = await Gadget.findByPk(id);
    if (!gadget) {
      return res.status(404).json({ error: 'Gadget not found' });
    }

    const confirmationCode = generateSelfDestructCode();
    await gadget.update({ status: 'Destroyed' });

    res.json({
      message: 'Self-destruct sequence initiated',
      confirmationCode,
      gadget
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to initiate self-destruct sequence' });
  }
};

module.exports = {
  getAllGadgets,
  createGadget,
  updateGadget,
  deleteGadget,
  selfDestruct
}; 