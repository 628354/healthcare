import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
//import LibraryAddOutlinedIcon from '@mui/icons-material/LibraryAddOutlined';
import {
  DataGrid/* GridToolbar */, GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector,
} from '@mui/x-data-grid';

import '../../style/App.css'

import Swal from 'sweetalert2';


///import Table from './Table';
import Add from './Add';
import Edit from './Edit';
import { BASE_URL, COMMON_GET_FUN, companyId } from 'helper/ApiInfo';

const UserGroup = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isdelete, setIsDelete] = useState(null);

  const columns = [
    { field: 'permission_id', headerName: 'ID', width: 70 },
    { field: 'user_role', headerName: 'User Role Name', width: 300 },


    {
      field: 'action',
      headerName: 'Action',
      minWidth: 200,
      renderCell: (params) => (
        <strong >
          <IconButton aria-label="edit" color="primary" onClick={() => handleEdit(params.id)} >
            <EditNoteOutlinedIcon />
          </IconButton>
          <IconButton aria-label="delete" color="error" sx={{ m: 2 }} onClick={() => handleDelete(params.id)} >
            <DeleteOutlineOutlinedIcon />
          </IconButton>


        </strong>
      ),
    },
  ];



  useEffect(() => {
    let endpoint = `getAll?table=fms_role_permissions&select=user_role,permission_id,permissions&company_id=${companyId}&fields=status&status=1`;
    const fetchData = async () => {
      try {
        let response = await COMMON_GET_FUN(BASE_URL, endpoint);
        if (response.status) {
          setEmployees(response.messages);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [isAdding, isEditing, isdelete]);



  const handleEdit = id => {
    let endpoint = 'getWhere?table=fms_role_permissions&field=permission_id&id=' + id;

    const fetchData = async () => {
        try {
            let response = await COMMON_GET_FUN(BASE_URL, endpoint);
            if (response.status) {
                setSelectedRole(response.messages);
                setIsEditing(true);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    fetchData();
};


  const handleAddButton = () => {
    setIsAdding(true);
  };

  const handleDelete = id => {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!'
    }).then(result => {
      if (result.value) {
        let endpoint = `deleteStatus?table=fms_role_permissions&field=permission_id&id=${id}&delete_status=status&value=1`
        let response = COMMON_GET_FUN(BASE_URL, endpoint)
        response.then(data => {
          if (data.status) {
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: `Record data has been deleted.`,
              showConfirmButton: false,
              timer: 1500
            })
            setIsDelete(id)
          }
        })
      }
    })
  };



  async function deleteRecorde(url, endpoint) {
    const response = await fetch(url + endpoint, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        //'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
    return response.json();
  }

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarColumnsButton />
        <GridToolbarFilterButton />
        <GridToolbarDensitySelector />
        <GridToolbarExport />
        <Button variant="contained" onClick={() => { handleAddButton() }} style={{ margin: "0px 0px 0px auto" }} >Add New</Button>
      </GridToolbarContainer>
    );
  }

  return (
    <div className="container ">



      {!isAdding && !isEditing && (
        <>

          {/* <Button variant="contained" onClick={()=>{handleAddButton()}} >Add New</Button> */}
          <h1>User Role Name </h1>
          <DataGrid


            columns={columns}
            rows={employees}
            getRowId={(row) => row.permission_id}
            slots={{
              toolbar: CustomToolbar,
            }}

            sx={{
              m: 2,
              boxShadow: 2,
              border: 0,
              borderColor: 'primary.light',
              '& .MuiDataGrid-cell:hover': {
                color: 'primary.main',
              },
            }}

            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[10, 25, 50, 100]}
          //checkboxSelection
          />
          {/* <Table
              employees={employees}
              handleEdit={handleEdit}
              handleDelete={handleDelete}
            /> */}
        </>
      )}
      {isAdding && (
        <Add
          setIsAdding={setIsAdding}
        />
      )}
      {isEditing && (
        <Edit
          selectedRole={selectedRole}
          setIsEditing={setIsEditing}
        />
      )}
    </div>
  );
};

export default UserGroup
