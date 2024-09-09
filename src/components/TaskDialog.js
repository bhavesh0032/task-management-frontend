import React, { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Typography } from '@mui/material'

function TaskDialog({ open, onClose, task, onUpdate, onSave , mode }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
//   const [status, setStatus] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
    //   setStatus(task.status);
    }else {
        setTitle('');
        setDescription('');
      }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // onUpdate({ ...task, title, description });
    onSave({ title, description });

  };

  return (
//     <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
//     <DialogTitle>
//       {mode === 'add' ? 'Add Task' : mode === 'edit' ? 'Edit Task' : 'Task Details'}
//     </DialogTitle>
//     <form onSubmit={handleSubmit}>
//       <DialogContent>
//         {mode === 'view' ? (
//           <>
//             <Typography variant="h6">{title}</Typography>
//             <Typography variant="body1">{description}</Typography>
//             <Typography variant="caption" display="block">
//               Created at: {task && new Date(task.createdAt).toLocaleString()}
//             </Typography>
//           </>
//         ) : (
//           <>
//             <TextField
//               autoFocus
//               margin="dense"
//               label="Title"
//               type="text"
//               fullWidth
//               value={title}
//               onChange={(e) => setTitle(e.target.value)}
//               required
//               disabled={mode === 'view'}
//             />
//             <TextField
//               margin="dense"
//               label="Description"
//               type="text"
//               fullWidth
//               multiline
//               rows={4}
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               disabled={mode === 'view'}
//             />
//           </>
//         )}
//       </DialogContent>
//       <DialogActions>
//         <Button onClick={onClose}>
//           {mode === 'view' ? 'Close' : 'Cancel'}
//         </Button>
//         {mode !== 'view' && (
//           <Button type="submit" variant="contained" color="primary">
//             {mode === 'add' ? 'Add' : 'Save'}
//           </Button>
//         )}
//       </DialogActions>
//     </form>
//   </Dialog>
<Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
<DialogTitle>
  {mode === 'add' ? 'Add Task' : mode === 'edit' ? 'Edit Task' : 'Task Details'}
</DialogTitle>
<form onSubmit={handleSubmit}>
  <DialogContent>
    {mode === 'view' ? (
      <>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="body1">{description}</Typography>
        {task && (
          <Typography variant="caption" display="block" sx={{ mt: 2 }}>
            Created at: {new Date(task.createdAt).toLocaleString()}
          </Typography>
        )}
      </>
    ) : (
      <>
        <TextField
          autoFocus
          margin="dense"
          label="Title"
          type="text"
          fullWidth
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <TextField
          margin="dense"
          label="Description"
          type="text"
          fullWidth
          multiline
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </>
    )}
  </DialogContent>
  <DialogActions>
    <Button onClick={onClose}>Cancel</Button>
    {mode !== 'view' && (
      <Button type="submit" variant="contained" color="primary">
        {mode === 'add' ? 'Add' : 'Save'}
      </Button>
    )}
  </DialogActions>
</form>
</Dialog>

  );
}

export default TaskDialog