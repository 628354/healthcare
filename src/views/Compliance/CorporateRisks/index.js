import React, { useState, useEffect, useContext } from 'react';

import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';
import '../../../style/document.css'
import { DataGrid, GridToolbarContainer,  GridToolbarFilterButton, GridToolbarExport } from '@mui/x-data-grid';
import Swal from 'sweetalert2';
import Add from './Add';
import Edit from './Edit';
import AuthContext from 'views/Login/AuthContext';
import { Box } from '@mui/system';
// import { log } from 'util';
import {COMMON_GET_FUN,BASE_URL, companyId} from '../../../helper/ApiInfo'

const RiskIndex = ({ setShow, show }) => {
  

  const [employees, setEmployees] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDelete, setIsDelete] = useState(null);
  const {allowUser}=useContext(AuthContext)

  const allowPre= allowUser.find((data)=>{
     if(data.user === "Corporate Risks"){
      return {"add":data.add,"delete":data.delete,"edit":data.edit,"read":data.read}
     }
      
      
  })
  
  // console.log(selectedEmployeeName);
  const columns = [
   

    // { field:'rsk_prtcpntid', headerName: 'Participant', width: 170 },
    { field:`corp_stfid`, headerName: 'Documented By', width: 170,
                    valueGetter: (params)=>{
                      // console.log(params);
                      return `${params.row.stf_firstname} ${params.row.stf_lastname}`
                     
                      
                    },   },
  
   
   

    { field: 'corp_level', headerName: 'Level Of Risk', width: 160, renderCell: (params) => {
     
      if (params.value === 'Medium') {
        return <div className='commonCla orangeClr'>{params.value}</div>;
      } else if (params.value === 'Low') {
        return <div className='commonCla greenClr'>{params.value}</div>;

      } else if (params.value === 'High') {
                return <div className='commonCla redClr'>{params.value}</div>;

      }
      
    }
  },
                    { field: 'corp_dscrptn', headerName: 'Risk Description', width: 250 },
                    { 
                      field:`name`, 
                      headerName: 'Next Review Date', 
                      width: 170,
                      renderCell: (params)=>{
                        
                        const currentDate = new Date();
                        const reviewDate = new Date(params.row.corp_rvudate);
                        const day = reviewDate.getDate().toString().padStart(2, '0');
                        const month = (reviewDate.getMonth() + 1).toString().padStart(2, '0'); 
                        const year = reviewDate.getFullYear();

                        if (params.row.corp_rvudate === '0000-00-00') {
                        
                          return <div className='commonCla grayClr'>No date</div>;
                        } 
                         // Check if the review date is in the future
                       

                        if (reviewDate >= currentDate) {
                          return <div className='commonCla greenClr' >{`${day}/${month}/${year}`}</div>
                        } else {
                          return <div className='commonCla redClr' >{`${day}/${month}/${year}`}</div>

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
    if (show) {
      setShow(false)
    }
  }, [])
  useEffect(() => {
    let endpoint = `joinWithComplianceList?table=fms_corprisk&status=0&company_id=${companyId}`;
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
  }, [isAdding, isEditing, isDelete])


  const handleEdit = id => {
    const endpoint = 'getWhere?table=fms_corprisk&field=corp_id&id='+id;

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
       
        let endpoint = `deleteStatus?table=fms_corprisk&field=corp_id&id=${id}&delete_status=corp_status&value=1`
        
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




  const CustomToolbar = () => (
    <GridToolbarContainer >
    <h3 style={{fontSize:"1.285rem",fontWeight:"500"}}>Corporate Risk</h3>
     <Box sx={{ flexGrow: 1 }} />
    <GridToolbarFilterButton sx={{ border: '1px solid #82868b',width:"100px",color:"black",height:"35px" }} />
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
className={employees.length<1?"hide_tableData":""}




            columns={columns}
            rows={employees}
            style={{padding:20}}
            getRowId={(row) => row.corp_id }
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
      {isAdding && <Add setIsAdding={setIsAdding}  setShow={setShow} />}
      {isEditing && <Edit selectedData={selectedDocument}  setShow={setShow} setIsEditing={setIsEditing} />}
    </div>
  );
};

export default RiskIndex;
