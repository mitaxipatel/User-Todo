const express = require("express");
const cors = require("cors")
const { default: mongoose } = require("mongoose");
const bcrypt = require("bcrypt");
const app = express();
const todo = require("./models/todo-model");
const user = require("./models/user-model");
const jwt = require('jsonwebtoken');
const verifyToken = require("./middleware");
const cron = require("node-cron")
const WebSocket = require('ws');

mongoose.connect("mongodb+srv://mitaxipatel:mitaxi123@mitaxipatel.g5sxmyh.mongodb.net", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("Error connecting to MongoDB:", err);
});
app.use(cors());
app.use(express.json({ limit: "50mb" }));


//login
app.post('/', async (req, res) => {
    console.log(req.body)
    let temp = await user.findOne({ email: req.body.email });
    if (temp) {
        let test = await bcrypt.compare(req.body.password, temp.password);
        if (test = true) {
            const token = jwt.sign({ userId: user._id }, 'hgjgjhkjkjvjvhbj', {
                expiresIn: '1h',
            });
            console.log(token)
            return res.send({ message: "Login successful.", token: token })
        } else {
            return res.send("Login Failed.");
        }
    } else {
        return res.send("User not found.");
    }
});

//register
app.post('/adduser', async (req, res) => {
    try {
        let temp = await bcrypt.hash(req.body.password, 10);
        const newTodo = await new user({
            email: req.body.email,
            password: temp
        });
        const savedTodo = await newTodo.save();
        const token = jwt.sign({ userId: user._id }, 'hgjgjhkjkjvjvhbj', {
            expiresIn: '1h',
        });
        console.log(token)
        res.status(201).send(savedTodo);
    } catch (error) {
        console.error("Error saving todo:", error);
        res.status(500).send("Error saving todo");
    }
});

//add todo
app.post('/add', verifyToken, async (req, res) => {
    try {
        console.log(req.body.created_by)
        let temp = await user.findOne({ email: req.body.created_by });
        console.log(temp)
        if (temp) {
            const newTodo = new todo({
                created_by: req.body.created_by,
                task: req.body.task,
                completed: req.body.completed || false 
            })
            const savedTodo = await newTodo.save();
            res.status(201).send(savedTodo);
        } else {
            return res.send("User not found.");
        }
    } catch (error) {
        console.error("Error saving todo:", error);
        res.status(500).send("Error saving todo");
    }
});

//update todo
app.put('/update/:id', verifyToken, async (req, res) => {
    try {
        const { id } = req.params; 
        const { task, completed } = req.body; 

        const updatedTodo = await todo.findByIdAndUpdate(
            id,
            { task, completed }, 
            { new: true, runValidators: true }
        );

        if (!updatedTodo) {
            return res.status(404).send("Todo not found.");
        }

        res.status(200).send(updatedTodo);
    } catch (error) {
        console.error("Error updating todo:", error);
        res.status(500).send("Error updating todo");
    }
});


//get to do
app.post("/get", verifyToken, async (req, res) => {
    if (!req.body.email) return res.send("email id is required.")
    let temp = await todo.find({ created_by: req.body.email }).select('task completed');
    res.send(temp)
})

// delete todo
app.delete('/delete/:id', (req, res) => {
    const taskId = req.params.id;
    todo.findByIdAndDelete(taskId)
        .then(() => res.status(200).json({ message: 'Task deleted successfully' }))
        .catch((error) => res.status(500).json({ error: error.message }));
});


app.listen(4000, () => console.log("running at 4000"));