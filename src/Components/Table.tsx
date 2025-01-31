import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Button,
  Grid,
  FormControl,
  Select,
  MenuItem,
  Checkbox,
  TextField,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  IconButton,
  // createTheme,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddTaskIcon from '@mui/icons-material/AddTask';
import FileDownloadDoneIcon from '@mui/icons-material/FileDownloadDone';
import "../App.css";

interface TablesProps {
  mode: string; // Assuming 'mode' is a string, you can adjust the type as needed
  states_wf: any; // Replace 'any' with a more specific type if you know the shape of 'states'
  workflow: any; // Replace 'any' with a more specific type if you know the shape of 'workflow'
  onChange:(newWF:string)=>void;
}

interface State {
  name: string;
  subStates: Array<{ name: string }>;
}

const Table: React.FC<TablesProps> = ({ mode, states_wf, workflow,onChange }) => {

  <div>
      <p>Mode: {mode}</p>
      <p>States: {JSON.stringify(states_wf)}</p>
      <p>Workflow: {JSON.stringify(workflow)}</p>
  </div>

  const [rowColors, setRowColors] = useState<string[]>(Array(5).fill(""));
  const [selectedStates, setSelectedStates] = useState<Array<string | number>>([]);
  const [states, setStates] = useState<State[]>([...Array(3).keys()].map((i) => ({
    name: `State${i + 1}`,
    subStates: [],
  })));
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [actionType, setActionType] = useState("");
  const [workflowName, setWorkflowName] = useState('');
  const [workflowOwner, setWorkflowOwner] = useState("ad923740.ttl");

  const handleColorChange = (index: number, color: string) => {
    const newRowColors = [...rowColors];
    let gradient: string | undefined;

    if (color === 'red') {
      gradient = 'linear-gradient(to right, #ff0000, #ff7373)';
    } else if (color === 'orange') {
      gradient = 'linear-gradient(to right, #ffa500, #ffd580)';
    } else if (color === 'yellow') {
      gradient = 'linear-gradient(to right, #ffff00, #ffff99)';
    }

    newRowColors[index] = gradient || "";
    setRowColors(newRowColors);
  };

  const handleCheckboxChange = (index: string | number, isSubState = false) => {
    const updatedSelectedStates = [...selectedStates];

    if (isSubState) {
      const subStateIndex = `${index}`;
      if (updatedSelectedStates.includes(subStateIndex)) {
        updatedSelectedStates.splice(updatedSelectedStates.indexOf(subStateIndex), 1);
      } else {
        updatedSelectedStates.push(subStateIndex);
      }
    } else {
      if (updatedSelectedStates.includes(index)) {
        updatedSelectedStates.splice(updatedSelectedStates.indexOf(index), 1);
      } else {
        updatedSelectedStates.push(index);
      }
    }

    setSelectedStates(updatedSelectedStates);
  };


  const openConfirmationDialog = (action: string) => {
    setActionType(action);
    setOpenDialog(true);
  };

  const addState = () => {
    const newStateIndex = states.length + 1;
    const newStateName = `State${newStateIndex}`;

    const updatedStates = [...states, { name: newStateName, subStates: [] }];
    setStates(updatedStates);

    setSnackbarMessage(`State ${newStateName} added successfully`);
    setOpenSnackbar(true);
  };

  const addSubState = (parentIndex: number) => {
    const newSubStateIndex = states[parentIndex].subStates.length + 1;
    const newSubStateName = `${states[parentIndex].name}.${newSubStateIndex}`;

    const updatedStates = [...states];
    updatedStates[parentIndex].subStates.push({ name: newSubStateName });

    setStates(updatedStates);

    setSnackbarMessage(`Sub-state ${newSubStateName} added successfully`);
    setOpenSnackbar(true);
  };

  const deleteSelectedStates = () => {
    const deletedStates = selectedStates.length;

    const updatedStates = states
      .filter((state, index) => {
        if (selectedStates.includes(index)) {
          return false;
        }

        state.subStates = state.subStates.filter(
          (_, subIndex) => !selectedStates.includes(`${index}-${subIndex}`)
        );
        return true;
      })
      .map((state, index) => {
        state.subStates = state.subStates.map((subState, subIndex) => {
          return { ...subState, name: `${state.name}.${subIndex + 1}` };
        });
        return { ...state, name: `State${index + 1}` };
      });

    const remainingColors = rowColors.filter((_, index) => !selectedStates.includes(index));

    setStates(updatedStates);
    setRowColors(remainingColors);

    setSnackbarMessage(`${deletedStates} state(s) deleted successfully`);
    setOpenSnackbar(true);

    setSelectedStates([]);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleConfirm = () => {
    if (actionType === "add") {
      addState();
    } else if (actionType === "delete") {
      deleteSelectedStates();
    }
    setOpenDialog(false);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
    };

  useEffect(()=>{
    setWorkflowName(workflow);
   },[workflow])

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) =>{
    const updatedWf = event.target.value;
    onChange(updatedWf);
    setWorkflowName(updatedWf);

    }

  const isAnyStateSelected = selectedStates.length > 0;
  // onChange={(e) => setWorkflowName(e.target.value)}
  return (
    <div>
    {(mode === 'create' || mode === 'edit') &&
    <div> 
     <Box my={3} sx={{ width: "calc(100% - 60px)", mx: "30px" }}>
      <Box my={3} sx={{ width: "calc(100% - 10px)", mx: "5px" }}>
            <Card sx={{ pt: "7px", mb: 3, border: "3px solid lavender" }}>
              <CardContent>
            {workflow} -   
            You are in - {mode} mode
           <Box my={3}>
           <Grid container spacing={3}>
             <Grid item xs={12} sm={6}>
               <TextField
                 fullWidth
                 label="Workflow name *"
                 value={workflowName}
                 onChange={handleValueChange}
                 placeholder="Enter Workflow Name"
               />
             </Grid>
             <Grid item xs={12} sm={6}>
               <TextField
                 fullWidth
                 label="Workflow Owner"
                 value={workflowOwner}
                 onChange={(e) => setWorkflowOwner(e.target.value)} // Handle input change
               />
             </Grid>
           </Grid>
         </Box>
      
                <Box sx={{ mb: 2 }}>
                  <Button 
                    onClick={() => openConfirmationDialog("add")}
                    variant="outlined"
                    color="success"
                    sx={{ marginRight: 2 }}
                    disabled={isAnyStateSelected}
                    startIcon={<AddTaskIcon />}
                  >
                    Add State
                  </Button>
                  <Button
                    onClick={() => openConfirmationDialog("delete")}
                    variant="outlined"
                    color="secondary"
                    disabled={selectedStates.length === 0}
                    startIcon={<DeleteForeverIcon />}
                  >
                    Delete State
                  </Button>
                </Box>

                {/* Table */}
                <div style={{ overflowY: "auto", maxHeight: "400px" }}>
                  <table className="styled-table" style={{ width: "100%" }}>
                    <thead style={{ position: "sticky", top: 0, background: "white", zIndex: 1 }}>
                      <tr>
                        <th>Select</th>
                        <th>State</th>
                        <th>Wf_Name</th>
                        <th>Wf_Owner</th>
                        <th>Sequence_Key</th>
                        <th>Stage_Color</th>
                        <th>Stage_Key</th>
                        <th>Post_Macro</th>
                        <th>Pre_Macro</th>
                        <th>CC_List</th>
                        <th>Ass_Type</th>
                        <th>Default_Ass</th>
                        <th>Role_Key</th>
                        <th>Default_Owner</th>
                      </tr>
                    </thead>
                    <tbody>
                      {states.map((state, index) => (
                        <React.Fragment key={index}>
                          {/* Parent State Row */}
                          <tr>
                            <td>
                              {index !== 0 && (
                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                  <Checkbox
                                    checked={selectedStates.includes(index)}
                                    onChange={() => handleCheckboxChange(index)}
                                  />
                                  <IconButton onClick={() => addSubState(index)}>
                                    <AddIcon />
                                  </IconButton>
                                </Box>
                              )}
                            </td>
                            <td>{state.name}</td>
                            <td>
                              <input type="text" value={`State ${state.name} Name`} />
                            </td>
                            <td>
                              <input type="text" value={`State ${state.name} Display`} />
                            </td>
                            <td>
                              <input type="text" value={`action${state.name}`} />
                            </td>
                            <td>
                              <FormControl fullWidth>
                                <Select value={rowColors[index]} onChange={(e) => handleColorChange(index, e.target.value as string)} style={{ background: rowColors[index] }} sx={{ width: "100px", height: "30px" }}>
                                  <MenuItem value="">Select Color</MenuItem>
                                  <MenuItem value="red">Red</MenuItem>
                                  <MenuItem value="orange">Orange</MenuItem>
                                  <MenuItem value="yellow">Yellow</MenuItem>
                                </Select>
                              </FormControl>
                            </td>
                            <td>
                              <FormControl fullWidth>
                                <Select sx={{ width: "100px", height: "30px" }}>
                                  <MenuItem value="no">No</MenuItem>
                                  <MenuItem value="yes">Yes</MenuItem>
                                </Select>
                              </FormControl>
                            </td>
                            <td>
                              <FormControl fullWidth>
                                <Select sx={{ width: "100px", height: "30px" }}>
                                  <MenuItem value="no">No</MenuItem>
                                  <MenuItem value="yes">Yes</MenuItem>
                                </Select>
                              </FormControl>
                            </td>
                            <td>
                              <input type="text" value="" />
                            </td>
                            <td>
                              <input type="text" value="" />
                            </td>
                            <td>
                              <input type="text" value="" />
                            </td>
                            <td>
                              <input type="text" value="" />
                            </td>
                            <td>
                              <input type="text" value="" />
                            </td>
                            <td>
                              <input type="text" value="" />
                            </td>
                          </tr>

                          {/* Sub-State Rows */}
                          {state.subStates.map((subState, subIndex) => (
                            <tr key={`${index}-${subIndex}`}>
                              <td>
                                <Checkbox checked={selectedStates.includes(`${index}-${subIndex}`)} onChange={() => handleCheckboxChange(`${index}-${subIndex}`, true)} />
                              </td>
                              <td>{subState.name}</td>
                              <td>
                                <input type="text" value={`Sub-State ${subState.name} Name`} />
                              </td>
                              <td>
                                <input type="text" value={`Sub-State ${subState.name} Display`} />
                              </td>
                              <td>
                                <input type="text" value={`action${subState.name}`} />
                              </td>
                              <td>
                                <FormControl fullWidth>
                                  <Select sx={{ width: "100px", height: "30px" }}>
                                    <MenuItem value="no">No</MenuItem>
                                    <MenuItem value="yes">Yes</MenuItem>
                                  </Select>
                                </FormControl>
                              </td>
                              <td>
                                <FormControl fullWidth>
                                  <Select sx={{ width: "100px", height: "30px" }}>
                                    <MenuItem value="no">No</MenuItem>
                                    <MenuItem value="yes">Yes</MenuItem>
                                  </Select>
                                </FormControl>
                              </td>
                              <td>
                                <input type="text" value="" />
                              </td>
                              <td>
                                <input type="text" value="" />
                              </td>
                              <td>
                                <input type="text" value="" />
                              </td>
                              <td>
                                <input type="text" value="" />
                              </td>
                              <td>
                                <input type="text" value="" />
                              </td>
                              <td>
                                <input type="text" value=""/>
                              </td>
                              <td>
                                <input type="text" value={`Reassignment for ${subState.name}`} />
                              </td>
                            </tr>
                          ))}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>

                  {/* Submit Button */}
                  <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
                              <Button
                                variant="outlined"
                                color="success"
                                sx={{
                                  backgroundImage:
                                    'linear-gradient(to right, rgb(17, 82, 147) 0%, rgb(48 114 181) 51%, #02AAB0 100%)',
                                  borderRadius: '10px !important',
                                  color: 'papayawhip',
                                  '&:hover': { backgroundColor: 'lightsteelblue' },
                                }}
                                onClick={() => alert('Form Submitted')}
                                startIcon={<FileDownloadDoneIcon />}
                              >
                                Submit
                              </Button>
                            </Box>

              </CardContent>
            </Card>
          </Box>
      
{/* // Snackbar Popup */}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="success">{snackbarMessage}</Alert>
        </Snackbar>

        <Dialog open={openDialog} onClose={handleDialogClose}>
          <DialogTitle>Are you sure?</DialogTitle>
          <DialogContent>
            <Typography variant="body1">
              {actionType === "add" ? "You are about to add a new state. Do you want to continue?" : "You are about to delete selected states. This action cannot be undone."}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button onClick={handleConfirm} color="primary">
              {actionType === "add" ? "Yes, Add" : "Yes, Delete"}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </div>
    }     
    </div>    
    
  );
};

export default Table;





