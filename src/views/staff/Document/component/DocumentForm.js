import React, { useState } from 'react';
import { TextField, Checkbox, Button, Grid, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import AddIcon from '@mui/icons-material/Add';
import Swal from 'sweetalert2';
import { BASE_URL, companyId } from 'helper/ApiInfo';

const DocumentForm = ({ setIsFormOpen }) => {
    const [addInput, setAddInput] = useState([{ Documents: '' }]);
    const [categoryName, setCategoryName] = useState('');

    const [categorieId, setCategorieId] = useState(null);


    const handleAddRow = () => {
        setAddInput([...addInput, { Documents: '' }]);
    };

    const handleChange = (index, event) => {
        const updatedInputs = [...addInput];
        updatedInputs[index].Documents = event.target.value;
        setAddInput(updatedInputs);
    };

    const handleRemoveRow = (index) => {
        const updatedInputs = [...addInput];
        updatedInputs.splice(index, 1);
        setAddInput(updatedInputs);
    };

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

        const firstData = {
            categorie_name: categoryName,
            company_id: companyId
        };

        try {
            const firstApiResponse = await add(BASE_URL, 'insertDataGet?table=staff_doc_categories', firstData);

            if (firstApiResponse.status) {
                Swal.fire({
                    icon: 'success',
                    title: 'Added!',
                    text: `Data has been Added.`,
                    showConfirmButton: false,
                    timer: 1500,
                });
                setIsFormOpen(false)
                setCategorieId(firstApiResponse.messages.categorie_id);

                const secondData = addInput.map(doc => ({
                    categorie_id: firstApiResponse.messages.categorie_id,
                    category_document_name: doc.Documents
                }));

                const secondApiResponse = await add(BASE_URL,'addDocument?table=fms_staff_doc_name', secondData);


                if (secondApiResponse.status) {
                    console.log('Second API call successful');
                } else {
                  
                    console.error('Second API call failed');
                }
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
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch');
        }

        return response.json();
    }

    return (
        <div className="formWrapper" style={{ height: '400px', overflowY: 'auto' }}>
            <Grid container spacing={2} className='formSt'>
                <Grid item xs={12}>
                    <form onSubmit={handleAdd}>
                        <Grid item xs={12}>
                            <TextField id='category' onChange={(e) => setCategoryName(e.target.value)} label='Name' placeholder='Category name e.g. Compliance' variant='outlined' fullWidth />
                        </Grid>
                      
                        <Grid container spacing={2}>
                            {addInput.map((input, index) => (
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
                            ))}
                            <Grid item xs={12} style={{ display: 'flex', justifyContent: 'end' }}>
                                <IconButton color='primary' aria-label='add' onClick={handleAddRow}>
                                    <AddIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                        <hr />
                        <Grid container justifyContent='flex-end'>
                            <Button variant='outlined' color='secondary' type="button" onClick={() => setIsFormOpen(false)} style={{ marginRight: '8px' }}>
                                Cancel
                            </Button>
                            <Button variant='contained' color='primary' type="submit">
                                Create123
                            </Button>
                        </Grid>
                    </form>
                </Grid>
            </Grid>
        </div>
    );
};

export default DocumentForm;
