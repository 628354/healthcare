import React, { useContext, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
//import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
//select field
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Card, CardContent,Typography } from '@mui/material'
import {COMMON_GET_PAR,GET_PARTICIPANT_LIST,COMMON_UPDATE_FUN, BASE_URL,COMMON_GET_FUN } from '../../../helper/ApiInfo'
import Chip from '@mui/material/Chip';

import Swal from 'sweetalert2';
import AuthContext from 'views/Login/AuthContext'

const Edit = ({ selectedEmployee, setIsEditing,allowPre}) => {
  //console.log(selectedEmployee);

  const {companyId}=useContext(AuthContext)
  const id = selectedEmployee.team_id;
  const [teamName, setTeamName] = useState(selectedEmployee.team_name);
  const [staff, setStaff] = useState(selectedEmployee.team_stfid.split(','));
  const [staffList, setStaffList] = useState([])
  const [participant, setParticipant] = useState(selectedEmployee.team_partcpnts.split(','));
  const [participantList, setParticipantList] = useState([])
  const [staffOpen, setStaffOpen] = useState(false);
  const [participantOpen, setParticipantOpen] = useState(false);
  const[updateDate ,setUpdateDate]=useState(null)
  const[createDate ,setCreateDate]=useState(null)
  useEffect(() => {
    if (selectedEmployee) {
      const updateData = selectedEmployee && selectedEmployee.updated_at

      if (updateData) {
        const [updateDate, updateTime] = (updateData && updateData.split(' ')) ?? [];
        const [year, month, day] = (updateDate && updateDate.split('-')) ?? [];
        const formattedDate = `${day}-${month}-${year}`;
        const formattedTime = updateTime.substr(0, 5);
        const final = (formattedDate === '00-00-0000' && formattedTime === '00:00') ? null : `Last Updated : ${formattedDate} : ${formattedTime}`;
        setUpdateDate(final)
      }
      const createData = selectedEmployee.created_at

      if (createData) {
        const [createDate, createTime] = (createData && createData.split(' ')) ?? [];
        const [createyear, createmonth, createday] = (createDate && createDate.split('-')) ?? [];
        const formattedCreateDate = `${createday}-${createmonth}-${createyear}`;
        const formattedCreateTime = createTime.substr(0, 5);
        const final = `Created: ${formattedCreateDate} : ${formattedCreateTime}`
        setCreateDate(final)
      }
    }
  }, [selectedEmployee]);
  const getRole = async () => {
    try {
      let response = await COMMON_GET_PAR(GET_PARTICIPANT_LIST.participant+companyId)
      if(response.status) {  
        setParticipantList(response.messages)
       
      } else {
        throw new Error('Network response was not ok.')
      }
    } catch (error) {
      console.error('Error fetching staff data:', error)
    }
  }
  
  
  
    const getStaff = async () => {
      try {
        let response = await COMMON_GET_PAR(GET_PARTICIPANT_LIST.staff+companyId)
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
      getRole();
    }, [])
    const handleClose = () => {
      setStaffOpen(false); 
      setParticipantOpen(false); 
  
    };
  const handleUpdate = e => {
    e.preventDefault();

    if (!teamName) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Name field required.',
        showConfirmButton: true,
      });
    }

    const currentTime = dayjs().format('YYYY-MM-DD HH:mm');
    
    const formData = new FormData()
    formData.append('team_name',teamName)
    formData.append('team_stfid',staff)
    formData.append('team_partcpnts',participant)
    formData.append('updated_at',currentTime)
      
    let endpoint = 'updateStaff?table=fms_stf_team&field=team_id&id='+id;
    let response = COMMON_UPDATE_FUN(BASE_URL,endpoint,formData);
      response.then((data)=>{
         
          if(data.status){
            Swal.fire({
              icon: 'success',
              title: 'Updated!',
              text: `data has been Updated.`,
              showConfirmButton: false,
              timer: 1500,
            });
            setIsEditing(false);
          }else{
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


    <>
        <div className="small-container">

<Box
  component="form"
 
  sx={{
    '& .MuiTextField-root': { m: 1, width: '50ch' },
    //bgcolor:'#FFFFFF'
  }}
  noValidate
  autoComplete="off"
  onSubmit={handleUpdate}
>
  <h1>Edit Team</h1>
    <TextField
      required
      value={teamName}
      label="Name"
      onChange={(e)=>{setTeamName(e.target.value)}}
    />

<FormControl sx={{ width: '50ch', m: 1 }} required>
    <InputLabel id='Staff'>Staff</InputLabel>
    <Select
      labelId='Staff'
      id='Staff'
      value={staff}
      label='Staff'
      open={staffOpen}
     onOpen={() => setStaffOpen(true)} 
    onClose={() => setStaffOpen(false)} 
      multiple 
      onChange={(e) => {
        setStaff(e.target.value);
        handleClose(); 
      }}
      renderValue={(selected) => (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {selected?.map((value) => 
         {
          const selectedPractitioner = staffList.find(item => item?.stf_id === value);
          // //console.log(value);
          return (
            <Chip
            key={value}
            label={selectedPractitioner?.stf_firstname}
            onDelete={() => handleDelete(value)}
            sx={{ backgroundColor: 'blue', color: 'white', marginRight: 1, marginBottom: 1, borderRadius: '8px', borderRadiusBottomRight: 0, borderRadiusTopRight: 0 }}
          />
          
          )
          })}
        </div>
      )}
    >
      {
        staffList?.map((item)=>{
       
          return(
            <MenuItem key={item?.stf_id} value={item?.stf_id}>{item?.stf_firstname} {item?.stf_lastname}</MenuItem>

          )

        })
      }
    </Select>
  </FormControl>
  <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }} required>
    <InputLabel id='Participant'>Participant</InputLabel>
  
    <Select
      labelId='Participant'
      id='Participant'
      value={participant}
      label='Participant'
      open={participantOpen}
     onOpen={() => setParticipantOpen(true)} 
    onClose={() => setParticipantOpen(false)} 
      multiple 
      onChange={(e) => {
        setParticipant(e.target.value);
        handleClose(); 
      }}
      renderValue={(selected) => (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {selected?.map((value) => 
         {
          const selectedPractitioner = participantList.find(item => item?.prtcpnt_id === value);
          // //console.log(value);
          return (
            <Chip
            key={value}
            label={selectedPractitioner?.prtcpnt_firstname}
            onDelete={() => handleDelete(value)} 
            sx={{ backgroundColor: 'blue', color: 'white', marginRight: 1, marginBottom: 1, borderRadius: '8px', borderRadiusBottomRight: 0, borderRadiusTopRight: 0 }}
          />
          
          )
          })}
        </div>
      )}
    >
      {
        participantList?.map((item)=>{
       
          return(
            <MenuItem key={item?.prtcpnt_id} value={item?.prtcpnt_id}>{item?.prtcpnt_firstname} {item?.prtcpnt_lastname}</MenuItem>

          )

        })
      }
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