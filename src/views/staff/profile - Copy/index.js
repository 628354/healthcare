import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
//import LibraryAddOutlinedIcon from '@mui/icons-material/LibraryAddOutlined';
import { DataGrid/* GridToolbar */,GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarExport,
  GridToolbarDensitySelector, } from '@mui/x-data-grid';


import Swal from 'sweetalert2';


///import Table from './Table';
import Add from './Add';
import Edit from './Edit';

//import { employeesData } from './data';






const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isdelete, setIsDelete] = useState(null);

  const columns = [
                    { field: 'stf_id', headerName: 'ID', width: 70 },
                    { field: 'stf_firstname', headerName: 'First name', width: 130 },
                    { field: 'stf_lastname', headerName: 'Last name', width: 130 },
                    {
                      field: 'stf_email',
                      headerName: 'Email',
                      width: 90,
                    },
                    {
                      field:'stf_prfrdname',
                      headerName:'User Name',
                      type:'number',
                      width:90,
                    },
                    {
                      field:'stf_dob',
                      headerName:'Date Of Birth',
                      minWidth:110,
                      /* valueFormatter: (params)=>{
                              let date = date(params);
                              let newDate = date.getDay+'-'+date.getMonth()+'-'+date.getFullYear();
                                return newDate;
                          }, */
                    },

                    {
                      field:'stf_gender',
                      headerName:'Gender',
                      widht:90,
                      valueFormatter: (params)=>{
                            
                            if(params.value == '1'){ 
                                return `Male`;
                            }else if(params.value == '2'){
                                return `female`;
                            }else{
                                return `Other`;
                            }
                            
                          }, 
                    },          
                    {
                      field: 'action',
                      headerName: 'Action',
                      minWidth:200,
                      renderCell: (params) => (
                        <strong >
                          <IconButton aria-label="edit" color="primary"  onClick={() => handleEdit(params.id) } >
                            <EditNoteOutlinedIcon/>
                          </IconButton>
                          <IconButton aria-label="delete" color="error" sx={{m:2}}  onClick={() => handleDelete(params.id)} >
                            <DeleteOutlineOutlinedIcon/>
                          </IconButton>
                          
                          
                        </strong>
                      ),
                    },
                  ];

  

  useEffect(() => {
      let url = "https://tactytechnology.com/mycarepoint/api/";
      let endpoint = 'getAll?table=fms_staff_detail&select=stf_id,stf_firstname,stf_lastname,stf_prfrdname,stf_email,stf_dob,stf_gender';

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
      // console.log(data);
      if(data.status){
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
    <GridToolbarContainer>
      <GridToolbarColumnsButton />
      <GridToolbarFilterButton />
      <GridToolbarDensitySelector />
      <GridToolbarExport />
      <Button variant="contained" onClick={()=>{handleAddButton()} } style={{margin: "0px 0px 0px auto"}} >Add New</Button>
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
        />
      )}
    </div>
  );
};

export default Dashboard;
