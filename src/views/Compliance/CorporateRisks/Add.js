import React, { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

import Swal from 'sweetalert2';


import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {COMMON_ADD_FUN,BASE_URL,GET_PARTICIPANT_LIST,COMMON_GET_PAR,companyId, COMMON_NEW_ADD} from '../../../helper/ApiInfo'


import dayjs from 'dayjs';


const Add = ({ setIsAdding, setShow }) => {


  const [date, setDate] = useState('');
  const [levelOfRisk, setLevelOfRisk] = useState('');
  const [likelihood, setLikelihood] = useState('');
  const [consequences, setConsequences] = useState('');
  const [riskDescription, setRiskDescription] = useState('');
  const [mitigationStrategy, setMitigationStrategy] = useState('');
  const [monitoringStrategy, setMonitoringStrategy] = useState('');
  const [personOverseeing, setPersonOverseeing] = useState('');

  const [nextReviewDate, setNextReviewDate] = useState('')
  const [overseenBy, setOverseenBy] = useState('');

  const [staffId, setStaffId] = useState(null)
  const minSelectableDate = dayjs(date).add(1, 'day');
  const currentDate = new Date();

  useEffect(() => {
    const staff = localStorage.getItem('user')

    if (staff) {
      const convert = JSON.parse(staff)
      const finalStaff = convert?.stf_firstname
      const lname = convert?.stf_lastname
      const combine = `${finalStaff} ${lname}`
      const id = convert?.stf_id
      setPersonOverseeing(combine)
      setStaffId(id)

    }
  }, [])

  useEffect(() => {
    setShow(true)
    return () => setShow(false)
  }, [setShow])







  const handleAdd = e => {
    e.preventDefault();
 const emptyFields = [];
    if (!date) {
      emptyFields.push('Date');
    }
    if (!levelOfRisk) {
      emptyFields.push('Level of risk');
    }
    if (!likelihood) {
      emptyFields.push('Likelihood');
    }
    if (!consequences) {
      emptyFields.push('Consequences');
    }
    if (!riskDescription) {
      emptyFields.push('Risk description');
    }
    if (!mitigationStrategy) {
      emptyFields.push('Monitoring strategy');
    }
    if (!document) {
      emptyFields.push('Documented by');
    }
    if (!monitoringStrategy) {
      emptyFields.push('Monitoring strategy');
    }
    if (emptyFields.length > 0) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: `Please fill in the required fields: ${emptyFields.join(', ')}`,
        showConfirmButton: true,
      });
    }
    const checkStartDate = dayjs(`${date}`);

    const checkNextDate = dayjs(`${nextReviewDate}`);
    if (checkNextDate.isBefore(checkStartDate)) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: ' Next Review Date cannot be less than start date.',
        showConfirmButton: true
      });
    }
    const formattedDate = dayjs(date).format('YYYY-MM-DD');
    const formattedNextDate = dayjs(nextReviewDate).format('YYYY-MM-DD');

    const currentTime = dayjs().format('YYYY-MM-DD HH:mm');

    const data = {
      corp_date: formattedDate,
      corp_level: levelOfRisk,
      corp_liklyhod: likelihood,
      corp_consqncy: consequences,
      corp_stfid: staffId,
      corp_dscrptn: riskDescription,
      corp_mitistrgy: mitigationStrategy,
      corp_monistrgy: monitoringStrategy,
      corp_ovrseen: overseenBy,
      corp_rvudate: formattedNextDate,
      company_id:companyId,
      created_at:currentTime

    }
    let endpoint = 'insertData?table=fms_corprisk';
    let response = COMMON_NEW_ADD(BASE_URL, endpoint, data);
    response.then((data) => {

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
        <h1>Create Corporate Risk</h1>

        <LocalizationProvider dateAdapter={AdapterDayjs} sx={{ width: '50ch', m: 1 }}>
          <DatePicker label="Date" format='DD/MM/YYYY' minDate={dayjs(currentDate)} onChange={(newValue) => { setDate(newValue) }} />
        </LocalizationProvider>
        <FormControl sx={{ width: '50ch', m: 1 }} required>
          <InputLabel id='setType'>Level of risk</InputLabel>
          <Select
            labelId='Levelofrisk '
            id='Levelofrisks'
            value={levelOfRisk}
            label='Level of risk'
            onChange={e => setLevelOfRisk(e.target.value)}
          >  <MenuItem value="Low">Low</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="High">High</MenuItem>

          </Select>
        </FormControl>

        <FormControl sx={{ width: '50ch', m: 1 }}required>
          <InputLabel id='setType'>Likelihood</InputLabel>
          <Select
            labelId='Likelihood'
            id='Likelihoods'
            value={likelihood}
            label='Likelihood'
            onChange={e => setLikelihood(e.target.value)}
          >  <MenuItem value="Rare">Rare</MenuItem>
            <MenuItem value="Unlikely">Unlikely</MenuItem>
            <MenuItem value="Possible">Possible</MenuItem>
            <MenuItem value="Likely">Likely</MenuItem>
            <MenuItem value="Almost Certain">Almost Certain</MenuItem>


          </Select>
        </FormControl>
        <FormControl sx={{ width: '50ch', m: 1 }} required>
          <InputLabel id='setType'>Consequences</InputLabel>
          <Select
            labelId='Consequences '
            id='Consequence'
            value={consequences}
            label='Consequences'
            onChange={e => setConsequences(e.target.value)}
          >  <MenuItem value="Minimal">Minimal</MenuItem>
            <MenuItem value="Minor">Minor</MenuItem>
            <MenuItem value="Moderate">Moderate</MenuItem>
            <MenuItem value="Significant">Significant</MenuItem>
            <MenuItem value="ASevere">Severe</MenuItem>


          </Select>
        </FormControl>





        <TextField
          required
          label='Risk description'
          multiline
          rows={4}
          value={riskDescription}
          onChange={e => {
            setRiskDescription(e.target.value)
          }}
        />
        <TextField
          required
          multiline
          rows={4}
          label='Mitigation strategy'
          value={mitigationStrategy}
          onChange={e => {
            setMitigationStrategy(e.target.value)
          }}
        />


        <TextField
          required
          multiline
          rows={4}
          label='Monitoring strategy'
          value={monitoringStrategy}
          onChange={e => {
            setMonitoringStrategy(e.target.value)
          }}
        />


        <FormControl sx={{ width: '50ch', m: 1 }} required>
          <InputLabel id='PersonOverseeing'>Person overseeing</InputLabel>
          <Select
            labelId='PersonOverseeings'
            id='Personoverseeing'
            value={personOverseeing}
            label='Person Overseeing'
            onChange={e => setPersonOverseeing(e.target.value)}
          >

            <MenuItem style={{ display: 'none' }} value={personOverseeing}>{personOverseeing}</MenuItem>


          </Select>
        </FormControl>


        <LocalizationProvider dateAdapter={AdapterDayjs} style={{ width: '50ch', marginBottom: '15px' }}>
          <DatePicker label="Next review date" format='DD/MM/YYYY' minDate={dayjs(minSelectableDate)} onChange={(newValue) => { setNextReviewDate(newValue) }} />
        </LocalizationProvider>


        <TextField
       

          label='Overseen By'
          value={overseenBy}
          onChange={e => {
            setOverseenBy(e.target.value)
          }}
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

