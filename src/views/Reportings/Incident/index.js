import React, { useState, useEffect, useContext } from 'react'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
//import LibraryAddOutlinedIcon from '@mui/icons-material/LibraryAddOutlined';
import {
  DataGrid /* GridToolbar */,
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarExport,
}from '@mui/x-data-grid'

import VisibilityIcon from '@mui/icons-material/Visibility'
import Swal from 'sweetalert2'

///import Table from './Table';
import Add from './Add'
import Edit from './Edit'
import AuthContext from 'views/Login/AuthContext'
import { Box } from '@mui/system'
import '../../../style/document.css'

import { BASE_URL, COMMON_GET_FUN,  } from 'helper/ApiInfo';

//import { employeesData } from './data';
const Dashboard = ({ setShow, show,divShadow,participantId}) => {
  const [employees, setEmployees] = useState([])
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isdelete, setIsDelete] = useState(null)

  // //console.log(allowUser);
  const { allowUser,companyId} = useContext(AuthContext)

  const allowPre = allowUser.find(data => {
    // //console.log(data);
    if (data.user === 'Incident') {
      return { add: data.add, delete: data.delete, edit: data.edit, read: data.read }
    }
  })

  useEffect(() => {
    if (show) {
      setShow(false)
    }
  }, [])

  // //console.log(allowPre);
  const columns = [
    { field:`participantName`, headerName: 'Participant Name', width: 130,
    valueGetter: (params)=>{
      // //console.log(params);
      return `${params.row.prtcpnt_firstname} ${params.row.prtcpnt_lastname}`
     
      
    },   },
    {
      field: `name`,
      headerName: 'Date',
      width: 180,
      valueGetter: params => {
        //console.log(params)
        const date = new Date(params.row.incdnt_date)
        const day = date.getDate().toString().padStart(2, '0')
        const month = (date.getMonth() + 1).toString().padStart(2, '0') // Month is zero-based
        const year = date.getFullYear()
        // Concatenate in the "dd/mm/yyyy" format
        return `${day}/${month}/${year}`
      }
    },
   
  
    { field: 'incdnt_type', headerName: 'Incident Type', width: 130 },
    { field: 'closure_status', headerName: 'Status', width: 130 },
  

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

    let endpoint = `joinWithReportingList?table=fms_prtcpnt_incident&status=0&company_id=${companyId}`;

    const fetchData = async () => {
      try {
        let data = await COMMON_GET_FUN(BASE_URL, endpoint);
        if (data.status) {
          if(participantId){
         const filterData= data?.messages?.filter((item)=>{
            return item.incdnt_prtcpntid === participantId

          })
          setEmployees(filterData)
          }else{
            setEmployees(data.messages)

          }
        }else{
          setEmployees([])
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [isAdding, isEditing, isdelete]);

  const handleEdit = async (id) => {
    try {
      const endpoint = `editReportingData?table=fms_prtcpnt_incident&field=incdnt_id&id=${id}`
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
        let endpoint = `deleteStatus?table=fms_prtcpnt_incident&field=incdnt_id&id=${id}&delete_status=incdnt_status&value=1`
        let response = COMMON_GET_FUN(BASE_URL, endpoint)
        response.then(data => {
          if (data.status){
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

  function CustomToolbar () {
    return (
      <GridToolbarContainer >
      <h3 style={{fontSize:"1.285rem",fontWeight:"500"}}>Incidents</h3>
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
className={employees.length<1?"hide_tableData":""}




            style={{ padding: 20 }}
            columns={columns}
            rows={employees}
            getRowId={row => row.incdnt_id}
            slots={{
              toolbar: CustomToolbar
            }}
            sx={{
              m: 2,
              boxShadow: divShadow? 0:2,
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
      {isAdding && <Add setIsAdding={setIsAdding} setShow={setShow} show={show} participantId={participantId}/>}
      {isEditing && <Edit setShow={setShow} show={show}  selectedData={selectedDocument} participantId={participantId}setIsEditing={setIsEditing} allowPre={allowPre} />}
    </div>
  )
}

export default Dashboard
