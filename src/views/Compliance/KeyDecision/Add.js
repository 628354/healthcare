import React, { useContext, useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import {COMMON_ADD_FUN,BASE_URL,GET_PARTICIPANT_LIST,COMMON_GET_PAR,} from '../../../helper/ApiInfo'

//select field
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Swal from 'sweetalert2';
import AuthContext from 'views/Login/AuthContext';



const Add = ({ setIsAdding, setShow }) => {
  const {companyId} = useContext(AuthContext)


  const currentDate = new Date()
  const [date, setDate] = useState('')
  const [decisionMaker, setDecisionMaker] = useState('');
  const [description, setDescription] = useState('');
  const [decisionRationale, setDecisionRationale] = useState('');
  const [alternativesConsidered, setAlternativesConsidered] = useState('');
  const [costImplications, setCostImplications] = useState('');
  const [staffId, setStaffId] = useState(null)


  useEffect(() => {
    setShow(true)
    return () => setShow(false)
  }, [setShow])


  useEffect(() => {
    const staff = localStorage.getItem('user')

    if (staff) {
      const convert = JSON.parse(staff)
      const finalStaff = convert?.stf_firstname
      const lname = convert?.stf_lastname
      const combine = `${finalStaff} ${lname}`
      const id = convert?.stf_id
      setDecisionMaker(combine)
      setStaffId(id)

    }
  }, [])

  const handleAdd = e => {
    e.preventDefault();

    const emptyFields = [];
    if (!date) {
      emptyFields.push('Date');
    }
    if (!decisionMaker) {
      emptyFields.push('Decision maker');
    }
    if (!description) {
      emptyFields.push('Description');
    }
    if (!decisionRationale) {
      emptyFields.push('Decision rationale');
    }
    
    if (emptyFields.length > 0) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: `Please fill in the required fields: ${emptyFields.join(', ')}`,
        showConfirmButton: true,
      });
    }
    const currentTime = dayjs().format('YYYY-MM-DD HH:mm');
    const dateFormat = date ? date.format('YYYY-MM-DD') : null
    const formData = new FormData();
    formData.append('key_dcisnmkr', staffId);
    formData.append('key_date', dateFormat);
    formData.append('key_dsrptn', description);
    formData.append('key_ratnle', decisionRationale);
    formData.append('key_cost', costImplications);
    formData.append('key_altconsid', alternativesConsidered);
    formData.append('company_id', companyId);
    formData.append('created_at', currentTime);






 
    let endpoint = "insertCompliance?table=fms_key_decision";
    let response = COMMON_ADD_FUN(BASE_URL, endpoint, formData);
    response.then((data) => {
      //console.log(data);
      //console.log("check", data)
      //return data;
      //console.log(data);
      if (data.status) {
        Swal.fire({
          icon: 'success',
          title: 'Added!',
          text: `data has been Added.`,
          showConfirmButton: false,
          timer: 1500,
        });
        setIsAdding(false);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Something Went Wrong.',
          showConfirmButton: true,
        });
      }
    });

  };



  return (
    <div className="small-container">

      <Box
        component="form"

        sx={{
          '& .MuiTextField-root': { m: 1, width: '50ch' },
          //bgcolor:'#FFFFFF'
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleAdd}
      >
        <h1>Create Key Decision</h1>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label='Date'
            format='DD/MM/YYYY'
            minDate={dayjs(currentDate)}
            onChange={newValue => {
              setDate(newValue)
            }}
          />
        </LocalizationProvider>


        <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }} required>
          <InputLabel id='decisionMaker'>Decision Maker</InputLabel>
          <Select labelId='decisionMaker' id='decisionMaker' value={decisionMaker} label='Staff' onChange={e => setDecisionMaker(e.target.value)}>
            <MenuItem style={{ display: 'none' }} value={decisionMaker}>{decisionMaker}</MenuItem>
          </Select>
        </FormControl>


        <TextField
          required
          multiline
          rows={4}
          value={description}
          label="Description"
          type="text"
          onChange={(e) => { setDescription(e.target.value) }}
        />
        <TextField
          value={decisionRationale}
          multiline
          rows={4}
          label="Decision Rationale"
          type="text"
          onChange={(e) => { setDecisionRationale(e.target.value) }}
        />

        <TextField
          required
          multiline
          rows={4}
          value={alternativesConsidered}
          label="Alternatives Considered"
          type="text"
          onChange={(e) => { setAlternativesConsidered(e.target.value) }}
        />
        <TextField
          value={costImplications}
          multiline
          rows={4}
          label="Cost Implications"
          type="text"
          onChange={(e) => { setCostImplications(e.target.value) }}
        />





        <Box sx={{ width: '100ch', m: 1 }}>
          <Stack direction="row-reverse"
            spacing={2}>
            <Button variant="outlined" color="error" onClick={() => setIsAdding(false)} type="button">Cancel</Button>
            <Button variant="outlined" type="submit" >Submit</Button>

          </Stack>
        </Box>
      </Box>
    </div>
  );
};


export default Add;