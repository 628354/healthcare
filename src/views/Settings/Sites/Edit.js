import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

//select field
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Card, CardContent,Typography } from '@mui/material'
import Swal from 'sweetalert2';
import { Upload } from 'antd';
import Chip from '@mui/material/Chip';
import { BASE_URL, COMMON_GET_PAR, COMMON_UPDATE_FUN, GET_PARTICIPANT_LIST } from 'helper/ApiInfo';

const Edit = ({ selectedData, setIsEditing, allowPre }) => {
  console.log(selectedData);
  // const currentDate = new Date();
  const id = selectedData.site_id;
  const currentTime = dayjs().format('YYYY-MM-DD HH:mm');
  const[updateDate ,setUpdateDate]=useState(null)
  const[createDate ,setCreateDate]=useState(null)
  const [name, setName] = useState(selectedData.site_name)
  const [location, setLocation] = useState(selectedData.site_location)

  const [participant, setParticipant] = useState(selectedData.site_Participants.split(','));
  const [participantList, setParticipantList] = useState([])
  const [participantOpen, setParticipantOpen] = useState(false);


  const handleClose = () => {
    setParticipantOpen(false);


  };

  const getRole = async () => {
    try {
      let response = await COMMON_GET_PAR(GET_PARTICIPANT_LIST.participant)
      if(response.status) {  
        setParticipantList(response.messages)
       
      } else {
        throw new Error('Network response was not ok.')
      }
    } catch (error) {
      console.error('Error fetching staff data:', error)
    }
  }

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

    getRole();
  }, [])




  const handleUpdate = (e) => {
    e.preventDefault();

    if (!name) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'All fields are required.',
        showConfirmButton: true
      });
    }


    const formData = new FormData();
    formData.append('site_name', name);
    formData.append('site_location', location);
    formData.append('site_Participants', participant);
    formData.append('updated_at', currentTime);

    let endpoint = 'updateAll?table=fms_setting_site&field=site_id&id=' + id

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
        <h1>Edit Site</h1>
        <TextField
          value={name}
          label="Name"
          type="text"

          onChange={(e) => { setName(e.target.value) }}
        />
        <TextField
          value={location}
          label="Location"
          type="text"

          onChange={(e) => { setLocation(e.target.value) }}
        />




        <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }} required>
          <InputLabel id='participant'>Participant</InputLabel>
          <Select
  labelId='participant'
  id='participant'
  value={participant}
  label='Participant'
  open={participantOpen}
  onOpen={() => setParticipantOpen(true)} 
  onClose={handleClose} 
  multiple 
  onChange={(e) => {
    setParticipant(e.target.value);
    handleClose(); 
  }}
  renderValue={(selected) =>{
    console.log(selected);
    return(
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {selected?.map((value) => {
        const selectedParticipant = participantList.find(item => item?.prtcpnt_id === value);
        console.log(selected);
        return (
          <Chip
            key={value}
            label={`${selectedParticipant?.prtcpnt_firstname} ${selectedParticipant?.prtcpnt_lastname}`}
            onDelete={() => { handleDelete(value); handleChipClick(); }}
            sx={{ backgroundColor: 'blue', color: 'white', marginRight: 1, marginBottom: 1, borderRadius: '8px', borderRadiusBottomRight: 0, borderRadiusTopRight: 0 }}
          />
        );
      })}
    </div>
  )}
  }
>
  {participantList?.map((item) => (
    <MenuItem key={item?.prtcpnt_id} value={item?.prtcpnt_id}>
      {`${item?.prtcpnt_firstname} ${item?.prtcpnt_lastname}`}
    </MenuItem>
  ))}
</Select>

        </FormControl>

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
