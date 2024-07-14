import React, { useState, useEffect, useContext } from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
//import LibraryAddOutlinedIcon from '@mui/icons-material/LibraryAddOutlined';
import {
  DataGrid/* GridToolbar */, GridToolbarContainer,
  // GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
} from '@mui/x-data-grid';

import VisibilityIcon from '@mui/icons-material/Visibility';

import Swal from 'sweetalert2';


///import Table from './Table';
import Add from './Add';
import Edit from './Edit';
import { Box } from '@mui/system';
import AuthContext from 'views/Login/AuthContext';
import { useDispatch } from 'react-redux';
import { addParticipantData } from 'store/actions';
import { BASE_URL, COMMON_GET_FUN, companyId } from 'helper/ApiInfo';
// import { addParticipantData } from '../../../store/actions';

//import { employeesData } from './data';






const ParticipantProfiles = ({ setShow, show }) => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isdelete, setIsDelete] = useState(null);
  const { allowUser } = useContext(AuthContext)

  const dispatch = useDispatch()
  const allowPre = allowUser.find((data) => {
    // console.log(data);
    if (data.user === "Profiles") {
      return { "add": data.add, "delete": data.delete, "edit": data.edit, "read": data.read }
    }


  })

  useEffect(() => {
    if (show) {
      setShow(false)
    }
  }, [])

  // console.log(allowPre);

  const columns = [
    {
      field: `name`, headerName: 'Name', width: 250,
      valueGetter: (params) => {
        return `${params.row.prtcpnt_firstname} ${params.row.prtcpnt_lastname}`


      },
    },
    {
      field: 'prtcpnt_email',
      headerName: 'Email',
      width: 250,
    },

    {
      field: 'prtcpnt_gender',
      headerName: 'Gender',
      width: 200,
      valueFormatter: (params) => {
        // console.log(params);
        if (params.value == '2') {
          return `Male`;
        } else if (params.value == '1') {
          return `female`;
        } else if (params.value == '3') {
          return `other`;
        }

      },
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 250,
      renderCell: (params) => (
        <strong >
          {
            allowPre?.edit ? <IconButton aria-label="edit" color="primary" onClick={() => handleEdit(params.id)}>
              <EditNoteOutlinedIcon />
            </IconButton> : (allowPre?.read ? <IconButton aria-label="edit" color="primary" onClick={() => handleEdit(params.id)}>
              <VisibilityIcon />
            </IconButton> : "")
          }
          {
            allowPre?.delete ? <IconButton aria-label="delete" color="error" sx={{ m: 2 }} onClick={() => handleDelete(params.id)}>
              <DeleteOutlineOutlinedIcon />
            </IconButton> : ""
          }

        </strong>
      ),
    },
  ];



  useEffect(() => {
    try {
      
      let endpoint = `getWhereAll?table=fms_prtcpnt_details&field=prtcpnt_archive&value=1&status=0&company_id=${companyId}`;
      let response = COMMON_GET_FUN(BASE_URL, endpoint)
      response.then(data => {
        console.log(data);
        if (data.status) {
          if (Array.isArray(data.messages) && data.messages.length > 0) {
            const rowsWithIds = data.messages.map((row, index) => ({ ...row, id: index }));
            setEmployees(rowsWithIds);
          } else {
            setEmployees([]);
          }
        }
      })
    } catch (error) {
      console.error('Error in useEffect:', error);
    }
  }, [isAdding, isEditing, isdelete])
  const handleEdit = id => {
    try {
      const endpoint = `getWhere?table=fms_prtcpnt_details&field=prtcpnt_id&id=${id}`;

      let response = COMMON_GET_FUN(BASE_URL, endpoint)
      response.then(data => {
        console.log(data);
        if (data.status) {
          dispatch(addParticipantData(data.messages))
          setSelectedEmployee(data.messages);
          setIsEditing(true)
        }
      })
    } catch (error) {
      console.error('Error in handleEdit:', error);
    }
  }
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
        let endpoint = `deleteStatus?table=fms_prtcpnt_details&field=prtcpnt_id&id=${id}&delete_status=prtcpnt_status&value=1`
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
          }else{
            Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: data.messages,
              showConfirmButton: false,
              timer: 1500
            })

          }
        })
      }
    })
  }

  function CustomToolbar() {
    return (
      <GridToolbarContainer >
        <h3 style={{ fontSize: "1.285rem", fontWeight: "500" }}>Participant Profiles</h3>
        <Box sx={{ flexGrow: 1 }} />
        {/* <GridToolbarColumnsButton /> */}
        <GridToolbarFilterButton sx={{ border: '1px solid #82868b', width: "100px", color: "black", height: "35px" }} />
        {/* <GridToolbarDensitySelector /> */}
        <GridToolbarExport sx={{ border: '1px solid #82868b', width: "100px", color: "black", height: "35px" }} />
        {
          allowPre?.add ? <Button variant="contained" onClick={() => { handleAddButton() }} style={{ margin: "0px 0px 0px auto" }} >Add New</Button> : ""
        }
      </GridToolbarContainer>
    );
  }

  return (
    <div className="container">



      {!isAdding && !isEditing && (
        <>

          {/* <Button variant="contained" onClick={()=>{handleAddButton()}} >Add New</Button> */}

          <DataGrid

            style={{ padding: 20 }}
            columns={columns}
            rows={employees}
            getRowId={(row) => row.prtcpnt_id}
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
          setShow={setShow}
        />
      )}
      {isEditing && (
        <Edit
          setShow={setShow}
          selectedEmployee={selectedEmployee}
          setIsEditing={setIsEditing}
          allowPre={allowPre}
        />
      )}
    </div>
  );
};

export default ParticipantProfiles;
