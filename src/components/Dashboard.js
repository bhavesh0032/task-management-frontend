import React, { useState, useEffect, useContext, useCallback  } from 'react'
import { useNavigate } from 'react-router-dom'
// import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { DndProvider, useDrag, useDrop } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend';
import axios from '../axios';
import { AppBar, Toolbar, Typography, Button, Container, Grid2, Card, CardContent, TextField, IconButton, Box, Select, MenuItem, Alert } from '@mui/material'
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import  VisibilityIcon  from '@mui/icons-material/Visibility';
import TaskDialog from './TaskDialog';
import { AuthContext } from '../contexts/AuthContext';

const StyledCard = styled(Card)(({ theme }) => ({
    minHeight: 200,
    maxHeight: 500,
    overflowY: 'auto',
  }));
  
  const TaskItem = styled('div')(({ theme }) => ({
    marginBottom: theme.spacing(2),
    padding: theme.spacing(1),
    backgroundColor: '#e3f2fd',
    borderRadius: theme.shape.borderRadius,
    cursor: 'move',
  }));

  const TaskList = ({ status, tasks, onMoveTask, onDeleteTask, onEditTask }) => {
    const [, drop] = useDrop({
      accept: 'TASK',
      drop: (item) => onMoveTask(item.id, status),
    });
  
    return (
      <div ref={drop} style={{ minHeight: '200px' }}>
        {tasks.map((task) => (
          <Task 
            key={task._id} 
            task={task} 
            onDelete={onDeleteTask} 
            onEdit={onEditTask}
          />
        ))}
      </div>
    );
  };



const Task = ({ task, onDelete, onEdit }) => {
    const [{ isDragging }, drag] = useDrag({
      type: 'TASK',
      item: { id: task._id },
      collect: (monitor) => ({
        isDragging: !!monitor.isDragging(),
      }),
    });
  
    return (
      <TaskItem
        ref={drag}
        style={{ opacity: isDragging ? 0.5 : 1 }}
      >
        <Typography variant="body1">{task.title}</Typography>
        <Typography variant="body2" color="text.secondary">
          {task.description}
        </Typography>
        <Typography variant="caption" display="block" sx={{ mt: 1 }}>
          Created at: {new Date(task.createdAt).toLocaleString()}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
          <IconButton size="small" onClick={() => onDelete(task._id)}>
            <DeleteIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => onEdit(task)}>
            <EditIcon fontSize="small" />
          </IconButton>
          <IconButton size="small" onClick={() => onEdit(task)}>
            <VisibilityIcon fontSize="small" />
          </IconButton>
        </Box>
      </TaskItem>
    );
  };
  
  
  function Dashboard() {
    const [tasks, setTasks] = useState([]);
    // const [newTask, setNewTask] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('recent');
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const [dialogMode, setDialogMode] = useState('add');
    const [error, setError] = useState('');
    const { setIsAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();
  

  
    useEffect(() => {
      fetchTasks();
    }, []);
  

    // useEffect(() => {
    //     const token = localStorage.getItem('token');
    //     console.log("Token in Dashboard:", token); // Debug log
    //     fetchTasks();
    //   }, []);

    const fetchTasks = async () => {
    //   try {

    //     const res = await axios.get('/api/tasks');
    //     setTasks(res.data);
    //   } catch (error) {
    //     console.error('Error fetching tasks:', error);
    //     console.log('Error response:', error.response);
    //     if (error.response && error.response.status === 401) {
    //         handleLogout();
    //     } 
    //     // else {
    //     //     setError('Failed to fetch tasks. Please try again.');
    //     //   }
    //   }
    try {
        console.log("Fetching tasks..."); 
        const res = await axios.get('/api/tasks');
        // console.log("Tasks fetched successfully:", res.data); 
        setTasks(res.data);
      } catch (error) {
        // console.error('Error fetching tasks:', error);
        // console.log('Error response:', error.response)
        // console.log('Error request:', error.request); 
        // console.log('Error config:', error.config); 
        if (error.response && error.response.status === 401) {
          console.log("Unauthorized, logging out..."); 
          handleLogout();
        }
      }
    };
  
    const handleAddTask = async () => {
        // e.preventDefault();
        // try {
        //   const res = await axios.post('/api/tasks', { title: newTask, status: 'TODO' });
        //   setTasks([...tasks, res.data]);
        //   setNewTask('');
        // } catch (error) {
        //   console.error('Error adding task:', error);
        //   setError('Failed to add task. Please try again.');
        // }
    setDialogMode('add');
    setSelectedTask(null);
    setOpenDialog(true);

    }

    const handleCreateTask = async (newTask) => {
        try {
          const res = await axios.post('/api/tasks', newTask);
          setTasks([...tasks, res.data]);
          setOpenDialog(false);
          setError('');
        } catch (error) {
          console.error('Error adding task:', error);
          setError('Failed to add task. Please try again.');
        }
      };
    
    
  
    //   const handleDragEnd = useCallback((result) => {
    //     console.log('Drag ended:', result);
    //     if (!result.destination) return;
    
    //     const { source, destination, draggableId } = result;
    //     const updatedTasks = Array.from(tasks);
    //     const [reorderedTask] = updatedTasks.splice(source.index, 1);
    //     updatedTasks.splice(destination.index, 0, { ...reorderedTask, status: destination.droppableId });
    
    //     setTasks(updatedTasks);
    
    //     axios.put(`/api/tasks/${draggableId}`, { status: destination.droppableId })
    //       .catch(error => {
    //         console.error('Error updating task status:', error);
    //         setError('Failed to update task status. Please try again.');
    //         fetchTasks();
    //       });
    //   }, [tasks, setTasks, setError, fetchTasks]);


    const handleMoveTask = useCallback(async (taskId, newStatus) => {
        try {
          const taskToMove = tasks.find(task => task._id === taskId);
          if (taskToMove.status !== newStatus) {
            const res = await axios.put(`/api/tasks/${taskId}`, { ...taskToMove, status: newStatus });
            setTasks(tasks.map(task => task._id === taskId ? res.data : task));
          }
        } catch (error) {
          console.error('Error moving task:', error);
          setError('Failed to move task. Please try again.');
        }
      }, [tasks]);

    
  
    const handleDeleteTask = async (taskId) => {
      try {
        await axios.delete(`/api/tasks/${taskId}`);
        setTasks(tasks.filter(task => task._id !== taskId));
      } catch (error) {
        console.error('Error deleting task:', error);
        setError('Failed to delete task. Please try again.')
      }
    };
  
    const handleEditTask = (task) => {
      setSelectedTask(task);
      setDialogMode('edit');
      setOpenDialog(true);
    };

    // const handleViewTask = (task) => {
    //     setSelectedTask(task);
    //     // setDialogMode('view');
    //     setOpenDialog(true);
    //   };
  
    // const handleCloseDialog = () => {
    //   setOpenDialog(false);
    //   setSelectedTask(null);
    // };
  
    const handleUpdateTask = async (updatedTask) => {
        try {
            const res = await axios.put(`/api/tasks/${updatedTask._id}`, updatedTask);
            setTasks(tasks.map(task => task._id === updatedTask._id ? res.data : task));
            // handleCloseDialog();
            setOpenDialog(false)
            setError('')
          } catch (error) {
            console.error('Error updating task:', error);
            setError('Failed to update task. Please try again.');
          }
      };
  
    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        navigate('/login');
    };

    const filteredTasks = tasks
    .filter(task => task.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => sortBy === 'recent' ? new Date(b.createdAt) - new Date(a.createdAt) : a.title.localeCompare(b.title));

    const tasksByStatus = {
        TODO: filteredTasks.filter(task => task.status === 'TODO'),
        'IN PROGRESS': filteredTasks.filter(task => task.status === 'IN PROGRESS'),
        DONE: filteredTasks.filter(task => task.status === 'DONE')
      };
  
    return (
        <DndProvider backend={HTML5Backend}>
      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              Task Management
            </Typography>
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </Toolbar>
        </AppBar>
        <Container sx={{ mt: 4 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <Button variant="contained" color="primary" onClick={handleAddTask} sx={{ mb: 2 }}>
            Add Task
          </Button>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
            <TextField
              label="Search"
              variant="outlined"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{ width: '70%' }}
            />
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              sx={{ width: '25%' }}
            >
              <MenuItem value="recent">Recent</MenuItem>
              <MenuItem value="title">Title</MenuItem>
            </Select>
          </Box>
          <Grid2 container spacing={3}>
            {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
              <Grid2 item xs={12} md={4} key={status}>
                <StyledCard>
                  <CardContent>
                    <Typography variant="h6" sx={{ mb: 2, bgcolor: 'primary.main', color: 'white', p: 1 }}>
                      {status}
                    </Typography>
                    <TaskList
                      status={status}
                      tasks={statusTasks}
                      onMoveTask={handleMoveTask}
                      onDeleteTask={handleDeleteTask}
                      onEditTask={handleEditTask}
                    />
                  </CardContent>
                </StyledCard>
              </Grid2>
            ))}
          </Grid2>
        </Container>
        <TaskDialog
          open={openDialog}
          onClose={() => setOpenDialog(false)}
          task={selectedTask}
          onSave={dialogMode === 'add' ? handleCreateTask : handleUpdateTask}
          mode={dialogMode}
        />
      </div>
    </DndProvider>
    );
  }
  
  export default Dashboard;


      // <div>
    // <AppBar position="static">
    //   <Toolbar>
    //     <Typography variant="h6" sx={{ flexGrow: 1 }}>
    //       Task Management
    //     </Typography>
    //     <Button color="inherit" onClick={handleLogout}>Logout</Button>
    //   </Toolbar>
    // </AppBar>
    // <Container sx={{ mt: 4 }}>
    //   {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
    //   <Button variant="contained" color="primary" onClick={handleAddTask} sx={{ mb: 2 }}>
    //     Add Task
    //   </Button>
    //   <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
    //     <TextField
    //       label="Search"
    //       variant="outlined"
    //       value={searchTerm}
    //       onChange={(e) => setSearchTerm(e.target.value)}
    //       sx={{ width: '70%' }}
    //     />
    //     <Select
    //       value={sortBy}
    //       onChange={(e) => setSortBy(e.target.value)}
    //       sx={{ width: '25%' }}
    //     >
    //       <MenuItem value="recent">Recent</MenuItem>
    //       <MenuItem value="title">Title</MenuItem>
    //     </Select>
    //   </Box>
    //   <DragDropContext onDragEnd={handleDragEnd}>
    //       <Grid2 container spacing={3}>
    //         {Object.entries(tasksByStatus).map(([status, statusTasks]) => (
    //           <Grid2 item xs={12} md={4} key={status}>
    //             <Card>
    //               <CardContent>
    //                 <Typography variant="h6" sx={{ mb: 2, bgcolor: 'primary.main', color: 'white', p: 1 }}>
    //                   {status}
    //                 </Typography>
    //                 <Droppable droppableId={status} key={status}>
    //                   {(provided, snapshot) => (
    //                     <div
    //                       {...provided.droppableProps}
    //                       ref={provided.innerRef}
    //                       style={{
    //                         minHeight: '100px',
    //                         background: snapshot.isDraggingOver ? 'lightblue' : 'lightgrey',
    //                         padding: 4,
    //                       }}
    //                     >
    //                       {statusTasks.map((task, index) => (
    //                         <Draggable key={task._id} draggableId={task._id} index={index}>
    //                           {(provided, snapshot) => (
    //                             <TaskItem
    //                               ref={provided.innerRef}
    //                               {...provided.draggableProps}
    //                               {...provided.dragHandleProps}
    //                               style={{
    //                                 ...provided.draggableProps.style,
    //                                 background: snapshot.isDragging ? 'lightgreen' : '#e3f2fd',
    //                               }}
    //                             >
    //                               <Typography variant="body1">{task.title}</Typography>
    //                               <Typography variant="body2" color="text.secondary">
    //                                 {task.description}
    //                               </Typography>
    //                               <Typography variant="caption" display="block" sx={{ mt: 1 }}>
    //                                 Created at: {new Date(task.createdAt).toLocaleString()}
    //                               </Typography>
    //                               <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
    //                                 <IconButton size="small" onClick={() => handleDeleteTask(task._id)}>
    //                                   <DeleteIcon fontSize="small" />
    //                                 </IconButton>
    //                                 <IconButton size="small" onClick={() => handleEditTask(task)}>
    //                                   <EditIcon fontSize="small" />
    //                                 </IconButton>
    //                                 <IconButton size="small" onClick={() => handleEditTask(task)}>
    //                                   <VisibilityIcon fontSize="small" />
    //                                 </IconButton>
    //                               </Box>
    //                             </TaskItem>
    //                           )}
    //                         </Draggable>
    //                       ))}
    //                       {provided.placeholder}
    //                     </div>
    //                   )}
    //                 </Droppable>
    //               </CardContent>
    //             </Card>
    //           </Grid2>
    //         ))}
    //       </Grid2>
    //     </DragDropContext>
    //   </Container>
    //   <TaskDialog
    //     open={openDialog}
    //     onClose={() => setOpenDialog(false)}
    //     task={selectedTask}
    //     onSave={dialogMode === 'add' ? handleCreateTask : handleUpdateTask}
    //     mode={dialogMode}
    //   />
    // </div>

      //     <div>
    //     <AppBar position="static">
    //       <Toolbar>
    //         <Typography variant="h6" sx={{ flexGrow: 1 }}>
    //           Task Management
    //         </Typography>
    //         <Button color="inherit" onClick={handleLogout}>Logout</Button>
    //       </Toolbar>
    //     </AppBar>
    //     <Container sx={{ paddingTop: 4, paddingBottom: 4 }}>
    //       {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
    //       <form onSubmit={handleAddTask}>
    //         <TextField
    //           fullWidth
    //           variant="outlined"
    //           placeholder="Add a new task"
    //           value={newTask}
    //           onChange={(e) => setNewTask(e.target.value)}
    //         />
    //       </form>
    //       <DragDropContext onDragEnd={handleDragEnd}>
    //         <Grid container spacing={3}>
    //           {['TODO', 'IN PROGRESS', 'DONE'].map((status) => (
    //             <Grid item xs={12} md={4} key={status}>
    //               <Typography variant="h6">{status}</Typography>
    //               <Droppable droppableId={status}>
    //                 {(provided) => (
    //                   <StyledCard ref={provided.innerRef} {...provided.droppableProps}>
    //                     <CardContent>
    //                       {tasks.filter(task => task.status === status).map((task, index) => (
    //                         <Draggable key={task._id} draggableId={task._id} index={index}>
    //                           {(provided) => (
    //                             <TaskItem
    //                               ref={provided.innerRef}
    //                               {...provided.draggableProps}
    //                               {...provided.dragHandleProps}
    //                             >
    //                               <Typography variant="body1">{task.title}</Typography>
    //                               <IconButton size="small" onClick={() => handleEditTask(task)}>
    //                                 <EditIcon fontSize="small" />
    //                               </IconButton>
    //                               <IconButton size="small" onClick={() => handleDeleteTask(task._id)}>
    //                                 <DeleteIcon fontSize="small" />
    //                               </IconButton>
    //                             </TaskItem>
    //                           )}
    //                         </Draggable>
    //                       ))}
    //                       {provided.placeholder}
    //                     </CardContent>
    //                   </StyledCard>
    //                 )}
    //               </Droppable>
    //             </Grid>
    //           ))}
    //         </Grid>
    //       </DragDropContext>
    //     </Container>
    //     <TaskDialog
    //       open={openDialog}
    //       onClose={handleCloseDialog}
    //       task={selectedTask}
    //       onUpdate={handleUpdateTask}
    //     />
    //   </div>