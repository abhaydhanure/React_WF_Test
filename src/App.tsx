import React, {  useState } from "react";
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
} from "@mui/material";
import CreateNewFolderIcon from "@mui/icons-material/CreateNewFolder";
import EditNoteIcon from "@mui/icons-material/EditNote";
import FileCopyIcon from "@mui/icons-material/FileCopy";
import Table from "./Components/Table";

import { editData } from "./assets/workflowData";
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
  const [tableData, setTableData] = useState<any[]>([]);

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    setSelectedWorkflowEdit(event.target.value); // event.target.value is now typed as string
    // console.log(event.target.value);
    handleButtonClick('edit', event.target.value);
   
  };
  
  const handleButtonClick = (action: 'create' | 'edit', workflow: string) => {
    setMode(action);
    if(action === 'edit')
    {
      const editVal  = editData.filter(item => item.type === action).filter(item=> item.name == workflow);
    
      setTableData(editVal); // Empty array for create mode (will render empty rows)
    }else{
      const editVal  = editData.filter(item => item.type === action);
      setTableData(editVal); // Empty array for create mode (will render empty rows)
    }
    
    
    console.log(`Selected workflow: ${workflow}  ${action}`);
  };
  
  const handleChange = (new_WF:string)=>{
    setSelectedWorkflowEdit(new_WF);
  }
  const handleDataChange = (updatedData: any[]) => {
    setTableData(updatedData);
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
              <Select labelId="workflow-select-label" id="workflow-select" value={selectedWorkflowEdit}   onChange={handleSelectChange} >
                <MenuItem value={"workflow1"}>Workflow 1</MenuItem>
                <MenuItem value={"workflow2"}>Workflow 2</MenuItem>
                <MenuItem value={"workflow3"}>Workflow 3</MenuItem>
              </Select>
            </FormControl>
            {renderTable()}
            
        
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditModal} color="primary">Cancel</Button>
            <Button onClick={handleCloseEditModal} color="primary">Save</Button>
          </DialogActions>
        </Dialog>

        
      </Box>
      <Table
          mode={mode ?? 'null'} // If mode is null, default to 'create'
          data={tableData}
          workflow={selectedWorkflowEdit}
          onChange={handleChange}
          onDataChange={handleDataChange}
         
        />

    </ThemeProvider>
  );
};

export default TicketForm;
