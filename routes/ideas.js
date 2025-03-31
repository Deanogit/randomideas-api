const express = require('express');
const router = express.Router();
const Idea = require('../models/Idea');

// Get all ideas
router.get('/', async (req, res) => {
  try {
    const ideas = await Idea.find();
    res.json({ success: true, data: ideas });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: 'Something went wrong' });
  }
});

// Get ideas with id
router.get('/:id', async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);
    res.json({ success: true, data: idea });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: 'Something went wrong' });
  }
});

// Add an idea
router.post('/', async (req, res) => {
  const idea = new Idea({
    text: req.body.text,
    tag: req.body.tag,
    username: req.body.username,
  });

  try {
    const savedIdea = await idea.save();
    res.json({ success: true, data: savedIdea });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: 'Something went wrong' });
  }
});

// Update idea
router.put('/:id', async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);

    if (idea.username === req.body.username) {
      const updateIdea = await Idea.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            text: req.body.text,
            tag: req.body.tag,
          },
        },
        {
          new: true,
        }
      );
      return res.json({ success: true, data: updateIdea });
    }

    // No match
    res
      .status(403)
      .json({
        success: false,
        error: 'You are not authorized to update this resource',
      });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, error: 'Something went wrong' });
  }

  //   idea.text = req.body.text || idea.text;
  //   idea.tag = req.body.tag || idea.tag;

  //   res.json({ success: true, data: idea });
});

// Delete idea
router.delete('/:id', async (req, res) => {
  try {
    const idea = await Idea.findById(req.params.id);

    // Match usernames
    if (idea.username === req.body.username) {
      await Idea.findByIdAndDelete(req.params.id);
      return res.json({ success: true, data: {} });
    }
    // Usernames do not match
    res.status(403).json({
      success: false,
      error: 'You are not authorised to delete this resource',
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, error: 'Something went wrong' });
  }

  //   const idea = ideas.find((idea) => idea.id === +req.params.id);

  //   if (!idea) {
  //     return res
  //       .status(404)
  //       .json({ success: false, error: 'Resource not found' });
  //   }

  //   const index = ideas.indexOf(idea);
  //   ideas.splice(index, 1);

  //   res.json({ success: true, data: {} });
});

module.exports = router;
