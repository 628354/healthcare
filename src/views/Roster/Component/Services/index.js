import React, { useState, useEffect, useContext } from 'react'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import {
  DataGrid /* GridToolbar */,
  GridToolbarContainer,
  GridToolbarFilterButton,  
  GridToolbarExport,
} from '@mui/x-data-grid'

import VisibilityIcon from '@mui/icons-material/Visibility'
import Swal from 'sweetalert2'

import Add from './Add'
import Edit from './Edit'
import AuthContext from 'views/Login/AuthContext'
import { Box } from '@mui/system'
import '../../../../style/document.css'
import { BASE_URL, COMMON_GET_FUN,  } from 'helper/ApiInfo'

const Dashboard = ({}) => {
  const [employees, setEmployees] = useState([])
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isdelete, setIsDelete] = useState(null)
  const [showInfo, setShowInfo] = useState(false)

  const { allowUser,companyId} = useContext(AuthContext)

  const allowPre = allowUser.find(data => {
    // //console.log(data);
    if (data.user === 'Roster') {
      return { add: data.add, delete: data.delete, edit: data.edit, read: data.read}
    }
  })

  const columns = [
    {
      field: 'service_code',
      headerName: 'Code',
      width: 200,
    },
    {
      field: `services_name`, headerName: 'Name', width:250,
    },

    { field: 'rate_type', headerName: 'Rate Type', width: 130 },
    { field: `price`, headerName: 'Price ', width: 130, },

    {
      field: 'action',
      headerName: 'Action',
      minWidth: 200,
      renderCell: params => (
        <strong>
          {allowPre?.edit ? (
            <IconButton aria-label='edit' color='primary' onClick={() => handleEdit(params.id)}>
              <EditNoteOutlinedIcon />
            </IconButton>
          ) : allowPre?.read ? (
            <IconButton aria-label='edit' color='primary' onClick={() => handleEdit(params.id)}>
              <VisibilityIcon />
            </IconButton>
          ) : (
            ''
          )}
          {/* {
                            
            allowPre?.read?<IconButton aria-label="edit" color="primary" onClick={() => handleEdit(params.id)}>
            <VisibilityIcon />
          </IconButton>:""
          } */}
          {allowPre?.delete ? (
            <IconButton aria-label='delete' color='error' sx={{ m: 2 }} onClick={() => handleDelete(params.id)}>
              <DeleteOutlineOutlinedIcon />
            </IconButton>
          ) : (
            ''
          )}
        </strong>
      )
    }
  ]

  useEffect(() => {

    let endpoint = 'getAll?table=services&select=services_name,services_id,rate_type,service_code,price';

    const fetchData = async () => {
      try {
        let response = await COMMON_GET_FUN(BASE_URL, endpoint);
        if (response.status) {
          if (Array.isArray(response.messages) && response.messages.length > 0) {
            const rowsWithIds = response.messages.map((row, index) => ({ ...row, id: index }));
            //console.log(rowsWithIds);
            setEmployees(rowsWithIds);
          } else {
            setEmployees([]);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        // Optionally, handle the error state here
      }
    };

    fetchData();
  }, [isAdding, isEditing, isdelete]);



  const handleEdit = async (id) => {
    try {
      let endpoint = 'getWhere?table=services&field=services_id&id=' + id;
      let response = await COMMON_GET_FUN(BASE_URL, endpoint);
      
      if (response.status) {
        setSelectedDocument(response.messages);
        setIsEditing(true);
      } else {
        console.error('Request was not successful:', response.error); 
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      
    }
  };
  

  const handleAddButton = () => {
    setIsAdding(true)
  }

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
        let endpoint = `deleteStatus?table=services&field=services_id&id=${id}&delete_status=services_status&value=1`
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
  }

  function CustomToolbar() {
    return (
      <GridToolbarContainer >
        <h3 style={{ fontSize: "1.285rem", fontWeight: "500" }}>Services</h3>
        
        {
          allowPre?.add ? <Button variant="contained" onClick={() => { handleAddButton() }} style={{ margin: "0px 0px 0px auto" }} >Add New</Button> : ""
        }
         <IconButton className='services_delete' aria-label='delete' color='error' sx={{ m: 2 }} onClick={() => handleDelete(params.id)}>
              <DeleteOutlineOutlinedIcon />
            </IconButton>



        
      </GridToolbarContainer>
    )
  }

  return (
    <div className='container'>
      {!isAdding && !isEditing && (
        <>
          {/* <Button variant="contained" onClick={()=>{handleAddButton()}} >Add New</Button> */}

                  <DataGrid
className={employees.length<1?"hide_tableData":""}




            style={{ padding: 20 }}
            columns={columns}
            rows={employees}
            getRowId={row => row.services_id}
            slots={{
              toolbar: CustomToolbar
            }}
            sx={{
              m: 2,
              boxShadow: 2,
              border: 0,
              borderColor: 'primary.light',
              '& .MuiDataGrid-cell:hover': {
                color: 'primary.main'
              }
            }}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 }
              }
            }}
            pageSizeOptions={[10, 25, 50, 100]}
          />
          {/* <Table
            employees={employees}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          /> */}
        </>
      )}
      {isAdding && <Add setIsAdding={setIsAdding}  />}
      {isEditing && <Edit selectedData={selectedDocument} setIsEditing={setIsEditing} allowPre={allowPre} />}
    </div>
  )
}

export default Dashboard
