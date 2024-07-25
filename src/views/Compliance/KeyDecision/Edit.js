import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import '../../../style/document.css'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {COMMON_GET_PAR,GET_PARTICIPANT_LIST,COMMON_UPDATE_FUN, BASE_URL,COMMON_GET_FUN} from '../../../helper/ApiInfo'
import { Card, CardContent, Typography } from '@mui/material'
import Swal from 'sweetalert2';

const Edit = ({ selectedData, setIsEditing, allowPre, setShow }) => {
  // const currentDate = new Date();

  const id = selectedData.key_id;

  const [date, setDate] = useState(selectedData.key_date ? dayjs(selectedData.key_date) : dayjs())

  const [decisionMaker, setDecisionMaker] = useState(selectedData.key_dcisnmkr);
  const [description, setDescription] = useState(selectedData.key_dsrptn);
  const [decisionRationale, setDecisionRationale] = useState(selectedData.key_ratnle);
  const [alternativesConsidered, setAlternativesConsidered] = useState(selectedData.key_altconsid);
  const [costImplications, setCostImplications] = useState(selectedData.key_cost);

  const [staffList, setStaffList] = useState([])
  const[updateDate ,setUpdateDate]=useState(null)
  const[createDate ,setCreateDate]=useState(null)
  
     useEffect(() => {
      if (selectedData) {
        const updateData = selectedData && selectedData.updated_at
  
        if (updateData) {
          const [updateDate, updateTime] = (updateData && updateData.split(' ')) ?? [];
          const [year, month, day] = (updateDate && updateDate.split('-')) ?? [];
          const formattedDate = `${day}-${month}-${year}`;
          const formattedTime = updateTime.substr(0, 5);
          const final = (formattedDate === '00-00-0000' && formattedTime === '00:00') ? null : `Last Updated : ${formattedDate} : ${formattedTime}`;
          setUpdateDate(final)
        }
        const createData = selectedData.created_at
  
        if (createData) {
          const [createDate, createTime] = (createData && createData.split(' ')) ?? [];
          const [createyear, createmonth, createday] = (createDate && createDate.split('-')) ?? [];
          const formattedCreateDate = `${createday}-${createmonth}-${createyear}`;
          const formattedCreateTime = createTime.substr(0, 5);
          const final = `Created: ${formattedCreateDate} : ${formattedCreateTime}`
          setCreateDate(final)
        }
      }
    }, [selectedData]);


  useEffect(() => {
    setShow(true);
    return () => setShow(false);
  }, [setShow]);




  const getStaff = async () => {
    try {
      let response = await COMMON_GET_PAR(GET_PARTICIPANT_LIST.staff)
      if(response.status) {  
        setStaffList(response.messages)
       
      } else {
        throw new Error('Network response was not ok.')
      }
    } catch (error) {
      console.error('Error fetching staff data:', error)
    }
  }

  useEffect(() => {

    getStaff();
  }, []);

  const handleUpdate = (e) => {
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

    formData.append('key_dcisnmkr', decisionMaker);
    formData.append('key_date', dateFormat);
    formData.append('key_dsrptn', description);
    formData.append('key_ratnle', decisionRationale);
    formData.append('key_cost', costImplications);
    formData.append('key_altconsid', alternativesConsidered);
    formData.append('updated_at', currentTime);

    let endpoint = 'updateCompliance?table=fms_key_decision&field=key_id&id=' + id;
    let response = COMMON_UPDATE_FUN(BASE_URL, endpoint, formData);
    response.then((data) => {
      // console.log(data.status);
      //return data;
      if (data.status) {
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: `data has been Updated.`,
          showConfirmButton: false,
          timer: 1500
        });
        setIsEditing(false);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error!',
          text: 'Something Went Wrong.',
          showConfirmButton: true
        });
      }
    });
  };


  return (

    <>
      <div className="small-container">
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '50ch' }
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleUpdate}
      >
        <h1>Edit Key Decision</h1>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label='Date'
            format='DD/MM/YYYY'
            value={dayjs(date)}
            // minDate={dayjs(currentDate)}
            onChange={newValue => {
              setDate(newValue)
            }}
          />
        </LocalizationProvider>


        <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }} required>
          <InputLabel id='decisionMaker'>Decision Maker</InputLabel>
          <Select labelId='decisionMaker' id='decisionMaker' value={decisionMaker} label='decisionMaker' onChange={e => setDecisionMaker(e.target.value)}>
            {staffList?.map(item => {
              return (
                <MenuItem key={item?.stf_id} value={item?.stf_id}>
                  {item?.stf_firstname} {item?.stf_lastname}
                </MenuItem>
              )
            })}
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
          <Stack direction="row-reverse" spacing={2}>
            <Button variant="outlined" color="error" onClick={() => setIsEditing(false)} type="button">
              Cancel
            </Button>
            {allowPre.edit ? (
              <Button variant="outlined" type="submit">
                Update
              </Button>
            ) : (
              ''
            )}
          </Stack>
        </Box>
      </Box>
    </div>
    <Card className='update_card' >
        <CardContent className='updateChild' >
          <div className="uppercase">
            <Typography variant="h5"> <span> {createDate} </span> </Typography>
          
            <Typography variant="h5">{updateDate ? <span>{updateDate}</span> : ""} </Typography>
          </div>
        </CardContent>
      </Card>
    </>
  
  );
};

export default Edit;
