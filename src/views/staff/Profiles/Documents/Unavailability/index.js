import React, { useState, useEffect, useContext } from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
//import LibraryAddOutlinedIcon from '@mui/icons-material/LibraryAddOutlined';
import { DataGrid/* GridToolbar */,GridToolbarContainer,
  // GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  } from '@mui/x-data-grid';

  import VisibilityIcon from '@mui/icons-material/Visibility';

import Swal from 'sweetalert2';


///import Table from './Table';
import Add from './Add';
import Edit from './Edit';
import { Box } from '@mui/system';
import AuthContext from 'views/Login/AuthContext';
import { useDispatch } from 'react-redux';
import { addParticipantData } from 'store/actions';
// import { addParticipantData } from '../../../store/actions';

//import { employeesData } from './data';






const ParticipantProfiles = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isdelete, setIsDelete] = useState(null);
  const {allowUser}=useContext(AuthContext)

  const dispatch =useDispatch()
const allowPre= allowUser.find((data)=>{
  // console.log(data);
   if(data.user === "Profiles"){
    return {"add":data.add,"delete":data.delete,"edit":data.edit,"read":data.read}
   }
    
    
})



  const columns = [
                    // { field: 'stf_id', headerName: 'ID', width: 70 },
                    { field:`name`, headerName: 'Name', width: 250,
                    valueGetter: (params)=>{
                      // console.log(params);
                      return `${params.row.stf_firstname} ${params.row.stf_lastname}`
                     
                      
                    },   },
                    // { field: 'stf_lastname', headerName: 'Last name', width: 130 },
                    {
                      field: 'stf_email',
                      headerName: 'Email',
                      width: 250,
                    },
                    // {
                    //   field:'stf_prfrdname',
                    //   headerName:'User Name',
                    //   type:'number',
                    //   width:90,
                    // },
                    // {
                    //   field:'stf_dob',
                    //   headerName:'Date Of Birth',
                    //   minWidth:110,
                    //   /* valueFormatter: (params)=>{
                    //           let date = date(params);
                    //           let newDate = date.getDay+'-'+date.getMonth()+'-'+date.getFullYear();
                    //             return newDate;
                    //       }, */
                    // },

                    {
                      field:'stf_gender',
                      headerName:'Gender',
                      width:200,
                      valueFormatter: (params)=>{
                            // console.log(params);
                            if(params.value == '2'){ 
                                return `Male`;
                            }else if(params.value == '1'){
                                return `female`;
                            }else if(params.value == '3'){
                              return `other`;
                          }
                            
                          }, 
                    },          
                    {
                      field: 'action',
                      headerName: 'Action',
                      width:250,
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
    let url = "https://tactytechnology.com/mycarepoint/api/";
    let endpoint = 'getWhereAll?table=fms_staff_detail&field=stf_archive&value=1';
    
      let response = getData(url,endpoint);
          response.then((data)=>{
          // console.log(data);
          if(data.status){
            
            setEmployees(data.messages);
          }
          
          });

    
  }, [isAdding,isEditing,isdelete]);

  const handleEdit = id => {
    //const [employee] = employees.filter(employee => employee.id === id);
    
    let url = "https://tactytechnology.com/mycarepoint/api/";
    let endpoint = 'getWhere?table=fms_staff_detail&field=stf_id&id='+id;
    let response = getSelected(url,endpoint);
    response.then((data)=>{
      
      if(data.status){
        console.log(data.messages);
        dispatch(addParticipantData(data.messages))
        setSelectedEmployee(data.messages);
        setIsEditing(true);
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
        let url = "https://tactytechnology.com/mycarepoint/api/";
        let endpoint = 'deleteSelected?table=fms_staff_detail&field=stf_id&id='+id;
        let response = deleteRecorde(url,endpoint);
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

  async function getData(url,endpoint){
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
      <h3 style={{fontSize:"1.285rem",fontWeight:"500"}}>Staff Profiles</h3>
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
}

  return (
    <div className="container">
      
      

      {!isAdding && !isEditing && (
        <>
          
            {/* <Button variant="contained" onClick={()=>{handleAddButton()}} >Add New</Button> */}
          
                  <DataGrid
className={employees.length<1?"hide_tableData":""}




              
              style={{padding:20}}
              columns={columns}
              rows={employees}
              getRowId={(row) => row.stf_id}
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
          setIsAdding={setIsAdding}
        />
      )}
      {isEditing && (
        <Edit
          selectedEmployee={selectedEmployee}
          setIsEditing={setIsEditing}
          allowPre={allowPre} 
        />
      )}
    </div>
  );
};

export default ParticipantProfiles;
