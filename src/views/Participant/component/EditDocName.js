import React, { useContext, useEffect, useState } from 'react';
import { TextField, Checkbox, Button, Grid, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import Swal from 'sweetalert2';

const EditDocumentName = ({ setEditFormOpen,selectedData }) => {
  
//   const docName=JSON.parse(selectedData.cate_doc_name)
    const [addInput, setAddInput] = useState([{ Documents: '' }]);
    const [categoryName, setCategoryName] = useState('');
    const [isConfidential, setIsConfidential] = useState();
    const [id, setId] = useState('');
    const companyId =1
 //console.log(isConfidential);
   
    useEffect(() => {
        if (selectedData) {
console.log(selectedData);
            // const docName = JSON.parse(selectedData.cate_doc_name);
            // setAddInput(docName.map(doc => ({ Documents: doc })))
            setCategoryName(selectedData.categorie_name);
            setIsConfidential(selectedData.is_confidential);
            setId(selectedData.categorie_id)
        }
    }, [selectedData]);
    // const handleAddRow = () => {
    //     setAddInput([...addInput, { Documents: '' }]);
    // };

    // const handleChange = (index, event) => {
    //     const updatedInputs = [...addInput];
    //     updatedInputs[index].Documents = event.target.value;
    //     setAddInput(updatedInputs);
    // };

    // const handleRemoveRow = (index) => {
    //     const updatedInputs = [...addInput];
    //     updatedInputs.splice(index, 1);
    //     setAddInput(updatedInputs);
    // };

    const handleAdd = async (e) => {
        e.preventDefault();
    
        if (!categoryName) {
            return Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'All fields are required.',
                showConfirmButton: true,
            });
        }
    
        const docNames = addInput.map((input) => input.Documents);
        const format = JSON.stringify(docNames);
    
        const data = new FormData();
        data.append('categorie_name', categoryName);
        data.append('is_confidential', isConfidential);
    
        let url = 'https://tactytechnology.com/mycarepoint/api/';
        let endpoint = 'updateAll?table=document_categories&field=categorie_id&id=' + id;
    
        try {
            const response = await fetch(url + endpoint, {
                method: "POST",
                mode: "cors",
                body: data,
            });
    
            const responseData = await response.json();
    
            if (responseData.status) {
                Swal.fire({
                    icon: 'success',
                    title: 'Added!',
                    text: `Data has been updated.`,
                    showConfirmButton: false,
                    timer: 1500,
                });
                setAddInput([{ Documents: '' }]);
                setCategoryName('');
             
                setEditFormOpen(false)
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error!',
                    text: 'Something Went Wrong.',
                    showConfirmButton: true,
                });
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error!',
                text: 'Failed to update data.',
                showConfirmButton: true,
            });
        }
    };
    

    // async function add(url, endpoint, data) {
    //     const response = await fetch(url + endpoint, {
    //         method: "POST",
    //         mode: "cors",
    //         headers: {
    //             "Content-Type": "application/json",
    //         },
    //         body: JSON.stringify(data),
    //     });
    //     return response.json();
    // }

    return (
        <div className="center-container">
        <div className="formWrapper" style={{ height: '400px'}}>
            <Grid container spacing={2} className='formSt'>
                <Grid item xs={12}>
                    <form onSubmit={handleAdd}>
                        <Grid item xs={12}>
                            <TextField id='category' value={categoryName} onChange={(e) => setCategoryName(e.target.value)} label='Name' placeholder='Category name e.g. Compliance' variant='outlined' fullWidth />
                        </Grid>
                        <Grid item xs={12}>
                            <Checkbox id='isConfidential' name='isConfidential'  value={isConfidential} onChange={(e) => setIsConfidential(e.target.checked ? 1 : 0)} />
                            <label htmlFor='isConfidential'>Is Confidential?</label>
                        </Grid>
                        {/* <Grid container spacing={2}>
                            {addInput.map((input, index) => {
                                //console.log(input);
                         return(
                                <Grid item xs={12} key={index}>
                                    <Grid container spacing={2} justifyContent='space-between' marginBottom='8px' marginTop='20px'>
                                        <TextField
                                            style={{ width: '297px', marginLeft: '15px' }}
                                            label={`Document type ${index + 1}`}
                                            placeholder='Document type e.g. Police Check'
                                            variant='outlined'
                                            value={input.Documents}
                                            onChange={(e) => handleChange(index, e)}
                                        />
                                        <IconButton color='error' aria-label='close' onClick={() => handleRemoveRow(index)}>
                                            <CloseIcon />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            )}
                            )}
                            <Grid item xs={12} style={{ display: 'flex', justifyContent: 'end' }}>
                                <IconButton color='primary' aria-label='add' onClick={handleAddRow}>
                                    <AddIcon />
                                </IconButton>
                            </Grid>
                        </Grid> */}
                        <hr />
                        <Grid container justifyContent='flex-end'>
                            <Button variant='outlined' color='secondary' type="submit" onClick={() => setEditFormOpen(false)} style={{ marginRight: '8px' }}>
                                Cancel
                            </Button>
                            <Button variant='contained' color='primary' type="submit">
                                Update
                            </Button>
                        </Grid>
                    </form>
                </Grid>
            </Grid>
        </div>
        </div>
    );
};

export default EditDocumentName;
