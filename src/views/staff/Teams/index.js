import React, { useState, useEffect,useContext} from 'react';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined';
import { DataGrid/* GridToolbar */,GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarExport,
 } from '@mui/x-data-grid';

  import AuthContext from 'views/Login/AuthContext'
import Swal from 'sweetalert2';
import { BASE_URL, COMMON_GET_FUN, companyId } from 'helper/ApiInfo';
///import Table from './Table';
import Add from './Add';
import Edit from './Edit';
import { Box } from '@mui/system';

const Dashboard = () => {

  const { allowUser } = useContext(AuthContext)

  const allowPre = allowUser.find(data => {
    if (data.user === 'Teams') {
      return { add: data.add, delete: data.delete, edit: data.edit, read: data.read }
    }
  })
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isdelete, setIsDelete] = useState(null);

  const columns = [
                    { field: 'team_name', headerName: 'Team Name', width: 130 },
                   
                    {
                      field:'team_stfid',
                      headerName:'Staff',
                      minWidth:110,
                      renderCell: (params)=>{
                        console.log(params.value.split(',').length);
                        return <div>{params.value.split(',').length}</div>   
                          }, 
                    },
                    {
                      field:'team_partcpnts',
                      headerName:'Participant',
                      minWidth:110,
                      renderCell: (params)=>{
                        console.log(params.value.split(',').length);
                        return <div>{params.value.split(',').length}</div>   
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

        let endpoint = `getAllwithJoin?table=fms_stf_team&status=0&company_id=${companyId}`;
    
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
      }, [isAdding, isEditing, isdelete]);

      const handleEdit = id => {
        let endpoint = 'getWhere?table=fms_stf_team&field=team_id&id=' + id;
        
        try {
          let response = COMMON_GET_FUN(BASE_URL, endpoint);
      
          response.then((data) => {
            console.log(data);
            if (data.status) {
              setSelectedEmployee(data.messages);
              setIsEditing(true);
            } else {
              console.error('Error in API response:', data);
            }
          }).catch((error) => {
            console.error('Error fetching data:', error);
          });
      
        } catch (error) {
          console.error('Error in handleEdit function:', error);
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
        let endpoint = `deleteStatus?table=fms_stf_team&field=team_id&id=${id}&delete_status=team_status&value=1`
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

 
  function CustomToolbar() {
  return (
    <GridToolbarContainer >
      <h3 style={{fontSize:"1.285rem",fontWeight:"500"}}>Teams</h3>
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
               style={{padding:20}}
              
              columns={columns}
              rows={employees}
              getRowId={(row) => row.team_id}
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
        allowPre={allowPre}
          selectedEmployee={selectedEmployee}
          setIsEditing={setIsEditing}
        />
      )}
    </div>
  );
};

export default Dashboard;
