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
import CloseIcon from '@mui/icons-material/Close';
// import Add from './Add'
// import Edit from './Edit'
import AuthContext from 'views/Login/AuthContext'
import { Box } from '@mui/system'
import '../../../style/Roster.css'
import { BASE_URL, COMMON_GET_FUN, COMMON_NEW_ADD, COMMON_UPDATE_FUN, companyId } from 'helper/ApiInfo'
import { Stack, TextField } from '@mui/material'


const Dashboard = () => {

  const [employees, setEmployees] = useState([])
  const [selectedDocument, setSelectedDocument] = useState(null)
  const [isAdding, setIsAdding] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isdelete, setIsDelete] = useState(null)
  const [showAddPopup, setShowAddPopup] = useState(false)


  const [payName,setPayName]=useState('')

  const { allowUser,companyId} = useContext(AuthContext)

  const handleShowPopup=()=>{
    setShowAddPopup(true)
    setIsAdding(true)
  }
  
  const handleClosePopup=()=>{
    setShowAddPopup(false)
    setIsEditing(false)
    setIsAdding(false)

  }
  const allowPre = allowUser.find(data => {
    // //console.log(data);
    if (data.user === 'Roster') {
      return { add: data.add, delete: data.delete, edit: data.edit, read: data.read}
    }
  })

  const columns = [
    
    {
      field: `pay_level_name`, headerName: 'Name', width: 500,
      
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

  //console.log(isEditing);
  
  useEffect(()=>{
    //console.log(isAdding);
    //console.log(isEditing);
if(isEditing && isAdding === false ){
  setPayName(selectedDocument.pay_level_name)
}else{
  setPayName("")
}
   
  },[isEditing,isAdding])


  useEffect(() => {

    let endpoint = 'getAll?table=fms_staff_pay_levels&select=pay_level_id,pay_level_name';

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

  
const id =selectedDocument?.pay_level_id
  const handleEdit = async (id) => {
    try {
      let endpoint = 'getWhere?table=fms_staff_pay_levels&field=pay_level_id&id=' + id;
      let response = await COMMON_GET_FUN(BASE_URL, endpoint);
      
      if (response.status) {
        setSelectedDocument(response.messages);
      
       
        setIsEditing(true);
        setShowAddPopup(true)
      } else {
        console.error('Request was not successful:', response.error); 
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      
    }
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
        let endpoint = `deleteStatus?table=fms_meeting&field=meet_id&id=${id}&delete_status=meet_status&value=1`
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
        <h3 style={{ fontSize: "1.285rem", fontWeight: "500" }}>Pay Levels</h3>
        <Box sx={{ flexGrow: 1 }} />
        {
          allowPre?.add ? <Button variant="contained" onClick={handleShowPopup} style={{ margin: "0px 0px 0px auto" }} >Add New</Button> : ""
        }
        



        
      </GridToolbarContainer>
    )
  }


//   add pay level

const handleAdd = e => {
    e.preventDefault();
   
    const emptyFields = [];
    if (!payName) {
      emptyFields.push('Pay Level');
    }
   
    if (emptyFields.length > 0) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: `Please fill in the required fields: ${emptyFields.join(', ')}`,
        showConfirmButton: true,
      });
    }

 


    const data = {
      
        pay_level_name:payName,
      company_id:companyId
         
    }

    let endpoint = 'insertData?table=fms_staff_pay_levels';
    let response = COMMON_NEW_ADD(BASE_URL,endpoint,data);
      response.then((data)=>{
          if(data.status){
            Swal.fire({
              icon: 'success',
              title: 'Added!',
              text: `data has been Added.`,
              showConfirmButton: false,
              timer: 1500,
            })
            setShowAddPopup(false)
            setIsAdding(false);
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

  const handleUpdate = e => {
    e.preventDefault();
   
    const emptyFields = [];
    if (!payName) {
      emptyFields.push('Pay Level');
    }
   
    if (emptyFields.length > 0) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: `Please fill in the required fields: ${emptyFields.join(', ')}`,
        showConfirmButton: true,
      });
    }

 

    const formData = new FormData()
    formData.append('pay_level_name', payName)


    let endpoint = 'updateAll?table=fms_staff_pay_levels&field=pay_level_id&id=' + id
    let response = COMMON_UPDATE_FUN(BASE_URL, endpoint, formData)
    response.then(data => {
      if (data.status) {
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: `data has been Updated.`,
          showConfirmButton: false,
          timer: 1500
        })
        setShowAddPopup(false)
        setIsEditing(false)
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Something Went Wrong.',
          showConfirmButton: true
        })
      }
    })
  };

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
            getRowId={row => row.pay_level_id}
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
      {
        showAddPopup?
        
        <div className='modal-overlay'> <div className='payLevel_popup'>
        <div className='payLevel_header_sec'>
          {isEditing? <p className='payLevel_header'>Update Pay Level</p>:<p className='payLevel_header'>Create Pay Level</p>}
            <div className='payleve_close_btn' onClick={handleClosePopup}><CloseIcon/></div>
        </div>
        <Box
            component='form'
            className='pay_form'
            noValidate
            autoComplete='off'
            onSubmit={isEditing?handleUpdate:handleAdd}
          >
            
            <TextField
            className='nameField'
              label='Name'
              type='text'
              id='name'
              value={payName}
              onChange={(e)=>{setPayName(e.target.value)}}
            />
    
            <Box className="form_footer_btn">
              <Stack direction='row-reverse' spacing={2}>
              <Button variant='outlined' type='submit'>
                 {isEditing?"Update":"Create"} 
                </Button>
                <Button variant='outlined' color='error'  type='button' onClick={handleClosePopup}>
                  Cancel
                </Button>
              
    
                
              </Stack>
            </Box>
          </Box>
    
    
    </div></div>
       :""
      }


    </div>
  )
}

export default Dashboard
