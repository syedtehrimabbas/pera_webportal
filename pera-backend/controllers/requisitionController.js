const Requisition = require('../models/Requisition');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// @desc    Create a new requisition
// @route   POST /api/requisitions
// @access  Private
const createRequisition = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      operationType,
      description,
      urgency,
      sensitivity,
      location,
      startTime,
      endTime,
      assignedTeam,
      assignedVehicles,
      assignedWeapons,
    } = req.body;

    // Create new requisition
    const requisition = new Requisition({
      requestedBy: req.user._id,
      operationType,
      description,
      urgency,
      sensitivity,
      location,
      startTime,
      endTime,
      assignedTeam,
      assignedVehicles,
      assignedWeapons,
      status: 'submitted',
    });

    await requisition.save();

    // Populate the response with user details
    await requisition.populate('requestedBy', 'name email employeeId');
    await requisition.populate('assignedTeam', 'name email employeeId designation');
    await requisition.populate('assignedVehicles', 'registrationNumber vehicleType make model');
    await requisition.populate('assignedWeapons', 'weaponType serialNumber');

    res.status(201).json({
      success: true,
      data: requisition,
    });
  } catch (error) {
    console.error('Create requisition error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all requisitions
// @route   GET /api/requisitions
// @access  Private
const getRequisitions = async (req, res) => {
  try {
    const { status, requestedBy, startDate, endDate } = req.query;
    const query = {};

    // Filter by status if provided
    if (status) {
      query.status = status;
    }

    // Filter by requester if provided
    if (requestedBy) {
      query.requestedBy = requestedBy;
    }

    // Filter by date range if provided
    if (startDate && endDate) {
      query.startTime = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    // If user is not admin, only show their requisitions or those they're assigned to
    if (req.user.designation !== 'admin' && req.user.designation !== 'sdo') {
      query.$or = [
        { requestedBy: req.user._id },
        { assignedTeam: { $in: [req.user._id] } },
      ];
    }

    const requisitions = await Requisition.find(query)
      .populate('requestedBy', 'name email employeeId')
      .populate('assignedTeam', 'name email employeeId designation')
      .populate('assignedVehicles', 'registrationNumber vehicleType')
      .populate('assignedWeapons', 'weaponType serialNumber')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: requisitions.length,
      data: requisitions,
    });
  } catch (error) {
    console.error('Get requisitions error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single requisition
// @route   GET /api/requisitions/:id
// @access  Private
const getRequisition = async (req, res) => {
  try {
    const requisition = await Requisition.findById(req.params.id)
      .populate('requestedBy', 'name email employeeId')
      .populate('assignedTeam', 'name email employeeId designation')
      .populate('assignedVehicles', 'registrationNumber vehicleType make model')
      .populate('assignedWeapons', 'weaponType serialNumber')
      .populate('completedBy', 'name email employeeId');

    if (!requisition) {
      return res.status(404).json({ message: 'Requisition not found' });
    }

    // Check if user has permission to view this requisition
    if (
      req.user.designation !== 'admin' && 
      req.user.designation !== 'sdo' &&
      !requisition.assignedTeam.some(member => member._id.toString() === req.user._id.toString()) &&
      requisition.requestedBy._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ 
        message: 'Not authorized to view this requisition' 
      });
    }

    res.json({
      success: true,
      data: requisition,
    });
  } catch (error) {
    console.error('Get requisition error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Update requisition status
// @route   PUT /api/requisitions/:id/status
// @access  Private
const updateRequisitionStatus = async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const validStatuses = ['sdo_approved', 'in_progress', 'completed', 'rejected', 'cancelled'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const requisition = await Requisition.findById(req.params.id);
    if (!requisition) {
      return res.status(404).json({ message: 'Requisition not found' });
    }

    // Check permissions based on status update
    if (status === 'sdo_approved' && req.user.designation !== 'sdo' && req.user.designation !== 'admin') {
      return res.status(403).json({ 
        message: 'Only SDO or Admin can approve requisitions' 
      });
    }

    if (status === 'completed' && !requisition.assignedTeam.includes(req.user._id)) {
      return res.status(403).json({ 
        message: 'Only assigned team members can mark as completed' 
      });
    }

    // Update status and add remarks if provided
    requisition.status = status;
    
    if (status === 'sdo_approved' || status === 'rejected') {
      requisition.sdoRemarks = remarks || '';
    }

    if (status === 'completed') {
      requisition.completedAt = Date.now();
      requisition.completedBy = req.user._id;
      requisition.completionReport = req.body.completionReport || '';
      
      // Handle file uploads if any
      if (req.files && req.files.length > 0) {
        const attachments = req.files.map(file => ({
          filename: file.filename,
          path: file.path,
        }));
        requisition.attachments = [...requisition.attachments, ...attachments];
      }
    }

    await requisition.save();

    // Populate the response
    await requisition.populate('requestedBy', 'name email employeeId');
    await requisition.populate('assignedTeam', 'name email employeeId designation');
    await requisition.populate('assignedVehicles', 'registrationNumber vehicleType');
    await requisition.populate('assignedWeapons', 'weaponType serialNumber');
    await requisition.populate('completedBy', 'name email employeeId');

    res.json({
      success: true,
      data: requisition,
    });
  } catch (error) {
    console.error('Update requisition status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Delete a requisition
// @route   DELETE /api/requisitions/:id
// @access  Private (Admin only)
const deleteRequisition = async (req, res) => {
  try {
    const requisition = await Requisition.findById(req.params.id);
    
    if (!requisition) {
      return res.status(404).json({ message: 'Requisition not found' });
    }

    // Only admin or the requester can delete (if status is draft or submitted)
    if (
      req.user.designation !== 'admin' && 
      (requisition.requestedBy.toString() !== req.user._id.toString() || 
       !['draft', 'submitted'].includes(requisition.status))
    ) {
      return res.status(403).json({ 
        message: 'Not authorized to delete this requisition' 
      });
    }

    await requisition.remove();

    res.json({
      success: true,
      message: 'Requisition deleted successfully',
    });
  } catch (error) {
    console.error('Delete requisition error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createRequisition,
  getRequisitions,
  getRequisition,
  updateRequisitionStatus,
  deleteRequisition,
};
