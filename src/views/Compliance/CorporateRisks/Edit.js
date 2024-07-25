import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { Card, CardContent,Typography } from '@mui/material'
import Select from '@mui/material/Select'
import '../../../style/document.css'

import Swal from 'sweetalert2'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import { BASE_URL, COMMON_GET_PAR, COMMON_UPDATE_FUN, GET_PARTICIPANT_LIST } from 'helper/ApiInfo'


const Edit = ({ selectedData, setIsEditing, setShow }) => {
  const currentDate = new Date();

  const id = selectedData.corp_id;
  const [date, setDate] = useState(selectedData.corp_date ? dayjs(selectedData.corp_date) : null);
  const [levelOfRisk, setLevelOfRisk] = useState(selectedData.corp_level);
  const [likelihood, setLikelihood] = useState(selectedData.corp_liklyhod);
  const [consequences, setConsequences] = useState(selectedData.corp_consqncy);

  const [personOverseeing, setPersonOverseeing] = useState(selectedData.corp_stfid);
  const [personOverseeingList, setPersonOverseeingList] = useState([]);

  const [riskDescription, setRiskDescription] = useState(selectedData.corp_dscrptn);
  const [mitigationStrategy, setMitigationStrategy] = useState(selectedData.corp_mitistrgy);
  const [monitoringStrategy, setMonitoringStrategy] = useState(selectedData.corp_monistrgy);

  const [overseenBy, setOverseenBy] = useState(selectedData.corp_ovrseen);
  const [nextReviewDate, setNextReviewDate] = useState(selectedData.corp_rvudate === "0000-00-00" ? '' : selectedData.corp_rvudate)

  const minSelectableDate = dayjs(date).add(1, 'day');
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
    setShow(true)
    return () => setShow(false)
  }, [setShow])



  // get oversee

  const getOversee = async () => {
    try {
      let response = await COMMON_GET_PAR(GET_PARTICIPANT_LIST.staff)
      if(response.status) {  
        setPersonOverseeingList(response.messages)
       
      } else {
        throw new Error('Network response was not ok.')
      }
    } catch (error) {
      console.error('Error fetching staff data:', error)
    }

  }

  useEffect(() => {

    getOversee()
  }, [])




  const handleUpdate = e => {
    e.preventDefault()
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
    const dateFormat = date ? date.format('YYYY-MM-DD') : null
    const newdateFormat = nextReviewDate ? nextReviewDate.format('YYYY-MM-DD') : null
    const currentTime = dayjs().format('YYYY-MM-DD HH:mm');
    const formData = new FormData()
    formData.append('corp_date', dateFormat)
    formData.append('corp_level', levelOfRisk)
    formData.append('corp_liklyhod', likelihood)
    formData.append('corp_consqncy', consequences)
    formData.append('corp_stfid', personOverseeing)
    formData.append('corp_dscrptn', riskDescription)
    formData.append('corp_mitistrgy', mitigationStrategy)
    formData.append('corp_monistrgy', mitigationStrategy)
    formData.append('corp_ovrseen', overseenBy)
    formData.append('corp_rvudate', newdateFormat)
    formData.append('updated_at', currentTime)



    let endpoint = 'updateAll?table=fms_corprisk&field=corp_id&id=' + id
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
        setIsEditing(false)
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
  <h1>Edit Corporate Risk</h1>
  <LocalizationProvider dateAdapter={AdapterDayjs} >
    <DatePicker label="Date" format='DD/MM/YYYY' minDate={dayjs(currentDate)} value={dayjs(date)} onChange={(newValue) => { setDate(newValue) }} />
  </LocalizationProvider>
  <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }} required>
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

  <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }} required>
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
  <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }} required>
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


  <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }} required>
    <InputLabel id='PersonOverseeing'>Person overseeing</InputLabel>
    <Select
      labelId='PersonOverseeings'
      id='Personoverseeing'
      value={personOverseeing}
      label='Person Overseeing'
      onChange={e => setPersonOverseeing(e.target.value)}
    >
      {
        personOverseeingList?.map((item) => {

          return (

            <MenuItem key={item?.stf_id} value={item?.stf_id}>{item?.stf_firstname} {item?.stf_lastname}</MenuItem>

          )

        })
      }
    </Select>
  </FormControl>



  <LocalizationProvider dateAdapter={AdapterDayjs} >
    <DatePicker label="Next review date" format='DD/MM/YYYY' minDate={dayjs(minSelectableDate)} onChange={(newValue) => { setNextReviewDate(newValue) }} value={dayjs(nextReviewDate)} />
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
      <Button variant="outlined" color="error" onClick={() => setIsEditing(false)} type="button">Cancel</Button>
      <Button variant="outlined" type="submit" >Submit</Button>

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

  )
}

export default Edit
