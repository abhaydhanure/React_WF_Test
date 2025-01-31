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
  ThemeProvider,
  createTheme,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
  SelectChangeEvent ,
  TextField
} from "@mui/material";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import EditNoteIcon from "@mui/icons-material/EditNote";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import Table from "./Components/Table";

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
  const [states] = useState<State[]>([...Array(3).keys()].map((i) => ({
    name: `State${i + 1}`,
    subStates: [],
  })));
  
  const [showTable] = useState(false); // New state to control table visibility
  const [openEditModal, setOpenEditModal] = useState(false); // Modal for editing workflow
  const [selectedWorkflow] = useState("");

  const [workflowName, setWorkflowName] = useState('');
  const handleOpenEditModal = () => {
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
  };

  const renderTable = () => {
    return null; // If no workflow is selected, return null to hide the table
  };
  const [mode, setMode] = useState<'create' | 'edit' | null>(null);
  const [selectedWorkflowEdit, setSelectedWorkflowEdit] = useState<string>(''); // Holds the selected workflow value

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    setSelectedWorkflowEdit(event.target.value); // event.target.value is now typed as string
    handleButtonClick('edit', event.target.value);

    if (event.target.value === 'workflow1') {
      setWorkflowName('Workflow 1');
    } else if (event.target.value === 'workflow2') {
      setWorkflowName('Workflow 2');
    } else if (event.target.value === 'workflow3') {
      setWorkflowName('Workflow 3');
    }
  };
  
  const handleButtonClick = (action: 'create' | 'edit', workflow: string) => {
    setMode(action);
    console.log(`Selected workflow: ${workflow}`);
  };


  return (
    <ThemeProvider theme={theme}>
      
      <Box my={3} sx={{ width: "calc(100% - 60px)", mx: "30px" }}>
      <Card elevation={3} sx={{ pt: "7px", mb: 3, border: "3px solid lavender" }}>
      <CardContent>
        <Divider sx={{ mb: 2, fontSize: "1rem", fontWeight: "bold", textTransform: "uppercase", color: "lightslategrey" }}>
          Workflow Management
        </Divider>

        <Grid container spacing={3}>
          <Grid item xs={12} sm={3}>
          <Button
              fullWidth
              variant="contained"
              onClick={() => handleButtonClick('create', 'New Workflow')}
              sx={{
                backgroundImage: "linear-gradient(310deg, #1171ef, #11cdef)",
                color: "antiquewhite",
                "&:hover": { backgroundColor: "white" }
              }}
              startIcon={<CreateNewFolderIcon />}
              data-tb_data="Create" // Using data attribute instead of custom prop
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
              <Select labelId="workflow-select-label" id="workflow-select" value={selectedWorkflowEdit}   onChange={(e) => setWorkflowName(e.target.value)} >
                <MenuItem value={"workflow1"}>Workflow 1</MenuItem>
                <MenuItem value={"workflow2"}>Workflow 2</MenuItem>
                <MenuItem value={"workflow3"}>Workflow 3</MenuItem>
              </Select>
            </FormControl>
            {renderTable()} 
            {/* Display the workflow name in the input field */}
        {/* <TextField
          fullWidth
          label="Workflow Name"
          value={workflowName}
          onChange={(e) => setWorkflowName(e.target.value)} // Optional if you want to edit it directly
          placeholder="Workflow Name will appear here"
          sx={{ mt: 3 }}
        /> */}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditModal} color="primary">Cancel</Button>
            <Button onClick={handleCloseEditModal} color="primary">Save</Button>
          </DialogActions>
        </Dialog>

        
      </Box>
      <Table
          mode={mode ?? 'null'} // If mode is null, default to 'create'
          states_wf={states}
          workflow={selectedWorkflowEdit}
        />

    </ThemeProvider>
  );
};

export default TicketForm;
