import * as sectionService from '../services/sectionService.js';

export const createSection = async (req, res) => {
  const section = await sectionService.createSection(req.body);
  res.status(201).json({ success: true, section });
};

export const getSections = async (req, res) => {
  const result = await sectionService.getSections(req.query);
  res.json({ success: true, ...result });
};

export const getSection = async (req, res) => {
  const section = await sectionService.getSectionById(req.params.id);
  res.json({ success: true, section });
};

export const updateSection = async (req, res) => {
  const section = await sectionService.updateSection(req.params.id, req.body);
  res.json({ success: true, section });
};

export const deleteSection = async (req, res) => {
  await sectionService.deleteSection(req.params.id);
  res.json({ success: true, message: 'Section deleted' });
};
