import React, { useState, useEffect, useContext } from 'react';

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import SettingsIcon from '@mui/icons-material/Settings';

import { DataGrid, GridToolbarContainer,  GridToolbarFilterButton, GridToolbarExport } from '@mui/x-data-grid';
import Swal from 'sweetalert2';
import Add from './Add';
import Edit from './Edit';
import AuthContext from 'views/Login/AuthContext';
import { Box } from '@mui/system';
import { useNavigate } from 'react-router';
// import { log } from 'util';
import { BASE_URL, COMMON_GET_FUN, companyId } from 'helper/ApiInfo';

const Dashboard = ({selectedEmployeeName,participantId,setShow, show}) => {
  
  useEffect(()=>{
    if(show){
      setShow(false)
    }
  },[])
  const [employees, setEmployees] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDelete, setIsDelete] = useState(null);
  const {allowUser}=useContext(AuthContext)
  const navigate =useNavigate();
  const allowPre= allowUser.find((data)=>{
    // console.log(data);
     if(data.user === "Documents"){
      return {"add":data.add,"delete":data.delete,"edit":data.edit,"read":data.read}
     }
      
      
  })

  
  // console.log(selectedEmployeeName);
  const columns = [
   
    // { field:'doc_prtcpntname', headerName: 'Participant Name', width: 170 },
    { field:`staffName`, headerName: 'Staff Name', width: 170,
                    valueGetter: (params)=>{
                      // console.log(params);
                      return `${params.row.stf_firstname} ${params.row.stf_lastname}`
                     
                      
                    },   },
    { field: 'categorie_name', headerName: 'Category', width: 170 },
    { field: 'category_document_name', headerName: 'Type', width: 150 },
   
   
    { field:`name`, headerName: 'Expiry Date', width: 170,
                    renderCell: (params)=>{
                      console.log(params);
                      
                      if (params.row.dcmt_expdate === '0000-00-00') {
                        return <div className='commonCla grayClr'>No date</div>
                      } else {
                        const date = new Date(params.row.dcmt_expdate);
                        const day = date.getDate().toString().padStart(2, '0');
                        const month = (date.getMonth() + 1).toString().padStart(2, '0');
                        const year = date.getFullYear();
                        // Concatenate in the "dd/mm/yyyy" format
                        return <div className='commonCla redClr' >{`${day}/${month}/${year}`}</div>
                      }
                      
                    },   },
    {
      field: 'action',
      headerName: 'Action',
      width: 190,
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

    let endpoint = `getAllwithJoin?table=fms_stf_document&status=0&company_id=${companyId}`;

    const fetchData = async () => {
      try {
        let response = await COMMON_GET_FUN(BASE_URL, endpoint);
        if (response.status) {
          console.log(response.messages);
          if (Array.isArray(response.messages) && response.messages.length > 0) {
            const rowsWithIds = response.messages.map((row, index) => ({ ...row, id: index }));
            setEmployees(rowsWithIds);
          } else {
            setEmployees([]);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [isAdding, isEditing, isDelete]);


  const handleAddButton = () => {
    setIsAdding(true);
  };
  const handleEdit = async (id) => {
    console.log(id);
    try {
      const endpoint = `getWhereDocument?table=fms_stf_document&field=dcmt_id&id=${id}`
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
        let endpoint = `deleteStatus?table=fms_stf_document&field=dcmt_id&id=${id}&delete_status=dcmt_status&value=1`
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

  
  const settingPage=()=>{
   
    navigate('/staff-documents/settings')
  }

  const CustomToolbar = () => (
    <GridToolbarContainer >
    <h3 style={{fontSize:"1.285rem",fontWeight:"500"}}>Documents</h3>
     <Box sx={{ flexGrow: 1 }} />
    {/* <GridToolbarColumnsButton /> */}
     <SettingsIcon onClick={settingPage}  sx={{fontSize: 35, border: '1px solid #82868b',padding:"5px",color:"black",borderRadius:"5px",cursor:"pointer"}}/>
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
            getRowId={(row) => row.dcmt_id}
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
          />
        </>
      )}
          
      {isAdding && <Add setIsAdding={setIsAdding} setShow={setShow} />}
      {isEditing && <Edit selectedDocument={selectedDocument} setIsEditing={setIsEditing} setShow={setShow} />}
    </div>
  );
};

export default Dashboard;
