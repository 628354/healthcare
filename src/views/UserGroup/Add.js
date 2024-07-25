import React, { useContext, useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Swal from 'sweetalert2';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
// import Paper from '@mui/material/Paper';

import Checkbox from '@mui/material/Checkbox'
import { BASE_URL, COMMON_ADD_FUN } from 'helper/ApiInfo';
import dayjs from 'dayjs';
import AuthContext from 'views/Login/AuthContext';
export const allRoutes = [
  "Participant Assets",
  "Company Assets",
  "Lease and Utility",
  "Maintenance",
  "Repair Requests",
  "Communication Logs",
  "Documents",
  "Goals",
  "Medication Charts",
  "Profiles",
  "RP Register",
  "Risk Assessments",
  "Medication Register",
  "Service Delivery",
  "On Call Logs",
  "Expenses",
  "Policies",
  "Practice Guides",
  "Processes",
  "RP DHS Resources",
  "Forms",
  "Conflict of Interest",
  "Continuous Improvement",
  "Corporate Risks",
  "Internal Registers",
  "Key Decisions",
  "Legislation Registers",
  "Regulatory Compliances",
  "WHS Logs",
  "Meetings",
  "Roster",
  "Blood Glucose",
  "Blood Pressure",
  "Bowel",
  "Seizure",
  "Sleep Logs",
  "Temperature",
  "Weight",
  "ABC Logs",
  "Doctor Visits",
  "Feedback",
  "Incident",
  "Injury Reports",
  "Shift Progress Notes",
  "Progress Reports",
  "PRN Administrations",
  "PRN Balances",
  "Restrictive Practice",
  "Vehicle Logs",
  "Resource",
  "Sites",
  "Documents",
  "Profiles",
  "Sleep Disturbances",
  "Supervision Logs",
  "Teams",
  "Timesheets",
  "User group",
 "Dashboard",
 "Company",
//  "Company List"
  
];
const Add = ({ setIsAdding }) => {
  const [firstName, setFirstName] = useState('');
  // const [location, setLocation] = useState('');
 
  const [permissions, setPermissions] = useState( allRoutes.map(user => ({ user, add: false, delete: false, edit: false, read: false })));
  const [selectAll, setSelectAll] = useState(false);
// console.log(permissions);
// console.log(permissions);
const {companyId}=useContext(AuthContext)
const handleSelectAllChange = () => {
  const updatedPermissions = permissions.map(permission => ({
    ...permission,
    add: !selectAll,
    delete: !selectAll,
    edit: !selectAll,
    read: !selectAll
  }));
  setPermissions(updatedPermissions);
  setSelectAll(prevSelectAll => !prevSelectAll);
};
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

  const handleAdd = (e) => {
    e.preventDefault();

    if (!firstName) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'All fields are required.',
        showConfirmButton: true
      });
    }


    const formdata = new FormData();
    formdata.append("user_role", firstName);
    formdata.append("permissions", JSON.stringify(permissions));
    formdata.append('created_at', currentTime);
    formdata.append('company_id', companyId);


    let endpoint = 'insertDataPost?table=fms_role_permissions';
    let response = COMMON_ADD_FUN(BASE_URL, endpoint, formdata);
    response.then((data) => {
      // console.log(data);
      if (data.status) {
        Swal.fire({
          icon: 'success',
          title: 'Added!',
          text: `${firstName}'s data has been Added.`,
          showConfirmButton: false,
          timer: 1500
        });
        setIsAdding(false);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Something Went Wrong.',
          showConfirmButton: true
        });
      }
    });
  };

  

  return (
    <div className="small-container">
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '50ch' }
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleAdd}
      >
        <TextField
          label="User Role Name"
          onChange={(e) => {
            setFirstName(e.target.value);
          }}
        />
         <Box align="right">
                  <Checkbox
                    checked={selectAll}
                    onChange={handleSelectAllChange}
                  />
                  Select All
                </Box>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User Role</TableCell>
              <TableCell>Add</TableCell>
              <TableCell>Delete</TableCell>
              <TableCell>Edit</TableCell>
              <TableCell>Read</TableCell>
             
            </TableRow>
          </TableHead>
          <TableBody>
            {permissions.map((row, index) => (
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
        <Box sx={{ width: '100ch', m: 1 }}>
          <Stack direction="row-reverse" spacing={2}>
            <Button variant="outlined" color="error" onClick={() => setIsAdding(false)} type="button">
              Cancel
            </Button>
            <Button variant="outlined" type="submit">
              Submit
            </Button>
          </Stack>
        </Box>
      </Box>
    </div>
  );
};

export default Add;
