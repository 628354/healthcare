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
import { useNavigate } from 'react-router';
import { BASE_URL, COMMON_GET_FUN, companyId } from 'helper/ApiInfo';
// import { log } from 'util';

const Dashboard = ({participantId,divShadow,setShow, show}) => {
 const navigate = useNavigate()
 
const id = participantId
  const [employees, setEmployees] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDelete, setIsDelete] = useState(null);
  const {allowUser}=useContext(AuthContext)

  const allowPre= allowUser.find((data)=>{
    // console.log(data);
     if(data.user === "RP Register"){
      return {"add":data.add,"delete":data.delete,"edit":data.edit,"read":data.read}
     }
      
      
  })

  useEffect(() => {
    if (show) {
      setShow(false)
    }
  }, [])

  // console.log(selectedEmployeeName);
  const columns = [
   
   
    { field:`participant`, headerName: 'Participant Name', width: 170,
                    valueGetter: (params)=>{
                      // console.log(params);
                      return `${params.row.prtcpnt_firstname} ${params.row.prtcpnt_lastname}`
                     
                      
                    },   },
  
   
   
    { field:`name`, headerName: 'Start Date', width: 180,
                    valueGetter: (params)=>{
                      console.log(params);
                        const date = new Date(params.row.rpreg_strtdate);
                        const day = date.getDate().toString().padStart(2, '0');
                        const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
                        const year = date.getFullYear();
                        // Concatenate in the "dd/mm/yyyy" format
                        return `${day}/${month}/${year}`;
                     
                      
                    },   },
                    { field:`res_prac_name`, headerName: 'Type', width: 170,
                    valueGetter: (params)=>{
                      // console.log(params);
                      return `${params.row.res_prac_name}`
                     
                      
                    },   },
                  
                    { field: 'rpreg_auth', headerName: 'Is Authorised', width: 160 },
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
    try {
      let endpoint = `getAllwithJoin?table=fms_prtcpnt_rpregistration&status=0&company_id=${companyId}`;
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
  }, [isAdding, isEditing, isDelete])


  const handleEdit = id => {
    try {
      const endpoint = `getWhere?table=fms_prtcpnt_rpregistration&field=rpreg_id&id=${id}`;

      let response = COMMON_GET_FUN(BASE_URL, endpoint)
      response.then(data => {
        if (data.status) {
          setSelectedDocument(data.messages)
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
        let endpoint = `deleteStatus?table=fms_prtcpnt_rpregistration&field=rpreg_id&id=${id}&delete_status=rpreg_status&value=1`
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


  const CustomToolbar = () => (
    <GridToolbarContainer >
    <h3 style={{fontSize:"1.285rem",fontWeight:"500"}}>Restrictive Practice Register</h3>
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
    <div className="container profiel_rp">
      {!isAdding && !isEditing && (
        <>
          <DataGrid
            columns={columns}
            rows={employees}
            style={{padding:20}}
            getRowId={(row) => row.rpreg_id}
            slots={{
              toolbar: CustomToolbar,
            }}
            sx={{
              m: 2,
              boxShadow: divShadow? 0:2,
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
      {isAdding && <Add setIsAdding={setIsAdding} setShow={setShow} show={show} participantId={id}/>}
      {isEditing && <Edit selectedRP={selectedDocument} setShow={setShow}  participantId={id}show={show} setIsEditing={setIsEditing} allowPre={allowPre}/>}
    </div>
  );
};

export default Dashboard;
