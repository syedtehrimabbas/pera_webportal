const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const {
  createRequisition,
  getRequisitions,
  getRequisition,
  updateRequisitionStatus,
  deleteRequisition,
} = require('../controllers/requisitionController');

// Apply protect middleware to all routes
router.use(protect);

// Routes
router
  .route('/')
  .get(getRequisitions)
  .post(
    [
      check('operationType', 'Operation type is required').not().isEmpty(),
      check('description', 'Description is required').not().isEmpty(),
      check('location', 'Location is required').not().isEmpty(),
      check('startTime', 'Start time is required').not().isEmpty(),
    ],
    createRequisition
  );

router
  .route('/:id')
  .get(getRequisition)
  .delete(deleteRequisition);

router
  .route('/:id/status')
  .put(
    [
      check('status', 'Status is required').not().isEmpty(),
    ],
    updateRequisitionStatus
  );

module.exports = router;
