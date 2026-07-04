import * as floorService from '../services/floorService.js';

export const createFloor = async (req, res) => {
  const floor = await floorService.createFloor(req.body);
  res.status(201).json({ success: true, floor });
};

export const getFloors = async (req, res) => {
  const result = await floorService.getFloors(req.query);
  res.json({ success: true, ...result });
};

export const getFloor = async (req, res) => {
  const floor = await floorService.getFloorById(req.params.id);
  res.json({ success: true, floor });
};

export const updateFloor = async (req, res) => {
  const floor = await floorService.updateFloor(req.params.id, req.body);
  res.json({ success: true, floor });
};

export const deleteFloor = async (req, res) => {
  await floorService.deleteFloor(req.params.id);
  res.json({ success: true, message: 'Floor deleted' });
};
