import React, { useContext, useEffect, useState } from 'react'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import dayjs from 'dayjs'
import { Upload } from 'antd'
import { BASE_URL, COMMON_ADD_FUN,COMMON_NEW_ADD, } from 'helper/ApiInfo';

//select field
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select from '@mui/material/Select'
import Swal from 'sweetalert2'
import AuthContext from 'views/Login/AuthContext'

// import Switch from '@mui/material/Switch'

const Add = ({ setIsAdding, }) => {
  const {companyId} = useContext(AuthContext);

  const currentDate = new Date()
  const [code, setCode] = useState('')
  const [serviceName, setServiceName] = useState('')

  const [rateType, setRateType] = useState('')

  const [price, setPrice] = useState('')

  const [effectiveDate, setEffectiveDate] = useState('')
  








  const handleAdd = e => {
    e.preventDefault()
    const emptyFields = [];

    if (!code) {
      emptyFields.push('Code');
    }
    if (!serviceName) {
      emptyFields.push('Name');
    } 
    if (!rateType) {
      emptyFields.push('Rate Type');
    }
  
    if (emptyFields.length > 0) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: `Please fill in the required fields: ${emptyFields.join(', ')}`,
        showConfirmButton: true,
      });
    }
    const formattedDate = dayjs(effectiveDate).format('YYYY-MM-DD'); 
    const data = {
      
    service_code:code,
    rate_type:rateType,
    price:price,
    effective_date:formattedDate,
    services_name:serviceName,
    company_id:companyId
       
  }
console.log(data);
  
  let endpoint = 'insertData?table=services';
  let response = COMMON_NEW_ADD(BASE_URL,endpoint,data);
    response.then((data)=>{
        if(data.status){
          Swal.fire({
            icon: 'success',
            title: 'Added!',
            text: `data has been Added.`,
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
  }


  return (
    <div className='small-container'>
      <Box
        component='form'
        sx={{
          '& .MuiTextField-root': { m: 1, width: '50ch' }
          //bgcolor:'#FFFFFF'
        }}
        noValidate
        autoComplete='off'
        onSubmit={handleAdd}
      >
        <h1>Create Service</h1>
        <TextField
          // value={location}
          multiline
          label='Code'
          type='text'
          onChange={e => {
            setCode(e.target.value)
          }}
        />
 <TextField
          // value={location}
          multiline
          label='Name'
          type='text'
          onChange={e => {
            setServiceName(e.target.value)
          }}
        />

        

        <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }} required>
          <InputLabel id='rateType'>Rate type</InputLabel>
          <Select
            labelId='rateType'
            id='rateType'
            // value={meetingType}
            label='Rate Type'
            onChange={e => setRateType(e.target.value)}
          >

                <MenuItem value='Fixed'>Fixed</MenuItem>
                <MenuItem value='Per Unit'>Per Unit</MenuItem>

          </Select>
        </FormControl>
        <TextField
          label='Price'
          type='text'
          id='price'
          onChange={e => {
            setPrice(e.target.value)
          }}
        />

<LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label="Effective date" format='DD/MM/YYYY' onChange={(newValue) => {setEffectiveDate(newValue) }}  />
        </LocalizationProvider>

        <Box sx={{ width: '100ch', m: 1 }}>
          <Stack direction='row-reverse' spacing={2}>
            <Button variant='outlined' color='error' onClick={() => setIsAdding(false)} type='button'>
              Cancel
            </Button>
            <Button variant='outlined' type='submit'>
              Submit
            </Button>

            
          </Stack>
        </Box>
      </Box>
    </div>
  )
}

export default Add
