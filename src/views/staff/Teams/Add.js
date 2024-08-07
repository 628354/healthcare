import React, { useContext, useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import dayjs from 'dayjs'

import CloseIcon from '@mui/icons-material/Close';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import Swal from 'sweetalert2';
import { BASE_URL, COMMON_ADD_FUN, COMMON_GET_PAR, GET_PARTICIPANT_LIST,  } from 'helper/ApiInfo';
import AuthContext from 'views/Login/AuthContext';

const Add = ({setIsAdding }) => {
  const {companyId} = useContext(AuthContext);

  const [teamName, setTeamName] = useState('');
  const [staff, setStaff] = useState([]);
  const [staffList, setStaffList] = useState([])
  const [participant, setParticipant] = useState([]);
  const [participantList, setParticipantList] = useState([])
  const [staffOpen, setStaffOpen] = useState(false);
  const [participantOpen, setParticipantOpen] = useState(false);

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
    
  const handleAdd = e => {
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
    formData.append('created_at',currentTime)
    formData.append('company_id',companyId)
  
    let endpoint = 'insertStaffMedia?table=fms_stf_team'
    let response = COMMON_ADD_FUN(BASE_URL,endpoint,formData);
      response.then((data)=>{
          // //console.log(data.status);
          //return data;
          if(data.status){
            Swal.fire({
              icon: 'success',
              title: 'Added!',
              text: `${teamName}'s data has been Added.`,
              showConfirmButton: false,
              timer: 1500,
            });
            setIsAdding(false);
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
  const handleDelete = (value, type,e) => {
console.log(staffOpen);
console.log(participantOpen);
setStaffOpen(false)
    if (type === 'staff') {
      const updatedStaff = staff.filter((item) => item !== value);
      setStaff(updatedStaff);
    } else if (type === 'participant') {
      const updatedParticipants = participant.filter((item) => item !== value);
      setParticipant(updatedParticipants);
    }
    
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
        <h1>Create Team</h1>
          <TextField
            required
            
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
                return (
                  <Chip
                  clickable
                 onDelete={(e) => {
                        e.stopPropagation();
                        handleDelete(value, 'staff');
                      }}
                  key={value}
                  label={`${selectedPractitioner?.stf_firstname} ${selectedPractitioner?.stf_lastname} `}
                  sx={{ backgroundColor: 'blue', color: 'white', marginRight: 1, marginBottom: 1, borderRadius: '8px', borderRadiusBottomRight: 0, borderRadiusTopRight: 0,cursor:'pointer'}}
                
                  
                  deleteIcon={<CloseIcon className='test555'  />}
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
                  onDelete={() => handleDelete(value,"participant")} 
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
          
          <Box sx={{width: '100ch',m:1}}>
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