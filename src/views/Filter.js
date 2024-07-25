import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { Box, Stack } from '@mui/system';
import { Button } from '@mui/material';

const Filter = ({setShowFilterFields,columns,combineDataFields}) => {
    const [rows, setRows] = useState([{ field: '', condition: 'is', value: '' }]);
    const addRow = () => {
      setRows([...rows, { field: '', condition: 'is', value: '' }]);
    };
  
    const removeRow = (indexToRemove) => {
      if (indexToRemove === 0) {
        return; 
      }
      const updatedRows = rows.filter((_, index) => index !== indexToRemove);
      setRows(updatedRows);
    };
  
  
    const handleFieldChange = (value, rowIndex) => {
      const updatedRows = [...rows];
      updatedRows[rowIndex].field = value;
      setRows(updatedRows);
    };
  
    const handleConditionChange = (value, rowIndex) => {
      const updatedRows = [...rows];
      updatedRows[rowIndex].condition = value;
      setRows(updatedRows);
    };
  
    const handleValueChange = (value, rowIndex) => {
      const updatedRows = [...rows];
      updatedRows[rowIndex].value = value;
      setRows(updatedRows);
    };
  
    const handleSubmit = () => {

   

    };
  

  return (
    <div style={{width:"100%"}}>
     
{rows.map((row, rowIndex)=>{
 
 //  console.log(val);
 //  console.log(i);
   return(
     <Grid
     container
     justifyContent="space-between"
     alignItems="center"
     spacing={1}
     key={rowIndex}
     marginBottom="10px"
   >
     <Grid item xs={1}>
       <IconButton>
         <RemoveCircleOutlineIcon sx={{ color: "red" }}  onClick={() => removeRow(rowIndex)} />
       </IconButton>
     </Grid>
     <Grid item xs={3}>
       <Select
         fullWidth
         value={row.field}
         onChange={(e) => handleFieldChange(e.target.value, rowIndex)}
       >
 
         {columns?.map((item,index)=>{

           return(
         <MenuItem key={index} value={item?.headerName}>{item?.headerName}</MenuItem>
 
           )
         })}
         
         
       </Select>
     </Grid>
     <Grid item xs={3}>
       <Select
         fullWidth
         value={row.condition}
         onChange={(e) => handleConditionChange(e.target.value, rowIndex)}
       >
         <MenuItem value="is">is</MenuItem>
         <MenuItem value="is not">is not</MenuItem>
         <MenuItem value="Contains">Contains</MenuItem>
       </Select>
     </Grid>
     <Grid item xs={4}>
 

 
       <TextField
         fullWidth
         placeholder="Value"
         type="text"
         value={row.value}
               onChange={(e) => handleValueChange(e.target.value, rowIndex)}
         
       />
     </Grid>
     <Grid item xs={1}>
       <IconButton>
         <AddCircleOutlineIcon sx={{ color: "green", marginBottom: "0px" }} onClick={addRow} />
       </IconButton>
     </Grid>
   </Grid>
   )
 
 })}
      <Box sx={{width: '100ch',m:1}}>
        <Stack direction="row-reverse"
              spacing={2}>
          <Button variant="outlined" type="submit" onClick={handleSubmit} >Apply</Button>
          <Button variant="outlined" color="error" type="button"onClick={() => setShowFilterFields(false)} >Cancel</Button>
         
          
        </Stack>
    </Box>
    </div>
  );
};

export default Filter;
