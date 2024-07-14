import React, { useState, useEffect, useContext } from 'react';

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';

import { DataGrid, GridToolbarContainer,  GridToolbarFilterButton, GridToolbarExport } from '@mui/x-data-grid';
import Swal from 'sweetalert2';
import Add from './Add';
import Edit from './Edit';
import AuthContext from 'views/Login/AuthContext';
import { Box } from '@mui/system';
import InfoIcon from '@mui/icons-material/Info';
import headerImg from  '../../../assets/images/supportImage3.c1e1320e.png'
import CloseIcon from '@mui/icons-material/Close';
import '../../../style/document.css'
import { BASE_URL, COMMON_GET_FUN, companyId } from 'helper/ApiInfo';
// import { log } from 'util';

const Dashboard = () => {
  
  const [employees, setEmployees] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDelete, setIsDelete] = useState(null);
  const {allowUser}=useContext(AuthContext)
  
  const allowPre= allowUser.find((data)=>{
    // console.log(data);
     if(data.user === "Resource"){
      return {"add":data.add,"delete":data.delete,"edit":data.edit,"read":data.read}
     }
      
      
  })

  // console.log(selectedEmployeeName);
  const columns = [
   
    // { field:'comm_prtcpntid', headerName: 'Client', width: 170 },
   
    { field:`name`, headerName: 'Date', width: 120,
                    valueGetter: (params)=>{
                      // console.log(params);
                        const date = new Date(params.row.resource_date);
                        const day = date.getDate().toString().padStart(2, '0');
                        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
                        const year = date.getFullYear();
                        // Concatenate in the "dd/mm/yyyy" format
                        return `${day}-${month}-${year}`;
                     
                      
                    },   },
                    { field: 'resource_title', headerName: 'Title', width: 120 },
                    { field: 'resource_type', headerName: 'Type', width: 120 },
               
    {
      field: 'action',
      headerName: 'Action',
      width: 250,
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
{
allowPre?.delete?<IconButton aria-label="delete" color="error" sx={{ m: 2 }} onClick={() => handleDelete(params.id)}>
<DeleteOutlineOutlinedIcon />
</IconButton>:""
}
       
        
        
        
      </strong>
      ),
    },
  ];

  useEffect(() => {
    fetchData();
  }, [isAdding, isEditing, isDelete]);

  const fetchData = async () => {
    try {
     
      const url = `${BASE_URL}getAll?table=fms_setting_resource&select=resource_id,resource_date,,resource_staff_id,resource_type,resource_title,company_id,resource_status,resource_status&company_id=${companyId}&fields=resource_status&status=0`;
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.status) {
        console.log(data.messages);
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

  const handleEdit = (id) => {
    const endpoint = `getWhere?table=fms_setting_resource&field=resource_id&id=${id}`;
    fetchSelected(BASE_URL, endpoint);
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
        console.log(data.messages);
        setSelectedDocument(data.messages);
        setIsEditing(true);
      }
    } catch (error) {
      console.error('Error fetching selected data:', error);
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
        let endpoint = `deleteStatus?table=fms_setting_resource&field=resource_id&id=${id}&delete_status=resource_status&value=1`
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

  const CustomToolbar = () => (
    <GridToolbarContainer >
    <h3 style={{fontSize:"1.285rem",fontWeight:"500"}}>Resource</h3>
     <Box sx={{ flexGrow: 1 }} />
    {/* <GridToolbarColumnsButton /> */}
    <GridToolbarFilterButton sx={{ border: '1px solid #82868b',width:"100px",color:"black",height:"35px" }} />
    {/* <GridToolbarDensitySelector /> */}
    <GridToolbarExport  sx={{ border: '1px solid #82868b',width:"100px",color:"black",height:"35px" }} />
    {      
    allowPre?.add ? <Button  variant="contained" onClick={()=>{handleAddButton()} } style={{margin: "0px 0px 0px auto"}} >Add New</Button>  :""
                              }


  </GridToolbarContainer>
  );

  return (
    <div className="container">
      
      {!isAdding && !isEditing && (
        <>
          <DataGrid
            columns={columns}
            rows={employees}
            style={{padding:20}}
            getRowId={(row) => row.resource_id}
            slots={{
              toolbar: CustomToolbar,
            }}
            sx={{
              m: 2,
              boxShadow:2,
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
          />
        </>
      )}


      {isAdding && <Add setIsAdding={setIsAdding} />}
      {isEditing && <Edit selectData={selectedDocument}setIsEditing={setIsEditing} allowPre={allowPre}/>}
    </div>
  );
};

export default Dashboard;
