import React, { useState, useEffect, useContext } from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import VisibilityIcon from '@mui/icons-material/Visibility';

//import LibraryAddOutlinedIcon from '@mui/icons-material/LibraryAddOutlined';
import { DataGrid/* GridToolbar */,GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarExport,
  } from '@mui/x-data-grid';

  import { Box } from '@mui/system';

import Swal from 'sweetalert2';


///import Table from './Table';
import Add from './Add';
import Edit from './Edit';
import AuthContext from 'views/Login/AuthContext';
import { BASE_URL } from 'helper/ApiInfo';

//import { employeesData } from './data';






const ParticipantContact = ({participantId,divShadow}) => {
  
  const [employees, setEmployees] = useState([]);
  const [selectedEmployees, setSelectedEmployees] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isdelete, setIsDelete] = useState(null);
  const {allowUser,companyId}=useContext(AuthContext)
  const allowPre= allowUser.find((data)=>{
    // //console.log(data);
     if(data.user === "Profiles"){
      return {"add":data.add,"delete":data.delete,"edit":data.edit,"read":data.read}
     }
      
      
  })
  
  const columns = [
   
                    { field: 'ctc_type', headerName: 'Type', width: 120 },
                    { field: 'ctc_name', headerName: 'Name', width: 120 },
                    { field: 'ctc_email', headerName: 'Email', width: 230 },
                    {
                      field: 'ctc_phone',
                      headerName: 'Phone',
                      width: 120,
                    },
                   

                             
                    {
                      field: 'action',
                      headerName: 'Action',
                      minWidth:200,
                      renderCell: (params) => (
                        <strong >
                         {
                            allowPre?.edit? <IconButton aria-label="edit" color="primary" onClick={() => handleEdit(params.id)}>
                          <EditNoteOutlinedIcon /> 
                          </IconButton>:(allowPre?.read? <IconButton aria-label="edit" color="primary" onClick={() => handleEdit(params.id)}>
                             <VisibilityIcon />
                          </IconButton>:"")
                          }
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
    
 
const endpoint = 'getAll?table=fms_prtcpnt_contactdetails&select=ctc_type,ctc_name,ctc_address,ctc_email,ctc_phone,ctc_id,ctc_prtcpntid';

async function getData(BASE_URL, endpoint) {
  try {
    const response = await fetch(BASE_URL + endpoint);

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return { status: false, message: 'Error fetching data' };
  }
}

async function fetchData() {
  try {
    const response = await getData(BASE_URL, endpoint);
    // //console.log(response, "document");
    if (response.status) {
      const filterData=response?.messages.filter((data)=> data.ctc_prtcpntid === participantId)
    //console.log(filterData);
      setEmployees(filterData);
    }
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}

// Call the fetchData function
fetchData();

    
  }, [isAdding,isEditing,isdelete]);

  const handleEdit = id => {
    let endpoint = 'getWhere?table=fms_prtcpnt_contactdetails&field=ctc_id&id='+id;
    let response = getSelected(BASE_URL,endpoint);
    response.then((data)=>{
      if(data.status){
        setSelectedEmployees(data.messages);
        setIsEditing(id);
      }
    });
    
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
      cancelButtonText: 'No, cancel!',
    }).then(result => {
      if (result.value) { 
        let endpoint = 'deleteSelected?table=fms_prtcpnt_contactdetails&field=ctc_id&id='+id;
        let response = deleteRecorde(BASE_URL,endpoint);
        response.then((data)=>{
          if(data.status){
            Swal.fire({
              icon: 'success',
              title: 'Deleted!',
              text: `Record data has been deleted.`,
              showConfirmButton: false,
              timer: 1500,
            });
            setIsDelete(id);
          }
        });
        

        /* const employeesCopy = employees.filter(employee => employee.id !== id);
        localStorage.setItem('employees_data', JSON.stringify(employeesCopy));
        setEmployees(employeesCopy); */
      }
    });
  };

  // async function getData(url,endpoint){
  //       const response =  await fetch( url+endpoint,{
  //                                   method: "GET", // *GET, POST, PUT, DELETE, etc.
  //                                   mode: "cors",
  //                                   headers: {
  //                                     "Content-Type": "application/json",
  //                                     //'Content-Type': 'application/x-www-form-urlencoded',
                               
  //                                   },
                                    
  //                                 }); 
  //                                 //console.log("yvjhbjkbjhhiu")
  //       return response.json();
       
  // } 

  async function getSelected(url,endpoint){
        const response =  await fetch( url+endpoint,{
                                    method: "GET", // *GET, POST, PUT, DELETE, etc.
                                    mode: "cors",
                                    headers: {
                                      "Content-Type": "application/json",
                                      //'Content-Type': 'application/x-www-form-urlencoded',
                                    },
                                  }); 
        return response.json();
  } 

  async function deleteRecorde(url,endpoint){
        const response =  await fetch( url+endpoint,{
                                    method: "GET", // *GET, POST, PUT, DELETE, etc.
                                    mode: "cors",
                                    headers: {
                                      "Content-Type": "application/json",
                                      //'Content-Type': 'application/x-www-form-urlencoded',
                                    },
                                  }); 
        return response.json();
  }

  function CustomToolbar() {
  return (
    <GridToolbarContainer >
      <h3 style={{fontSize:"1.285rem",fontWeight:"500"}}>Contact Details</h3>
       
      {/* <GridToolbarColumnsButton /> */}
      <GridToolbarFilterButton sx={{ border: '1px solid #82868b',width:"100px",color:"black",height:"35px" }} />
      {/* <GridToolbarDensitySelector /> */}
      <GridToolbarExport  sx={{ border: '1px solid #82868b',width:"100px",color:"black",height:"35px" }} />
      {      
      allowPre?.add ? <Button  variant="contained" onClick={()=>{handleAddButton()} } style={{margin: "0px 0px 0px auto"}} >Add New</Button>  :""
        }
    </GridToolbarContainer>
  );
}

  return (
    <div className="container">
      
      

      {!isAdding && !isEditing && (
        <>
          
            {/* <Button variant="contained" onClick={()=>{handleAddButton()}} >Add New</Button> */}
          
                  <DataGrid
className={employees.length<1?"hide_tableData":""}




              columns={columns}
              rows={employees}
              style={{padding:20}}
              getRowId={(row) => row.ctc_id}
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
              pageSizeOptions={[10,25,50,100]}
              //checkboxSelection
            />
          {/* <Table
            employees={employees}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          /> */}
        </>
      )}
      {isAdding && (
        <Add
        participantId={participantId}

          setIsAdding={setIsAdding}
        />
      )}

      {isEditing && (
        <Edit
        
          selectedEmployees={selectedEmployees}
          setIsEditing={setIsEditing}
          participantId={participantId}
          
          
          

        />
      )}
     
    </div>
  );
};

export default ParticipantContact;
