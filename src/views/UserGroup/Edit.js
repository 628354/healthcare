import React, { useState } from 'react';
// import dayjs from 'dayjs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
//import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox'

import Swal from 'sweetalert2';
import { BASE_URL, COMMON_UPDATE_FUN } from 'helper/ApiInfo';
import dayjs from 'dayjs';



const Edit = ({ selectedRole, setIsEditing }) => {
  const id = selectedRole.permission_id;
console.log(selectedRole);
  const [firstName, setFirstName] = useState(selectedRole?.user_role);
  const [permissions, setPermissions] = useState(() => {
    try {
      return JSON.parse(selectedRole?.permissions || '[]');
    } catch (error) {
      console.error('Error parsing permissions:', error);
      return [];
    }
  });

// //console.log(permissions);

  const handlePermissionChange = (index, permissionType) => {
    setPermissions((prevPermissions) => {
      const updatedPermissions = [...prevPermissions];
      updatedPermissions[index] = {
        ...updatedPermissions[index],
        [permissionType]: !updatedPermissions[index][permissionType]
      };
      return updatedPermissions;
    });
  };
  const currentTime = dayjs().format('YYYY-MM-DD HH:mm');
 
  const handleUpdate = e => {
    e.preventDefault();

    const formdata = new FormData();
    formdata.append("user_role", firstName);
    formdata.append("permissions", JSON.stringify(permissions));
    formdata.append('updated_at', currentTime);
    
    let endpoint = `updateAll?table=fms_role_permissions&field=permission_id&id=${id}`;
    let response = COMMON_UPDATE_FUN(BASE_URL,endpoint,formdata);
      response.then((data)=>{
          // //console.log(data.status);
          //return data;
          if(data.status){
            Swal.fire({
              icon: 'success',
              title: 'Updated!',
              text: `${firstName}'s data has been Updated.`,
              showConfirmButton: false,
              timer: 1500,
            });
            setIsEditing(false);
          }else{
            Swal.fire({
            icon: 'error',
            title: 'Error!',
            text: 'Something Went Wrong.',
            showConfirmButton: true,
      });
          }
      });

    
  };


  return (
    <div className="small-container">

      <Box
        component="form"
       
        sx={{
          '& .MuiTextField-root': { m: 1, width: '50ch' },
          //bgcolor:'#FFFFFF'
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleUpdate}
      >
        <h1>Edit Employee</h1>
          <TextField
            required
            defaultValue={firstName}
            label="Role"
            onChange={(e)=>{setFirstName(e.target.value)}}
          />
          <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Add</TableCell>
              <TableCell>Delete</TableCell>
              <TableCell>Edit</TableCell>
              <TableCell>Read</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {permissions?.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.user}</TableCell>
                <TableCell>
                  <Checkbox
                    checked={row.add}
                    onChange={() => handlePermissionChange(index, 'add')}
                  />
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={row.delete}
                    onChange={() => handlePermissionChange(index, 'delete')}
                  />
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={row.edit}
                    onChange={() => handlePermissionChange(index, 'edit')}
                  />
                </TableCell>
                <TableCell>
                  <Checkbox
                    checked={row.read}
                    onChange={() => handlePermissionChange(index, 'read')}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>


          
          <Box sx={{width: '100ch',m:1}}>
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

export default Edit;