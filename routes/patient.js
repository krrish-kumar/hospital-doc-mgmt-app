const express = require('express');
const router = express.Router();
const multer = require('multer');
const { body, validationResult } = require('express-validator');
const { authenticateToken, requireAdmin } = require('../middleware/auth');
const { compressImage } = require('../services/imageService');
const path = require('path');
const fs = require('fs');

// Setup Multer for image uploads
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit per file
});

// Temporary in-memory store for patients for demonstration purposes.
let patients = [];

// Add New Patient route
router.post('/add', authenticateToken, upload.array('documents', 5), [
  body('patientName').notEmpty().withMessage('Patient Name is required'),
  body('dateOfAdmission').isISO8601().withMessage('Invalid Date of Admission'),
  body('dateOfDischarge').optional({ checkFalsy: true }).isISO8601().withMessage('Invalid Date of Discharge'),
  body('patientAddress').notEmpty().withMessage('Address is required'),
  body('city').notEmpty().withMessage('City is required')
], async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()){
    return res.status(400).json({ errors: errors.array() });
  }

  // Validate file count
  if(req.files && req.files.length > 5) {
    return res.status(400).json({ message: 'Maximum 5 images allowed' });
  }
  
  // Compress images and collect paths
  const compressedImages = [];
  try {
    for (let file of req.files) {
      // Compress all valid images; allowed common image types check can be added using file.mimetype.
      const outputPath = await compressImage(file.path, 'compressed/');
      // Remove original file to save space (optional)
      fs.unlinkSync(file.path);
      compressedImages.push(outputPath);
    }
  } catch (error) {
    return res.status(500).json({ message: 'Error processing images', error: error.message });
  }

  // Create a new patient record; here we push to an in-memory array.
  const newPatient = {
    id: patients.length + 1,
    hospital: req.user.hospital, // enforce hospital isolation
    patientName: req.body.patientName,
    dateOfAdmission: req.body.dateOfAdmission,
    dateOfDischarge: req.body.dateOfDischarge,
    patientAddress: req.body.patientAddress,
    city: req.body.city,
    documents: compressedImages
  };
  patients.push(newPatient);
  res.json({ message: 'Patient added successfully', patient: newPatient });
});

// Search Patients route
router.get('/search', authenticateToken, (req, res) => {
  // Accept query parameters to search any field.
  const query = req.query; // e.g., ?patientName=John&city=NewYork
  let result = patients.filter(patient => patient.hospital.toLowerCase() === req.user.hospital.toLowerCase());

  // Filter based on query fields
  Object.keys(query).forEach(key => {
    result = result.filter(patient => {
      return patient[key] && patient[key].toLowerCase().includes(query[key].toLowerCase());
    });
  });
  res.json({ patients: result });
});

// Edit/Delete document - admin only
router.delete('/:patientId/documents', authenticateToken, requireAdmin, (req, res) => {
  const patientId = parseInt(req.params.patientId, 10);
  const { documentPath } = req.body; // Path of the document to delete
  const patient = patients.find(p => p.id === patientId && p.hospital.toLowerCase() === req.user.hospital.toLowerCase());
  if (!patient) return res.status(404).json({ message: 'Patient not found' });
  
  // Remove document if exists
  const docIndex = patient.documents.findIndex(doc => doc === documentPath);
  if (docIndex === -1) return res.status(404).json({ message: 'Document not found' });
  
  // Delete the file from disk
  try {
    fs.unlinkSync(documentPath);
  } catch (error) {
    console.warn('Error deleting file:', error);
  }
  
  // Remove from the patient record
  patient.documents.splice(docIndex, 1);
  res.json({ message: 'Document deleted', patient });
});

module.exports = router;