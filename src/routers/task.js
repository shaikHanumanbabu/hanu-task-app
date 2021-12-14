const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()
// CREATE TASK START HERE

router.post('/tasks', auth, async (req, res) => {
    // const task = new Task(req.body)
    const task = new Task({
        ...req.body,
        owner : req.user._id
    })
    debugger
    try {
        const t = await task.save()
        res.status(201).send(t)

    } catch (error) {
        console.log(error);
        res.status(400).send(error)
        
    }
    
})

// READ ALL TASKS

// GET /TASKS?COMPLETED=FALSE
// GET /TASKS?LIMIT=10SKIP=0
// GET /TASKS?SORTBY = 
router.get('/tasks', auth,  async (req, res) => {
    const match = {}
    const sort = {}
    if(req.query.completed) {
        match.completed = req.query.completed === 'true'
    }
    if(req.query.sortBy) {
        const parts = req.query.sortBy.split(':')
        sort[parts[0]] = parts[1] === 'desc' ? -1 : 1 ;
    }
    try {
        // const tasks = await Task.find({})
        let tasks = await req.user.populate({
            path : 'tasks',
            match,
            options : {
                limit:parseInt(req.query.limit),
                skip : parseInt(req.query.skip),
                sort 
            }
        }).execPopulate()
        tasks = tasks.tasks
        // const tasks = await Task.find({owner : req.user._id})
        res.status(200).send(tasks)

    } catch (error) {
        res.status(400).send(error)
        
    }
    
})

// READ SINGLE TASK

router.get('/tasks/:id', auth, async (req, res) => {
    const _id = req.params.id;
    try {
        // const user = await Task.findById(_id)
        const task = await Task.findOne({ _id: _id, owner : req.user._id})
        if(!task) {
            return res.status(404).send()
        }
        res.status(200).send(task)
    } catch (e) {
        res.status(400).send(e)
        
    }
    
})

//  UPDATE TASK START HERE

router.patch('/tasks/:id', auth,  async (req, res) => {
    const _id = req.params.id;
    const updates = Object.keys(req.body)

    try {
        const task = await Task.findOne({_id:_id, owner : req.user._id})
        if(!task) {
            return res.status(404).send()
        }
        updates.forEach((update) => task[update] = req.body[update])
        await task.save()

        // const task = await Task.findByIdAndUpdate(req.params.id, req.body, {new : true, runValidators: true})
        
        res.send(task)
    } catch (error) {
       return res.status(500).send(error)
        
    }
    
})

//  DELETE TASK 

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({_id:req.params.id, owner : req.user._id})
        if(!task) {
            return res.status(404).send()
        }
        res.send(task)
    } catch (error) {
       return res.status(500).send(error)
        
    }
})

module.exports = router