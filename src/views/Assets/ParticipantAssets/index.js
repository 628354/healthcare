import React, { useState, useEffect, useContext } from 'react'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
//import LibraryAddOutlinedIcon from '@mui/icons-material/LibraryAddOutlined';
import InfoIcon from '@mui/icons-material/Info';

import {
  DataGrid /* GridToolbar */,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarExport,
} from '@mui/x-data-grid'

import VisibilityIcon from '@mui/icons-material/Visibility'
import Swal from 'sweetalert2'
import headerImg from  '../../../assets/images/supportImage3.c1e1320e.png'
import { Typography } from 'antd';

///import Table from './Table';
import Add from './Add'
import Edit from './Edit'
import AuthContext from 'views/Login/AuthContext'
import { Box } from '@mui/system'
import { Card, CardContent, CardHeader, CardMedia } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import {COMMON_GET_FUN,BASE_URL, companyId} from '../../../helper/ApiInfo'
//import { employeesData } from './data';

const Dashboard = ({ setShow, show }) => {
  const [employees, setEmployees] = useState([])
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isdelete, setIsDelete] = useState(null)
  const [showInfo,setShowInfo]=useState(false)

  // console.log(allowUser);
  const { allowUser } = useContext(AuthContext)

  const handleCardOpen=()=>{
    setShowInfo(!showInfo)
  }
  const handleCardClose=()=>{
    setShowInfo(false)
  }
  const allowPre = allowUser.find(data => {
    // console.log(data);
    if (data.user === 'Participant Assets') {
      return { add: data.add, delete: data.delete, edit: data.edit, read: data.read }
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
      field: `participantName`, headerName: 'Participant Name', width: 130,
      valueGetter: (params) => {
        // console.log(params);
        return `${params.row.prtcpnt_firstname} ${params.row.prtcpnt_lastname}`


      },
    },
    {
      field: `name`,
      headerName: 'Date',
      width: 180,
      valueGetter: params => {
        console.log(params)
        const date = new Date(params.row.prasets_date)
        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0') // Month is zero-based
        const year = date.getFullYear()
        // Concatenate in the "dd/mm/yyyy" format
        return `${day}/${month}/${year}`
      }
    },
    { field: 'prasets_name', headerName: 'Assets Name', width: 130 },
    { field: 'prasets_locatn', headerName: 'Location', width: 130 },
    {
      field: `staffName`, headerName: 'Staff ', width: 130,
      valueGetter: (params) => {
        // console.log(params);
        return `${params.row.stf_firstname} ${params.row.stf_lastname}`


      },
    },

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

  //  fetch participant data
  useEffect(() => {
    let endpoint = `getAllwithJoin?table=fms_prtcpntassets&status=0&company_id=${companyId}`;
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
  }, [isAdding, isEditing, isdelete])


  // edit participant 
  const handleEdit = id => {
  
    let endpoint = 'getAllwithJoinAssets?table=fms_prtcpntassets&field=prasets_id&id=' + id
    let response = COMMON_GET_FUN(BASE_URL, endpoint)
    response.then(data => {
      console.log(data.messages);
      if (data.status) {
        setSelectedDocument(data.messages)
        setIsEditing(true)
      }
    })
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
       
        let endpoint = `deleteStatus?table=fms_prtcpntassets&field=prasets_id&id=${id}&delete_status=prasets_status&value=1`
        
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

        /* const employeesCopy = employees.filter(employee => employee.id !== id);
        localStorage.setItem('employees_data', JSON.stringify(employeesCopy));
        setEmployees(employeesCopy); */
      }
    })
  }

 

  function CustomToolbar() {
    return (
      <GridToolbarContainer >
        <h3 style={{ fontSize: "1.285rem", fontWeight: "500" }}>Participant Asset <span><InfoIcon style={{cursor:"pointer"}}  onClick={handleCardOpen}/></span></h3>
        <Box sx={{ flexGrow: 1 }} />
        {/* <GridToolbarColumnsButton /> */}
        <GridToolbarFilterButton sx={{ border: '1px solid #82868b', width: "100px", color: "black", height: "35px" }} />
        {/* <GridToolbarDensitySelector /> */}
        <GridToolbarExport sx={{ border: '1px solid #82868b', width: "100px", color: "black", height: "35px" }} />
        {
          allowPre?.add ? <Button variant="contained" onClick={() => { handleAddButton() }} style={{ margin: "0px 0px 0px auto" }} >Add New</Button> : ""
        }
         {
  showInfo?<Card sx={{ width:'100%' }} className='ObCard' >
  <IconButton aria-label="settings" className='cardIcon'>
              <CloseIcon  onClick={handleCardClose}/>
            </IconButton>
            <div className='headerCard'>
            <CardMedia
          component="img"
         className='cardImg'
          image={headerImg}
          alt="Paella dish"
        />
      
  
        <CardContent>
        <CardHeader
          title="Introduction to Participant Assets"
          // subheader="September 14, 2016"
        />
          <Typography variant="body2" color="text.secondary">
          Easily add and keep track of your participant's personal assets and set yourself free from having any conflicts with participants later on. Simply provide the name, location and description of the asset and create a new entry.
          </Typography>
        </CardContent>
  
            </div>
  
       
      </Card>:''
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
            getRowId={row => row.prasets_id}
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
          //checkboxSelection
          />
          {/* <Table
            employees={employees}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          /> */}
        </>
      )}
      {isAdding && <Add setIsAdding={setIsAdding} setShow={setShow} />}
      {isEditing && <Edit setShow={setShow} selectedData={selectedDocument} setIsEditing={setIsEditing} allowPre={allowPre} />}
    </div>
  )
}

export default Dashboard
