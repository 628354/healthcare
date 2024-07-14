import React, { useState, useEffect, useContext } from 'react'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import SettingsIcon from '@mui/icons-material/Settings';

//import LibraryAddOutlinedIcon from '@mui/icons-material/LibraryAddOutlined';
import {
  DataGrid /* GridToolbar */,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarExport,
} from '@mui/x-data-grid'

import VisibilityIcon from '@mui/icons-material/Visibility'
import Swal from 'sweetalert2'

///import Table from './Table';
import Add from './Add'
import Edit from './Edit'
import AuthContext from 'views/Login/AuthContext'
import { Box } from '@mui/system'
import '../../../style/document.css'
import { useNavigate } from 'react-router'
import { BASE_URL } from 'helper/ApiInfo'
//import { employeesData } from './data';

const Dashboard = () => {
  const [employees, setEmployees] = useState([])
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isdelete, setIsDelete] = useState(null)

  // console.log(allowUser);
  const { allowUser } = useContext(AuthContext)

  const allowPre = allowUser.find(data => {
    // console.log(data);
    if (data.user === 'Sites') {
      return { add: data.add, delete: data.delete, edit: data.edit, read: data.read }
    }
  })


  // console.log(allowPre);
  const columns = [
  
    { field: 'site_name', headerName: 'Name', width: 130 },
    { field: 'site_location', headerName: 'Location', width: 130 },
    { field:`participan`, headerName: 'Participant', width: 130,
    valueGetter: (params)=>{
     const data =params?.row?.site_Participants?.split(',').length;
     console.log(data);
     return data;
     
     
      
    },   },
  

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
    let endpoint ='getAll?table=fms_setting_site&select=site_id,site_name,site_location,site_Participants'

   
    try{
      let response = getData(BASE_URL, endpoint)
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
    }catch(error){
      console.error("Error fetching data:", error);
    }
   
  }, [isAdding, isEditing, isdelete])

  const handleEdit = id => {
    //const [employee] = employees.filter(employee => employee.id === id);
    const endpoint = `getWhere?table=fms_setting_site&field=site_id&id=${id}`;

    try{
      let response = getSelected(BASE_URL, endpoint)
      response.then(data => {
        console.log(data.messages);
        if (data.status) {
          setSelectedDocument(data.messages)
          setIsEditing(true)
        }
      })

    }catch(error){
      console.error("Error fetching data:", error);

    }
   
  }

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
        let endpoint = 'deleteSelected?table=fms_prtcpnt_prgsnote&field=prgs_id&id=' + id
        let response = deleteRecorde(BASE_URL, endpoint)
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

        /* const employeesCopy = employees.filter(employee => employee.id !== id);
        localStorage.setItem('employees_data', JSON.stringify(employeesCopy));
        setEmployees(employeesCopy); */
      }
    })
  }

  async function getData (url, endpoint) {
    const response = await fetch(url + endpoint, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
        //'Content-Type': 'application/x-www-form-urlencoded',
      }
    })
    return response.json()
  }

  async function getSelected (url, endpoint) {
    const response = await fetch(url + endpoint, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
        //'Content-Type': 'application/x-www-form-urlencoded',
      }
    })
    return response.json()
  }

  async function deleteRecorde (url, endpoint) {
    const response = await fetch(url + endpoint, {
      method: 'GET', // *GET, POST, PUT, DELETE, etc.
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
        //'Content-Type': 'application/x-www-form-urlencoded',
      }
    })
    return response.json()
  }


  function CustomToolbar () {
    return (
      <GridToolbarContainer >
      <h3 style={{fontSize:"1.285rem",fontWeight:"500"}}>Sites</h3>
       <Box sx={{ flexGrow: 1 }} />
      {/* <GridToolbarColumnsButton /> */}

      <GridToolbarFilterButton sx={{ border: '1px solid #82868b',width:"100px",color:"black",height:"35px" }} />
      {/* <GridToolbarDensitySelector /> */}
      <GridToolbarExport  sx={{ border: '1px solid #82868b',width:"100px",color:"black",height:"35px" }} />
      {      
      allowPre?.add ? <Button  variant="contained" onClick={()=>{handleAddButton()} } style={{margin: "0px 0px 0px auto"}} >Add New</Button>  :""
                                }
    </GridToolbarContainer>
    )
  }

  return (
    <div className='container'>
      {!isAdding && !isEditing && (
        <>
          {/* <Button variant="contained" onClick={()=>{handleAddButton()}} >Add New</Button> */}

          <DataGrid
            style={{ padding: 20 }}
            columns={columns}
            rows={employees}
            getRowId={row => row.site_id}
            slots={{
              toolbar: CustomToolbar
            }}
            sx={{
              m: 2,
              boxShadow:2,
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
            //checkboxSelection
          />
          {/* <Table
            employees={employees}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          /> */}
        </>
      )}
      {isAdding && <Add setIsAdding={setIsAdding}/>}
      {isEditing && <Edit  selectedData={selectedDocument} setIsEditing={setIsEditing} allowPre={allowPre} />}
    </div>
  )
}

export default Dashboard
