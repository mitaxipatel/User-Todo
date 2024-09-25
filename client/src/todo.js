import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './todo.css';

const Todo = () => {
    const [email, setEmail] = useState("");
    const [data, setData] = useState([]);
    const [filter, setFilter] = useState("all"); 
    const navigate = useNavigate();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = () => {
        axios.post(
            'http://localhost:4000/get',
            { email: localStorage.getItem("email") },
            {
                headers: {
                    'Authorization': localStorage.getItem("token"),
                    'Content-Type': 'application/json'
                }
            }
        )
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    const addTask = async () => {
        try {
            const response = await axios.post('http://localhost:4000/add', { task: email, created_by: localStorage.getItem("email"), completed: false }, {
                headers: {
                    'Authorization': localStorage.getItem("token"),
                    'Content-Type': 'application/json'
                }
            });
            console.log(response.data);
            await fetchData();
            setEmail(""); 
            console.log("Input cleared");
        } catch (error) {
            console.log(error.message);
        }
    };

    const updateStatus = async (id, currentStatus) => {
        try {
            const response = await axios.put(`http://localhost:4000/update/${id}`, {
                completed: !currentStatus // Toggle the completed status
            }, {
                headers: {
                    'Authorization': localStorage.getItem("token"),
                    'Content-Type': 'application/json'
                }
            });
            console.log(response.data);
            await fetchData(); 
        } catch (error) {
            console.log(error.message);
        }
    };

    const deleteTask = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:4000/delete/${id}`, {
                headers: {
                    'Authorization': localStorage.getItem("token"),
                    'Content-Type': 'application/json'
                }
            });
            console.log(response.data);
            await fetchData(); // Refresh the data after deleting
        } catch (error) {
            console.log(error.message);
        }
    };

    const filterTasks = (task) => {
        if (filter === "completed") {
            return task.completed;
        } else if (filter === "incomplete") {
            return !task.completed;
        }
        return true; 
    };

    const logout = () => {
        navigate("/");
        localStorage.removeItem("token");
        localStorage.removeItem("email");
    };

    return (
        <div className="todo-container">
            <h2>To-Do List</h2>
            <div className="add-task">
                <input name="email" placeholder="Enter task" value={email} onChange={(e) => setEmail(e.target.value)} />
                <button onClick={addTask}>Add Task</button>
                <button onClick={logout}>Logout</button>
            </div>
            <div className="filter-buttons">
                <button onClick={() => setFilter("all")}>All</button>
                <button onClick={() => setFilter("completed")}>Completed</button>
                <button onClick={() => setFilter("incomplete")}>Incomplete</button>
            </div>
            <table className="todo-table">
                <thead>
                    <tr>
                        <th>Index</th>
                        <th>Task</th>
                        <th>Completed</th>
                        <th>Actions</th> 
                    </tr>
                </thead>
                <tbody>
                    {data.filter(filterTasks).map((item, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{item.task}</td>
                            <td>{item.completed ? 'Yes' : 'No'}</td> 
                            <td>
                                <button onClick={() => updateStatus(item._id, item.completed)}>
                                    {item.completed ? 'Mark Incomplete' : 'Mark Complete'} 
                                </button>
                                <button onClick={() => deleteTask(item._id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Todo;
