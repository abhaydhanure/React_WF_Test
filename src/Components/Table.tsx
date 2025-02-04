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
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddTaskIcon from "@mui/icons-material/AddTask";
import FileDownloadDoneIcon from "@mui/icons-material/FileDownloadDone";
import "../App.css";
import { display } from "@mui/system";

interface TablesProps {
  mode: string; // Assuming 'mode' is a string, you can adjust the type as needed
  data: any[]; // Replace 'any' with a more specific type if you know the shape of 'states'
  workflow: any; // Replace 'any' with a more specific type if you know the shape of 'workflow'
  onChange: (newWF: string) => void;
  onDataChange: (updatedData: any[]) => void;
}

interface State {
  name: string;
  subStates: Array<{ name: string }>;
  stateName:string,
  StateId:number,
  subState:string,
  owner:string,
}

const Table: React.FC<TablesProps> = ({
  mode,
  data,
  workflow,
  onChange,
  onDataChange,
}) => {

  

  <div>
    <p>Mode: {mode}</p>
    {/* <p>States: {JSON.stringify(data)}</p> */}
    <p>Workflow: {JSON.stringify(workflow)}</p>
  </div>;

  const [rowColors, setRowColors] = useState<string[]>(Array(5).fill(""));
  const [selectedStates, setSelectedStates] = useState<Array<string | number>>(
    []
  );
  // const [states, setStates] = useState<State[]>(
  //   [...Array(3).keys()].map((i) => ({
  //     name: `State${i + 1}`,
  //     subStates: [],
  //   }))
  // );
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [actionType, setActionType] = useState("");
  const [workflowName, setWorkflowName] = useState("");
  const [workflowOwner, setWorkflowOwner] = useState("ad923740.ttl");
// 
// 
const isAnyStateSelected = selectedStates.length > 0;
  
const [statesD, setStates] = useState<State[]>([]); // Initialize as empty
  
  useEffect(() => {
    // const sortedData = [...data].sort((a, b) => a.stateId - b.stateId);
    const sortedData = [...data].filter((item) =>item.subState == ''  );
    const finalData = sortedData.map((item) => ({
      name: item.name, // Assuming sortedData has a 'stateName' property
      stateName:item.stateName,
      StateId:item.StateId,
      subState:item.subState,
      owner:item.owner,
      // subStates: [data.filter((item) => item.subState > 0 && item.name === workflow)], // Empty array to start with, you can populate it later if needed
      // subStates: [...data].filter((item) =>item.subState != '' && item.name === workflow  )
      subStates: []
    }));
    setStates(finalData); // Initialize statesD with sortedData on first render
  }, [data]); 

 
  
  
  

  const handleColorChange = (index: number, color: string) => {
    const newRowColors = [...rowColors];
    let gradient: string | undefined;

    if (color === "red") {
      gradient = "linear-gradient(to right, #ff0000, #ff7373)";
    } else if (color === "orange") {
      gradient = "linear-gradient(to right, #ffa500, #ffd580)";
    } else if (color === "yellow") {
      gradient = "linear-gradient(to right, #ffff00, #ffff99)";
    }

    newRowColors[index] = gradient || "";
    setRowColors(newRowColors);
  };
  
   const [selectedRows, setSelectedRows] = useState<Set<number>>(new Set());
  
 
  const openConfirmationDialog = (action: string) => {
    setActionType(action);
    setOpenDialog(true);
  };

  const addState = () => {
    
    const newStateIndex = statesD.filter((item) =>item.subState === '' ).length + 1;
    const newStateName = `State${newStateIndex}`;
    const newState = {
      id: newStateIndex,
      name: newStateName,
      subStates: [],
      subState :'',
      owner:'data',
      stateName:`${newStateName}`,
      StateId: newStateIndex // Assuming this is the field to represent the state ID
    };
    const updatedStates = [...statesD, newState];
    setStates(updatedStates); 
    //  console.log(` ${newStateIndex}  added successfully`);
    // alert(`State ${newStateIndex}  added successfully`);
    // setSnackbarMessage(`State ${newStateIndex}  added successfully`);
    // setOpenSnackbar(true);
  };

  const addSubState = (parentIndex: number) => {
    const newSubStateIndex = statesD[parentIndex].subStates.length + 1;
    const newSubStateName = `${statesD[parentIndex].StateId}.${newSubStateIndex}`;

    const updatedStates = [...statesD];
    updatedStates[parentIndex].subStates.push({ name: newSubStateName });

    setStates(updatedStates);
    console.log(updatedStates);
    setSnackbarMessage(`Sub-state ${newSubStateName} added successfully`);
    setOpenSnackbar(true);
  };
  

 
  

  
  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleConfirm = () => {
    if (actionType === "add") {
      // handleAddNextRow();
      addState();
    const newStateIndex = statesD.filter((item) =>item.subState === '' ).length + 1
    const newStateName = `State${newStateIndex}`;

    

      setSnackbarMessage(` ${newStateName} added successfully`);
      setOpenSnackbar(true);

    } else if (actionType === "delete") {
      const deletedCount = selectedRows.size; // Get the count of selected states
    // handleDeleteSelectedRows();
    deleteSelectedStates();
    // setSnackbarMessage(`${deletedCount} state${deletedCount > 1 ? "s" : ""} deleted successfully`);
    // setOpenSnackbar(true);
      
    }
    setOpenDialog(false);
  };
  const deleteSelectedStates = () => {
    const deletedStates = selectedStates.length;

    const updatedStates = statesD
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
  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  useEffect(() => {
    setWorkflowName(workflow);
  }, [workflow]);

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedWf = event.target.value;
    onChange(updatedWf);
    setWorkflowName(updatedWf);
  };

  
  // const groupedData: Record<number, RowData[]> = Object.values(sortedData).reduce((acc, row) => {
  //   if (!acc[row.stateId]) {
  //     acc[row.stateId] = [];
  //   }
  //   acc[row.stateId].push(row);
  //   return acc;
  // }, {} as Record<number, RowData[]>);

  interface RowData {
    stateId: string;
    subState: string;
    name: string;
    owner: string;
    id: number;
    seq:number,
  }
  
  const handleAddNextRow = () => {
    const updatedData = [...data];
    const maxSeq = updatedData.reduce((max, row) => (row.seq > max ? row.seq : max), 0);// Find the highest index of the selected rows, so we can insert after it
    const newRow = {
      id: updatedData.length + 1,  // Assign the next available ID
      name: "",                    // Blank data for name
      stateId: "",                 // Blank data for stateId
      owner: "",                   // Blank data for owner
      subState:"",
      type:mode, 
      seq: maxSeq + 1  
    };
    updatedData.push(newRow);
    const reIndexedData = updatedData.map((row, index) => ({
      ...row,
      // seq: row.seq + 1, // Reassign ID to ensure sequential order
    }));
    console.log(reIndexedData);
    // Update the parent data
    onDataChange(reIndexedData);
  };
    // Handle deleting selected rows
    const handleDeleteSelectedRows = () => {
      // Filter out the rows that are selected
      console.log(selectedRows);
      const updatedData = data.filter((_, index) => !selectedRows.has(index));
     const reIndexedData = updatedData.map((row, index) => ({
      ...row,
      seq: index + 1, // Reassign ID to ensure sequential order
    }));
  onDataChange(reIndexedData);
    setSelectedRows(new Set());
  };


  // new code for add state and delete state and add sub state

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
   const handleInputChange = (
     e: React.ChangeEvent<HTMLInputElement>,
     field: string,
     index: number
   ) => {
     const updatedData = [...statesD];
     updatedData[index] = { ...updatedData[index], [field]: e.target.value };
     onDataChange(updatedData);
   };
  return (
    
    <div>
      {(mode === "create" || mode === "edit") && (
        <div>
          <Box my={3} sx={{ width: "calc(100% - 60px)", mx: "30px" }}>
            <Box my={3} sx={{ width: "calc(100% - 10px)", mx: "5px" }}>
              <Card sx={{ pt: "7px", mb: 3, border: "3px solid lavender" }}>
                <CardContent>
                  {workflow} - You are in - {mode} mode
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
                      {statesD.map((state, index) => (
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
                            <td>State{index + 1}</td>
                            <td>
                              <input type="text" value={state.name}onChange={(e) => handleInputChange(e, "name", index)}/>
                            </td>
                            <td>
                            <input type="text" value={state.owner}onChange={(e) => handleInputChange(e, "owner", index)}/>
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
                              <input type="text" value=""  />
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

                         
                          {state.subStates.map((subState, subIndex)=> (
                            <tr key={`${index}-${subIndex}`}>
                              <td>
                                <Checkbox checked={selectedStates.includes(`${index}-${subIndex}`)} onChange={() => handleCheckboxChange(`${index}-${subIndex}`, true)} />
                              </td>
                              <td>State{subState.name}</td>
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
                  <Box
                    sx={{ mt: 3, display: "flex", justifyContent: "center" }}
                  >
                    <Button
                      variant="outlined"
                      color="success"
                      sx={{
                        backgroundImage:
                          "linear-gradient(to right, rgb(17, 82, 147) 0%, rgb(48 114 181) 51%, #02AAB0 100%)",
                        borderRadius: "10px !important",
                        color: "papayawhip",
                        "&:hover": { backgroundColor: "lightsteelblue" },
                      }}
                      onClick={() => alert("Form Submitted")}
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
                  {actionType === "add"
                    ? "You are about to add a new state. Do you want to continue?"
                    : "You are about to delete selected states. This action cannot be undone."}
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
      )}
    </div>
  );
};

export default Table;
