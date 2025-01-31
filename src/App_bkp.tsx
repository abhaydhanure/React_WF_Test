import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Divider,
  Button,
  Grid,
  FormControl,
  Select,
  MenuItem,
  Checkbox,
  TextField,
  ThemeProvider,
  createTheme,
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  IconButton,
  InputLabel,
} from "@mui/material";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import EditNoteIcon from "@mui/icons-material/EditNote";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import AddIcon from "@mui/icons-material/Add";
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import AddTaskIcon from '@mui/icons-material/AddTask';
import FileDownloadDoneIcon from '@mui/icons-material/FileDownloadDone';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import "./App.css";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
});

interface State {
  name: string;
  subStates: Array<{ name: string }>;
}

const TicketForm: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [rowColors, setRowColors] = useState<string[]>(Array(5).fill(""));
  const [selectedStates, setSelectedStates] = useState<Array<string | number>>([]);
  const [states, setStates] = useState<State[]>([...Array(5).keys()].map((i) => ({
    name: `State${i + 1}`,
    subStates: [],
  })));
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [actionType, setActionType] = useState("");
  const [showTable, setShowTable] = useState(false); // New state to control table visibility
  const [openEditModal, setOpenEditModal] = useState(false); // Modal for editing workflow
  const [selectedWorkflow, setSelectedWorkflow] = useState("");
  const [isWorkflowCreated, setIsWorkflowCreated] = useState(false);
  const [workflowName, setWorkflowName] = useState("");
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

  const handleOpenEditModal = () => {
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };

  const handleSelectChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    const selected = event.target.value as string;
    setSelectedWorkflow(selected); // Update the selected workflow
    setShowTable(true); // Show the table after selecting a workflow
    handleCloseEditModal(); // Close the modal
  };

  const onCreate = () => {
    setSelectedWorkflow(""); // Reset the selected workflow to hide the "Edit Workflow" table
    setShowTable(false); // Hide the table
    setIsWorkflowCreated(true); // Set to true when workflow is created
    setShowForm(true); // Show the form

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


  const renderTable = () => {
    if (selectedWorkflow === 'workflow1') {
      return (
        <Box my={3} sx={{ width: 'calc(100% - 10px)', mx: '5px' }}>
          {/* Action Buttons Section */}
          <Box sx={{ mb: 2, pt: '7px', marginBottom: "20px" }}>
            <Button
              onClick={() => openConfirmationDialog('add')}
              variant="outlined"
              color="success"
              sx={{ marginRight: 2 }}
              disabled={isAnyStateSelected}
              startIcon={<AddTaskIcon />}
            >
              Add State
            </Button>
            <Button
              onClick={() => openConfirmationDialog('delete')}
              variant="outlined"
              color="secondary"
              sx={{ marginRight: '14px' }}
              disabled={selectedStates.length === 0}
              startIcon={<DeleteForeverIcon />}
            >
              Delete State
            </Button>
            <Button
              variant="outlined"
              startIcon={<DriveFileRenameOutlineIcon />}
              sx={{ color: '#1976d2', '&:hover': { backgroundColor: 'white' } }}
            >
              Edit State
            </Button>
          </Box>

          {/* Table Section */}
          <div style={{ overflowY: 'auto', maxHeight: '400px' }}>
            <table className="styled-table" style={{ width: '100%' }}>
              <thead style={{ position: 'sticky', top: 0, background: 'white', zIndex: 1 }}>
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
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
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
                          <Select
                            value={rowColors[index]}
                            onChange={(e) => handleColorChange(index, e.target.value)}
                            style={{ background: rowColors[index] }}
                            sx={{ width: '100px', height: '30px' }}
                          >
                            <MenuItem value="">Select Color</MenuItem>
                            <MenuItem value="red">Red</MenuItem>
                            <MenuItem value="orange">Orange</MenuItem>
                            <MenuItem value="yellow">Yellow</MenuItem>
                          </Select>
                        </FormControl>
                      </td>
                      <td>
                        <FormControl fullWidth>
                          <Select sx={{ width: '100px', height: '30px' }}>
                            <MenuItem value="no">No</MenuItem>
                            <MenuItem value="yes">Yes</MenuItem>
                          </Select>
                        </FormControl>
                      </td>
                      <td>
                        <FormControl fullWidth>
                          <Select sx={{ width: '100px', height: '30px' }}>
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
                          <Checkbox
                            checked={selectedStates.includes(`${index}-${subIndex}`)}
                            onChange={() => handleCheckboxChange(`${index}-${subIndex}`)}
                          />
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
                            <Select sx={{ width: '100px', height: '30px' }}>
                              <MenuItem value="no">No</MenuItem>
                              <MenuItem value="yes">Yes</MenuItem>
                            </Select>
                          </FormControl>
                        </td>
                        <td>
                          <FormControl fullWidth>
                            <Select sx={{ width: '100px', height: '30px' }}>
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
        </Box>
      );
    } else if (selectedWorkflow === 'workflow2') {
      return (
        <>
          <h2>Workflow 2 Table</h2>
          <table>
            <thead>
              <tr>
                <th>Column A</th>
                <th>Column B</th>
                <th>Column C</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Data A</td>
                <td>Data B</td>
                <td>Data C</td>
              </tr>
            </tbody>
          </table>
        </>
      );
    } else if (selectedWorkflow === 'workflow3') {
      return (
        <>
          <h2>Workflow 3 Table</h2>
          <table>
            <thead>
              <tr>
                <th>Column X</th>
                <th>Column Y</th>
                <th>Column Z</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Data X</td>
                <td>Data Y</td>
                <td>Data Z</td>
              </tr>
            </tbody>
          </table>
        </>
      );
    }
    return null; // If no workflow is selected, return null to hide the table
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

  const isAnyStateSelected = selectedStates.length > 0;

 
  return (
    <ThemeProvider theme={theme}>
      <Box my={3} sx={{ width: "calc(100% - 60px)", mx: "30px" }}>
      <Card elevation={3} sx={{ pt: "7px", mb: 3, border: "3px solid lavender" }}>
      <CardContent>
        <Divider sx={{ mb: 2, fontSize: "1rem", fontWeight: "bold", textTransform: "uppercase", color: "lightslategrey" }}>
          DCR Workflow Management
        </Divider>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={3}>
            <Button
              fullWidth
              variant="contained"
              onClick={onCreate}
              sx={{ backgroundImage: "linear-gradient(310deg, #1171ef, #11cdef)", color: "antiquewhite", "&:hover": { backgroundColor: "white" } }}
              startIcon={<CreateNewFolderIcon />}
            >
              Create Workflow
            </Button>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button
              fullWidth
              variant="contained"
              onClick={handleOpenEditModal}
              sx={{ backgroundImage: "linear-gradient(310deg, #1c17ad, #9093e6)", color: "antiquewhite", "&:hover": { backgroundColor: "white" } }}
              startIcon={<EditNoteIcon />}
            >
              Edit Workflow
            </Button>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button
              fullWidth
              variant="contained"
              sx={{ backgroundColor: "lightsteelblue", color: "darkblue", "&:hover": { backgroundColor: "lightsteelblue" } }} // Red color on normal and hover
              startIcon={<FileCopyIcon />}
            >
              Copy Workflow
            </Button>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button
              fullWidth
              variant="contained"
              sx={{ backgroundImage: "linear-gradient(315deg, #ca7968 0%, #833d3d 74%);", color: "antiquewhite", "&:hover": { backgroundColor: "white" } }}
              startIcon={<FileCopyIcon />}
            >
              Delete Workflow
            </Button>
          </Grid>
        </Grid>

        {/* Conditionally render the workflow details fields only if 'isWorkflowCreated' is true */}
        {isWorkflowCreated && (
           <Box my={3}>
           <Grid container spacing={3}>
             <Grid item xs={12} sm={6}>
               <TextField
                 fullWidth
                 label="Workflow name *"
                 value={workflowName}
                  onChange={(e) => setWorkflowName(e.target.value)}
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
        )}
      </CardContent>
    </Card>

        {showTable && selectedWorkflow && (
          <Box my={3} sx={{ width: "calc(100% - 10px)", mx: "5px" }}>
            <Card sx={{ pt: "7px", mb: 3, border: "3px solid lavender" }}>
              <CardContent>
              <div>{renderTable()}</div> {/* This will render the table if selectedWorkflow is set */}
              </CardContent>
            </Card>
          </Box>
        )}

        <Dialog open={openEditModal} onClose={handleCloseEditModal} fullWidth maxWidth="md">
          <DialogTitle>Edit Workflow</DialogTitle>
          <DialogContent>
            <FormControl fullWidth>
              <InputLabel id="workflow-select-label">Select Workflow</InputLabel>
              <Select labelId="workflow-select-label" id="workflow-select" value={selectedWorkflow} onChange={handleSelectChange}>
                <MenuItem value={"workflow1"}>Workflow 1</MenuItem>
                <MenuItem value={"workflow2"}>Workflow 2</MenuItem>
                <MenuItem value={"workflow3"}>Workflow 3</MenuItem>
              </Select>
            </FormControl>
            {renderTable()} {/* Render table conditionally */}
            {/* Render table conditionally */}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditModal} color="primary">Cancel</Button>
            <Button onClick={handleCloseEditModal} color="primary">Save</Button>
          </DialogActions>
        </Dialog>

        {showForm && (
          <Box my={3} sx={{ width: "calc(100% - 10px)", mx: "5px" }}>
            <Card sx={{ pt: "7px", mb: 3, border: "3px solid lavender" }}>
              <CardContent>
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
        )}

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
    </ThemeProvider>
  );
};

export default TicketForm;
