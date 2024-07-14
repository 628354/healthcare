import React, { useState } from 'react';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Button, FormControl, FormControlLabel, FormGroup, FormHelperText, Grid, IconButton, InputAdornment, InputLabel, MenuItem, Radio, RadioGroup, Select, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import '../../../style/Roster.css';
const General = () => {


  return (
    <div className='container'  >


      <div className='general_sec'>
        <div className='general_sec_child1'>
          <div className='general_inp'>
            <LocalizationProvider dateAdapter={AdapterDayjs} className="test23" >
              <DatePicker
                label='Last roster start date'
                className="popup_pickers"
                format='DD/MM/YYYY'
              // value={cellClickDate}

              />
            </LocalizationProvider>

            <FormControl className='general_inp' required>
              <InputLabel id='select'>Roster cycle </InputLabel>
              <Select
                labelId='select'
                id='select'
                label='select'
                className="popup_pickers"

              // onChange={e => setSelectDay(e.target.value)}
              // value={selectDay}
              >

                <MenuItem value='Weekly'>Weekly</MenuItem>
                <MenuItem value='Fortnightly'>Fortnightly</MenuItem>

              </Select>
            </FormControl>
          </div>

          <button className='general_btn' type='submit'>Save</button>
        </div>
        <div className='general_sec_child2'>
          <h2>Accounting</h2>
          <div className='general_below'>
            <div className='general_circile'></div>
            <button className='general_disconnect'>
              Disconnect
            </button>

          </div>

        </div>

      </div>

    </div>
  )
}

export default General;
