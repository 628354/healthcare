import React, { useState, useEffect, useContext } from 'react';

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AddIcon from '@mui/icons-material/Add';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField } from '@mui/material';
import { DataGrid, GridToolbarContainer,  GridToolbarFilterButton, GridToolbarExport } from '@mui/x-data-grid';
import Swal from 'sweetalert2';
// import Add from './Add';
// import Edit from './Edit';
import AuthContext from 'views/Login/AuthContext';
import { Box } from '@mui/system';
import InfoIcon from '@mui/icons-material/Info';
import { Card, CardContent, CardHeader, CardMedia } from '@mui/material';
import { Typography } from 'antd';
import headerImg from  '../../../../assets/images/supportImage3.c1e1320e.png'
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CloseIcon from '@mui/icons-material/Close';
import '../../../../style/document.css'
// import { log } from 'util';

const Dashboard = () => {
  

  const [employees, setEmployees] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDelete, setIsDelete] = useState(null);
  const {allowUser}=useContext(AuthContext)
  const [showInfo,setShowInfo]=useState(false)
  const [open, setOpen] = useState(false);

  const [customFieldLabel, setCustomFieldLabel] = useState();
  const [EditustomFieldLabel, setEditCustomFieldLabel] = useState();
 
  const [companyId,setCompanyId]=useState(null)
//get company from local storeage 
useEffect(() => {
  const staff = localStorage.getItem('user')

  if (staff) {
    const convert = JSON.parse(staff)
    const id=convert?.stf_id
   
    setCompanyId(id)

  }
}, [])


  //open add field form
  const handleClose = () => {
    setOpen(false);
    if(customFieldLabel){
      setCustomFieldLabel(null)
    }
  
  };

  const handleOpen = () => {
    setOpen(true);
  };



  const allowPre= allowUser.find((data)=>{
    // console.log(data);
     if(data.user === "Weight"){
      return {"add":data.add,"delete":data.delete,"edit":data.edit,"read":data.read}
     }
      
      
  })
  
  // console.log(selectedEmployeeName);
  const columns = [
   
   
                    { field: 'custom_fields_label', headerName: 'Label', width: 200 },

                   
    {
      field: 'action',
      headerName: 'Action',
      width: 200,
      renderCell: (params) => (
        <strong >
        {
          allowPre?.edit? <IconButton aria-label="edit" color="primary" onClick={() => handleEdit(params.id)}>
        <EditNoteOutlinedIcon /> 
        </IconButton>:(allowPre?.read? <IconButton aria-label="edit" color="primary" onClick={() => handleEdit(params.id)}>
           <VisibilityIcon />
        </IconButton>:"")
        }
         {/* {
          
allowPre?.read?<IconButton aria-label="edit" color="primary" onClick={() => handleEdit(params.id)}>
<VisibilityIcon />
</IconButton>:""
} */}
<IconButton aria-label="delete" color="error" sx={{ m: 2 }} onClick={() => handleDelete(params.id)}>
<DeleteOutlineOutlinedIcon />
</IconButton>
       
        
        
        
      </strong>
      ),
    },
  ];



  const fetchData = async () => {
    try {
      const url = `https://tactytechnology.com/mycarepoint/api/getAll?table=custom_fields&select=custom_fields_id,company_id,custom_fields_label`;
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.status) {
        if (Array.isArray(data.messages) && data.messages.length > 0) {
          const rowsWithIds = data.messages.map((row, index) => ({ ...row, id: index }));
          setEmployees(rowsWithIds);
        } else {
          setEmployees([]);
        }
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [isAdding]);

  const handleEdit = (id) => {
    
    const url = "https://tactytechnology.com/mycarepoint/api/";
    const endpoint = `getWhere?table=custom_fields&field=custom_fields_id&id=${id}`;
    fetchSelected(url, endpoint);
  };

  const fetchSelected = async (url, endpoint) => {
    try {
      const response = await fetch(url + endpoint, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
    
      if (data.status) {
        setOpen(true)
        console.log(data.messages);
        setSelectedDocument(data.messages?.custom_fields_id)
        setCustomFieldLabel(data.messages?.custom_fields_label);
        setIsEditing(true);
      }
    } catch (error) {
      console.error('Error fetching selected data:', error);
    }
  };


  const handleDelete = (id) => {
    Swal.fire({
      icon: 'warning',
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'No, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        const url = "https://tactytechnology.com/mycarepoint/api/";
        const endpoint = `deleteSelected?table=fms_weight&field=wgt_id&id=${id}`;
        deleteRecord(url, endpoint);
      }
    });
  };

  const deleteRecord = async (url, endpoint) => {
    try {
      const response = await fetch(url + endpoint, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.status) {
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: `Record data has been deleted.`,
          showConfirmButton: false,
          timer: 1500,
        });
        setIsDelete(id);
      }
    } catch (error) {
      console.error('Error deleting record:', error);
    }
  };
  const handleAdd = e => {
    e.preventDefault();
   
    const emptyFields = [];

    // Simple form validation
    if (!customFieldLabel) {
      emptyFields.push('Date');
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
           
      custom_fields_label:customFieldLabel,     
      company_id:companyId
      
         
    }
  
    
    let url="https://tactytechnology.com/mycarepoint/api/";
    let endpoint = 'insertData?table=custom_fields';
    let response = add(url,endpoint,data);
      response.then((data)=>{
          // console.log(data.status);
          // console.log("check",data)
          //return data;
          if(data.status){
            Swal.fire({
              icon: 'success',
              title: 'Added!',
              text: `data has been Added.`,
              showConfirmButton: false,
              timer: 1500,
            });
            setIsAdding(true);
            setOpen(false);
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
    e.preventDefault()

  
    

    const formData = new FormData()
    formData.append('custom_fields_label', customFieldLabel)
    



    let url = 'https://tactytechnology.com/mycarepoint/api/'
    let endpoint = 'updateAll?table=custom_fields&field=custom_fields_id&id=' + selectedDocument
    let response = update(url, endpoint, formData)
    response.then(data => {
      // console.log(data,"hbhjjk");
      //return data;
      if (data.status) {
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: `data has been Updated.`,
          showConfirmButton: false,
          timer: 1500
        })
        setIsEditing(false)
        setOpen(false);
        setCustomFieldLabel("")
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Something Went Wrong.',
          showConfirmButton: true
        })
      }
    })
  }
  async function add(url,endpoint,data){
    // console.log(data);
    // console.log('console from function');
   const response =  await fetch( url+endpoint,{
                                method: "POST", // *GET, POST, PUT, DELETE, etc.
                                mode: "cors",
                                headers: {
                                  "Content-Type": "application/json",
                                  //'Content-Type': 'application/x-www-form-urlencoded',
                                },
                                body: JSON.stringify(data), // body data type must match "Content-Type" header
                              }); 
    return response.json();
} 
async function update (url, endpoint, formData) {
  //console.log(data);
  // console.log('console from function');
  const response = await fetch(url + endpoint, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors',
    /* headers: {
                        "Content-Type": "application/json",
                        //'Content-Type': 'application/x-www-form-urlencoded',
                      }, */
    body: formData // body data type must match "Content-Type" header
  })
  // console.log("done")
  return response.json()
} 

  const CustomToolbar = () => (
    <GridToolbarContainer >
    <h3 style={{fontSize:"1.285rem",fontWeight:"500"}}>Custom Fields<span></span></h3>
     
  
    {      
    allowPre?.add ? <Button  variant="contained" onClick={handleOpen}style={{margin: "0px 0px 0px auto"}} > <AddIcon/>Add New</Button>  :""
                              }


  </GridToolbarContainer>
  );
  

  return (
    <div className="container">
      
      {/* {!isAdding && !isEditing && ( */}
        <>
        <h3>Progress Note Settings</h3>
                  <DataGrid
className={employees.length<1?"hide_tableData":""}




            columns={columns}
            rows={employees}
            style={{padding:20}}
            getRowId={(row) => row.custom_fields_id}
            slots={{
              toolbar: CustomToolbar,
            }}
            sx={{
              width:'500px',
              m: 2,
              boxShadow: 2,
              border: 0,
              borderColor: 'primary.light',
              '& .MuiDataGrid-cell:hover': {
                color: 'primary.main',
              },
            }}
           
          />
        </>
      {/* )} */}
     
      <div className="prog_container">
      {open && (
        <div className="prog_dialog-container">
          <div className="prog_dialog">
            <div className="prog_dialog-title">
            {
                customFieldLabel? <h2>Edit Custom Field</h2>:<h2>Add Custom Field</h2>
                }
              
              <button aria-label="close" onClick={handleClose}>
                <CloseIcon />
              </button>
            </div>
            <div className="prog_dialog-content">
              <TextField label="Field Label" fullWidth value={customFieldLabel}  onChange={e => {
            setCustomFieldLabel(e.target.value)
          }}/>
            </div>
            <div className="prog_dialog-actions">
              <Button onClick={handleClose} color="error">
                Cancel
              </Button>

              {
                customFieldLabel?  <Button onClick={handleUpdate} color="primary">
                update
              </Button>
              :
               <Button onClick={handleAdd} color="primary">
               Create
             </Button>
              }
             
            </div>
          </div>
        </div>
      )}
    </div>




      {/* {isAdding && <Add setIsAdding={setIsAdding}  setShow={setShow} />} */}
      {/* {isEditing && <Edit selectData={selectedDocument}  setShow={setShow} setIsEditing={setIsEditing} allowPre={allowPre}/>} */}
    </div>
  );
};

export default Dashboard;
