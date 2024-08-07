import React, { useContext, useEffect, useState } from 'react';
// import { DataGrid, GridToolbarContainer } from '@mui/x-data-grid';
import '../../../../style/document.css'
import Button from '@mui/material/Button';
import Box from '@mui/material/Box'; 
import Typography from '@mui/material/Typography'; 
import IconButton from '@mui/material/IconButton'; 
import AddIcon from '@mui/icons-material/Add'; 
import CloseIcon from '@mui/icons-material/Close'; 
import DocumentForm from 'views/staff/Document/component/DocumentForm';
import EditDocName from 'views/staff/Document/component/EditDocName';
import { Card, CardHeader, CardContent, List, ListItem, ListItemText, TextField  } from '@mui/material';
// import { Button as MuiButton } from '@mui/material'; // Rename Button import to MuiButton
// import DescriptionIcon from '@mui/icons-material/Description';
// import MoreVertIcon from '@mui/icons-material/MoreVert';
// import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { Grid } from '@mui/material';
// import { CheckBox } from '@mui/icons-material';

import Swal from 'sweetalert2'
import { BASE_URL, COMMON_UPDATE_FUN } from 'helper/ApiInfo';
import AuthContext from 'views/Login/AuthContext';

const SettingsPage = () => {
  const {companyId}=useContext(AuthContext)

  const [isFormOpen, setIsFormOpen] = useState(false);
const [documents,setDocuments]=useState([])
// const [anchorEl, setAnchorEl] = useState(null);

const [editFormOpen, setEditFormOpen] = useState(false);

const [selectedData, setSelectedData] = useState(null);
const [addInput, setAddInput] = useState([]);
const [editedItem, setEditedItem] = useState(null);
// const [editedValue, setEditedValue] = useState(''); //
const [editCategoryName,seteditCategoryName]=useState()
const [dataSaved, setDataSaved] = useState(false);

const [showAddIcon,setShowAddIcon]=useState(true)

const [docId,setDocId]=useState(null)

const handleEditListItem = (category_document_id, value) => {
  //console.log(category_document_id);
  seteditCategoryName(value)
  setEditedItem(category_document_id);
  // setEditedValue(value);
};


const handleAddRow = (id) => {
  //console.log(id);
  setDocId(id);
  setShowAddIcon(false);

  // const index = documents.findIndex((data) => data.categorie_id === id);

  // const updatedInputs = [...addInput];
  // updatedInputs[index] = { Documents: '' };
  setAddInput([...addInput,'']);
};


const handleChange = (index, event) => {
  //console.log(index);
  const updatedInputs = [...addInput];
  updatedInputs[index] = event.target.value;
  setAddInput(updatedInputs);
};


const handleRemoveRow = (index) => {
  const updatedInputs = [...addInput];
  updatedInputs.splice(index, 1);
  setAddInput(updatedInputs);
  setShowAddIcon(true)  
};
const handleCancelEdit = () => {
  setEditedItem(null);
  // setEditedValue('');
};

// const handleSaveEdit = async (category_document_id, e) => {
//   e.preventDefault();
//   const formData = new FormData()
//   formData.append('category_document_name',editCategoryName)
//   try {
//     const url = 'https://tactytechnology.com/mycarepoint/api/updateAll?table=fms_participant_doc_name&field=category_document_id&id=' + category_document_id;
//     //console.log(url);
//     const response = await fetch(url, {
//       method: 'POST', 
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(formData), // Assuming you're updating the category_document_name field
//     });
//     if (response.ok) {
//       // Handle success
//       //console.log('Category name updated successfully');
//       setEditedItem(null);
//       setEditedValue('');
//     } else {
//       // Handle error
//       console.error('Failed to update category name');
//     }
//   } catch (error) {
//     console.error('Error updating category name:', error);
//   }
// };
const handleAdd = async (e) => {
  e.preventDefault();

  try {
   
  //   const secondData = addInput.map(doc => ({
  //     categorie_id: docId,
  //     category_document_name: doc.Documents
  // }));

  // const secondData =addInput.map((doc)=>{
  //   //console.log(doc);

  // })
  const currentTime = dayjs().format('YYYY-MM-DD HH:mm');

  const secondData = addInput.map(doc => (
    {
    categorie_id: docId,
    category_document_name: doc,
    created_at:currentTime
}));

  
  //console.log(secondData);
    const secondApiResponse = await add(`${BASE_URL}`,'addDocument?table=fms_staff_doc_name', secondData);


      if (secondApiResponse.status) {
          Swal.fire({
              icon: 'success',
              title: 'Added!',
              text: `Data has been Added.`,
              showConfirmButton: false,
              timer: 1500,
          });
          setIsFormOpen(false)
          setDataSaved(true)
          
      } else {
          Swal.fire({
              icon: 'error',
              title: 'Error!',
              text: 'Something Went Wrong.',
              showConfirmButton: true,
          });
      }
  } catch (error) {
      // Handle errors
      console.error('Error:', error);
      Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Failed to communicate with the server.',
          showConfirmButton: true,
      });
  }
};

async function add(url, endpoint, data) {
  const response = await fetch(url + endpoint, {
      method: "POST",
      mode: "cors",
      headers: {
          "Content-Type": "application/json",
      },
      body:JSON.stringify(data),
  });

  if (!response.ok) {
      throw new Error('Failed to fetch');
  }

  return response.json();
}

const handleSaveEdit = e => {


  const formData = new FormData()
formData.append('category_document_name',editCategoryName)

  let endpoint = 'updateAll?table=fms_staff_doc_name&field=category_document_id&id=' + editedItem
  //console.log(BASE_URL+endpoint);  
  let response = COMMON_UPDATE_FUN(BASE_URL, endpoint, formData)
  response.then(data => {
  
    if (data.status) {
      Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: `data has been Updated.`,
        showConfirmButton: false,
        timer: 1500
      })
      setShowAddIcon(true);
      setEditedItem(null)
      setDataSaved(true)

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





//  const companyId =1
const handleAddButton = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };

  // const handlePopoverOpen = (event) => {
  //   setAnchorEl(event.currentTarget);

  // };

  const handlePopoverClose = () => {

    setEditFormOpen(false)
  };



  const handleEdit=async(id)=>{
    //console.log(id);
    setEditFormOpen(true)
    const endpoint = `getWhere?table=staff_doc_categories&field=categorie_id&id=${id}`;
    try {
        const response = await fetch(BASE_URL + endpoint, {
          method: 'GET',
          mode: 'cors',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
      
        if (data.status) {
          //console.log("Messages:", data.messages);
          setSelectedData(data.messages)
          //console.log(data.messages);
          
         
        }
      } catch (error) {
        console.error('Error fetching selected data:', error);
      }
    

  }

  // const handleEditFormSubmit = () => {
  //   //console.log('Category Name:', categoryName);
  //   //console.log('Is Confidential:', isConfidential);
  //   setEditFormOpen(false);
  // };

  // const handleEditFormOpen = () => {
  //   setEditFormOpen(true);
    
  // };


//   const CustomToolbar = () => (
//     <GridToolbarContainer>
//       <Typography variant="h6" sx={{ flexGrow: 1 }}>Documents</Typography>
//       <Button variant="contained" onClick={handleAddButton}>Add New</Button>
//     </GridToolbarContainer>
//   );
const fetchData = async () => {
    const formatedData =[]
    try {
      const url = `${BASE_URL}getStaffDocument_categories?table=staff_doc_categories&select=categorie_id,categorie_name,cate_doc_name&company_id=${companyId}&fields=status&status=1`;
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (data.status) {
        //console.log(data);  
        setDocuments(data.messages);
    //    data.messages.map((res)=>{
    //    //console.log(res);
    //    formatedData.push({
    //     "categorie_name":res?.categorie_name,
    //     "cate_doc_name":res.cate_doc_name,
    //     "is_confidential":res?.is_confidential,
    //     "categorie_id":res?.categorie_id,
    //     "category_document_id":res?.category_document_id
    // })

    //    })
    
      
      }
      
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
console.log(documents);

useEffect(()=>{
    fetchData()
    if(dataSaved){
      handleRemoveRow()
    }
},[editFormOpen,editCategoryName,editedItem,isFormOpen,dataSaved])

  return (
    <>
      <Box display="flex" marginBottom="16px" className="document_cate">
        <Box flex={1}>
          <Box display="flex" marginBottom="16px">
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ width: "100%" }}>
              <h3 style={{fontSize:"1.285rem",fontWeight:"500"}}>Staff Document Categories</h3>
              <Button variant="contained" onClick={handleAddButton}>Add New</Button>
            </Box>
          </Box>
        </Box>
      </Box>
      {isFormOpen && (
        <div className='modal-overlay'>
          <Box className='modal'>
            <Box display="flex" alignItems="center" justifyContent="space-between" marginBottom="8px" className="modalForm">
              <Typography variant="h5">Create Category</Typography>
              <IconButton onClick={handleCloseForm} color="error" aria-label="close">
                <CloseIcon />
              </IconButton>
            </Box>
            <DocumentForm setIsFormOpen={setIsFormOpen} className={'modal-overlay'}/>
          </Box>
        </div>
      )}
     {editFormOpen && (
  <div className='modal-overlay2'>
    <div className="centered-container">
      <Box className='modal2'>
        <Box display="flex" alignItems="center" justifyContent="space-between" marginBottom="8px" className="modalForm2">
          <Typography variant="h5">Edit Category</Typography>
          <IconButton onClick={handlePopoverClose} color="error" aria-label="close">
            <CloseIcon />
          </IconButton>
        </Box>
        <EditDocName setEditFormOpen={setEditFormOpen} selectedData={selectedData} className={'modal-overlay'}/>
      </Box>
    </div>
  </div>
)}

 <Grid container spacing={2} >
        {documents?.map((data) => {
          //console.log(data)
          return(
          <Grid item xs={6} key={data.categorie_id}>
            <Card className='cardBox'>
              <CardHeader
                title={data.categorie_name}
                action={
                  <IconButton aria-label="settings"onClick={() => handleEdit(data.categorie_id)} >
                    <EditIcon /> 
                  </IconButton>
                }
              />
              <CardContent style={{ paddingTop: '0' }}>
              <List>
                {data?.document_data?.map((list) => (
                  <ListItem key={list.category_document_id} className="cardList">
                    {editedItem === list.category_document_id ? (
                      <div className='editListItem'>
                        <TextField
                          value={editCategoryName}
                          onChange={(e) => seteditCategoryName(e.target.value)}
                        />
                       <Button variant="contained" onClick={(e) => handleSaveEdit(list.category_document_id,)}>update</Button>
                        <IconButton onClick={handleCancelEdit} color="error" aria-label="close">
                <CloseIcon />
              </IconButton>
                      </div>
                    ) : (
                      <>
                        <ListItemText primary={list?.category_document_name} />
                        <IconButton aria-label="edit" onClick={() => handleEditListItem(list.category_document_id, list.category_document_name)}>
                          <EditIcon />
                        </IconButton>
                      </>
                    )}
                  </ListItem>
                ))}
                
                { docId === data.categorie_id && addInput.map((input, index) => (
                                <Grid item xs={12} key={data.categorie_id}>
                                    <Grid container spacing={2} justifyContent='space-between' marginBottom='8px' marginTop='20px'>
                                        <TextField
                                            style={{ width: '297px', marginLeft: '15px' }}
                                            label={`Document type `}
                                            placeholder='Document type e.g. Police Check'
                                            variant='outlined'
                                            value={input}
                                            onChange={(e) => handleChange(index, e)}
                                        />
                                         <Button variant="contained" onClick={handleAdd}>Create</Button>
                                        <IconButton color='error' aria-label='close' onClick={() => handleRemoveRow(index)}>
                                            <CloseIcon />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            ))}
               { showAddIcon &&  <ListItem className="cardList">
                <ListItemText />
                        <IconButton aria-label="" onClick={() => handleAddRow(data.categorie_id)}>
                         <AddIcon/>
                        </IconButton>
                </ListItem>}
              </List>
              </CardContent>
            </Card>
          </Grid>)
})}
      </Grid>

    </>
  );
};

export default SettingsPage;
