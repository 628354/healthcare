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
import { BASE_URL, COMMON_GET_FUN, companyId } from 'helper/ApiInfo';
// import { log } from 'util';

const RiskIndex = ({setShow, show}) => {
  

  const [employees, setEmployees] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDelete, setIsDelete] = useState(null);
  const {allowUser,companyId}=useContext(AuthContext)
  const { finalPath } = useContext(AuthContext);

  //console.log(finalPath);
  const allowPre= allowUser.find((data)=>{
     if(data.user === "Risk Assessments"){
      return {"add":data.add,"delete":data.delete,"edit":data.edit,"read":data.read}
     }
      
      
  })
  
  // //console.log(selectedEmployeeName);
  const columns = [
   

    // { field:'rsk_prtcpntid', headerName: 'Participant', width: 170 },
    { field:`rsk_prtcpntid`, headerName: 'Participant', width: 170,
                    valueGetter: (params)=>{
                      // //console.log(params);
                      return `${params.row.prtcpnt_firstname} ${params.row.prtcpnt_lastname}`
                     
                      
                    },   },
  
   
   

    { field: 'rsk_level', headerName: 'Level Of Risk', width: 160, renderCell: (params) => {
     
      if (params.value === 'Medium') {
        return <div className='commonCla orangeClr'>{params.value}</div>;
      } else if (params.value === 'Low') {
        return <div className='commonCla greenClr'>{params.value}</div>;

      } else if (params.value === 'High') {
                return <div className='commonCla redClr'>{params.value}</div>;

      }
      
    }
  },
                    { field: 'rsk_dscrptn', headerName: 'Risk Description', width: 250 },
                    { 
                      field:`name`, 
                      headerName: 'Next Review Date', 
                      width: 170,
                      renderCell: (params)=>{
                        
                        const currentDate = new Date();
                        const reviewDate = new Date(params.row.rsk_rvudate);
                        const day = reviewDate.getDate().toString().padStart(2, '0');
                        const month = (reviewDate.getMonth() + 1).toString().padStart(2, '0'); 
                        const year = reviewDate.getFullYear();

                        if (params.row.rsk_rvudate === '0000-00-00') {
                        
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
    try {
      let endpoint = `getAllwithJoin?table=fms_riskAssessment&status=0&company_id=${companyId}`;
      let response = COMMON_GET_FUN(BASE_URL, endpoint)
      response.then(data => {
        //console.log(data);
        if (data.status) {
       
          setEmployees(data?.messages);
        }else{
          setEmployees([]);
  
        }
      })
    } catch (error) {
      console.error('Error in useEffect:', error);
    }
  }, [isAdding, isEditing, isDelete])

  const handleEdit = id => {
    try {
      const endpoint = `editParticipant?table=fms_riskAssessment&field=rsk_id&id=${id}`;

      let response = COMMON_GET_FUN(BASE_URL, endpoint)
      response.then(data => {
        //console.log(data);
        if (data.status) {
          setSelectedDocument(data.messages)
          setIsEditing(true)
        }else{
          setSelectedDocument([])
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
        let endpoint = `deleteStatus?table=fms_riskAssessment&field=rsk_id&id=${id}&delete_status=rsk_status&value=1`
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
    <h3 style={{fontSize:"1.285rem",fontWeight:"500"}}>Participant Risk Assessments</h3>
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
className={employees.length<1?"hide_tableData":""}




            columns={columns}
            rows={employees}
            style={{padding:20}}
            getRowId={(row) => row.rsk_id }
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
      {isAdding && <Add setIsAdding={setIsAdding}  setShow={setShow} show={show} />}
      {isEditing && <Edit selectedRisk={selectedDocument} setIsEditing={setIsEditing} setShow={setShow} show={show}  />}
    </div>
  );
};

export default RiskIndex;
