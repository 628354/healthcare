import React, { useState, useEffect, useContext } from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import Grid from '@mui/material/Unstable_Grid2';

//import LibraryAddOutlinedIcon from '@mui/icons-material/LibraryAddOutlined';
import { DataGrid/* GridToolbar */,GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarExport,
  } from '@mui/x-data-grid';

  import { Box, Stack } from '@mui/system';

import Swal from 'sweetalert2';


///import Table from './Table';
import Add from './Add';
import Edit from './Edit';
import AuthContext from 'views/Login/AuthContext';
import { TextField } from '@mui/material';
import { BASE_URL, COMMON_UPDATE_FUN } from 'helper/ApiInfo';

//import { employeesData } from './data';






const StaffContact = ({participantId,selectedEmployee,setIsEditing}) => {
  // const [guardianRelation, setGuardianRelation] = useState(selectedEmployee.stf_emgrelntn);
console.log(selectedEmployee);
const id = selectedEmployee.stf_id;
const [personalContact, setPersonalContact] = useState(selectedEmployee.stf_prsnlcntctno);
const [workContact, setWorkContact] = useState(selectedEmployee.stf_workcntctno);
const [address, setAddress] = useState(selectedEmployee.stf_address);
const [guardianName, setGuardianName] = useState(selectedEmployee.stf_emgname);
const [guardianNumber, setGuardianNumber] = useState(selectedEmployee.stf_emgctcno);
const [guardianRelation, setGuardianRelation] = useState(selectedEmployee.stf_emgrelntn);
 
 
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  // const [isEditing, setIsEditing] = useState(false);
  const [isdelete, setIsDelete] = useState(null);
  const {allowUser}=useContext(AuthContext)
  const allowPre= allowUser.find((data)=>{
    // console.log(data);
     if(data.user === "Profiles"){
      return {"add":data.add,"delete":data.delete,"edit":data.edit,"read":data.read}
     }
      
      
  })
  

  const handleEdit = e => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('stf_prsnlcntctno',personalContact);
    formData.append('stf_workcntctno',workContact);
    formData.append('stf_address',address);
    formData.append('stf_emgname',guardianName);
    formData.append('stf_emgctcno',guardianNumber);
    formData.append('stf_emgrelntn',guardianRelation);
   

    //const [employee] = employees.filter(employee => employee.id === id);
    let endpoint = 'updateAll?table=fms_staff_detail&field=stf_id&id='+id;
    let response = COMMON_UPDATE_FUN(BASE_URL,endpoint,formData);
    response.then((data)=>{
      // console.log(data);
      // console.log("bgtrvfcd")
      if (data.status) {
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text:`data has been Updated.`,
          showConfirmButton: false,
          timer: 1500
        })
        setIsEditing(false);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Something Went Wrong.',
          showConfirmButton: true
        })
      }
    });
    
  }; 
 


  



  return (
    <div className="container">
      
      <Box sx={{ flexGrow: 1,m:1 }} component="form"  noValidate
              autoComplete='off'
              onSubmit={handleEdit}>
                              <Grid container spacing={2}>
                                <Grid xs={10}>
                                  <h3>Contact Details</h3>
                                </Grid>
                                <Grid xs={6}>
                                        <TextField
                                          style={{width:'100%'}}
                                          required
                                          label="Personal Contact"
                                          type="number"
                                         value={personalContact}
                                          onChange={(e)=>{setPersonalContact(e.target.value)}}
                                          
                                        />
                                </Grid>
                                <Grid xs={6}>
                                        <TextField
                                          style={{width:'100%'}}
                                          required
                                          label="Work Contact"
                                          type="number"
                                          value={workContact}
                                          onChange={(e)=>{setWorkContact(e.target.value)}}
                                        />
                                </Grid>
                                <Grid xs={6}>
                                        <TextField
                                          style={{width:'100%'}}
                                          required
                                          label="Address"
                                          value={address}
                                          onChange={(e)=>{setAddress(e.target.value)}}
                                        />
                                </Grid>
                                <Grid xs={12}>
                                  <h3>Emergency Contact </h3>
                                  <hr></hr>
                                </Grid>
                                <Grid xs={6}>
                                        <TextField
                                          style={{width:'100%'}}
                                          required
                                          label="Name"
                                          value={guardianName}
                                          onChange={(e)=>{setGuardianName(e.target.value)}}
                                        />
                                </Grid>
                                <Grid xs={6}>
                                        <TextField
                                          style={{width:'100%'}}
                                          required
                                          label="Number"
                                          type="number"
                                          value={guardianNumber}
                                          onChange={(e)=>{setGuardianNumber(e.target.value)}}
                                        />
                                </Grid>
                                <Grid xs={6}>
                                        <TextField
                                          style={{width:'100%'}}
                                          required
                                          label="Relation"
                                          value={guardianRelation}
                                          onChange={(e)=>{setGuardianRelation(e.target.value)}}
                                        />
                                </Grid>
                              </Grid>

                              <Box sx={{m:1}}>
                                <Stack direction="row-reverse"
                                      spacing={2}>
                                  <Button variant="outlined" color="error" onClick={() => setIsEditing(false)} type="button">Cancel</Button>
                                  <Button variant="outlined" type="submit" >Update</Button>
                                  
                                </Stack>
                              </Box>
                            </Box>

   
     
    </div>
  );
};

export default StaffContact;
