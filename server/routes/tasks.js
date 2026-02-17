const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const User = require('../models/User');
const { protect } = require('../middleware/authMiddleware');
const { updateGamification } = require('../utils/gamification');

// @route   GET /api/tasks
// @desc    Get all tasks for a user
// @access  Private
router.get('/', protect, async (req, res) => {
    try {
        const { type, status } = req.query;
        let query = { userId: req.user._id };

        if (type) query.type = type;
        if (status) query.status = status;
        // If no status provided, maybe exclude archived? 
        // For now, return all or specific filter.
        // If status is NOT provided, typically we want 'working' or 'unfinished' or 'done', but creating explicit query is better.

        const tasks = await Task.find(query).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/tasks
// @desc    Create a new task
// @access  Private
router.post('/', protect, async (req, res) => {
    const { title, description, type, priority, endDate } = req.body;

    // Validate endDate based on type? 
    // For now trust frontend or user input.

    try {
        const task = new Task({
            userId: req.user._id,
            title,
            description,
            type,
            priority,
            endDate
        });

        const createdTask = await Task.create(task);
        res.status(201).json(createdTask);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PUT /api/tasks/:id
// @desc    Update a task
// @access  Private
router.put('/:id', protect, async (req, res) => {
    const { title, description, type, priority, endDate } = req.body;

    try {
        const task = await Task.findById(req.params.id);

        if (task) {
            // Ensure task belongs to user
            if (task.userId.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized' });
            }

            task.title = title || task.title;
            task.description = description || task.description;
            task.type = type || task.type;
            task.priority = priority || task.priority;
            task.endDate = endDate || task.endDate;

            const updatedTask = await task.save();
            res.json(updatedTask);
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   DELETE /api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', protect, async (req, res) => {
    try {
        // Use findOneAndDelete to respect ownership in query or check after find
        const task = await Task.findById(req.params.id);

        if (task) {
            if (task.userId.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized' });
            }

            await task.deleteOne();
            res.json({ message: 'Task removed' });
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PATCH /api/tasks/:id/complete
// @desc    Complete a task and award points
// @access  Private
router.patch('/:id/complete', protect, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        const user = await User.findById(req.user._id);

        if (task && user) {
            if (task.userId.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized' });
            }

            if (task.status === 'done') {
                return res.status(400).json({ message: 'Task already completed' });
            }

            task.status = 'done';
            task.completedAt = Date.now();

            // Calculate and award points
            const updatedUser = await updateGamification(user, task);
            task.pointsAwarded = updatedUser.xp - (user.xp - (require('../utils/gamification').basePoints[task.type] || 0)); // Approximately or just use basePoints logic
            // Actually updateGamification modifies user object in place.
            // Let's rely on the util to handle the user update logic correctly.

            // Re-saving task first
            await task.save();
            // Saving user
            await updatedUser.save();

            res.json({
                task,
                user: {
                    level: updatedUser.level,
                    xp: updatedUser.xp,
                    totalPoints: updatedUser.totalPoints,
                    streak: updatedUser.streak
                }
            });
        } else {
            res.status(404).json({ message: 'Task or User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route   PATCH /api/tasks/:id/archive
// @desc    Archive a task
// @access  Private
router.patch('/:id/archive', protect, async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (task) {
            if (task.userId.toString() !== req.user._id.toString()) {
                return res.status(401).json({ message: 'Not authorized' });
            }

            task.status = 'archived';
            await task.save();
            res.json(task);
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
