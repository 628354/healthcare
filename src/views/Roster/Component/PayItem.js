import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { BASE_URL, COMMON_ADD_FUN, COMMON_GET_FUN, COMMON_GET_PAR, GET_PARTICIPANT_LIST, companyId } from 'helper/ApiInfo'
import '../../../style/document.css'
import moment from 'moment'; // Import moment library for date manipulation
import CloseIcon from '@mui/icons-material/Close';
// import { Typography, Button, IconButton, Checkbox,FormControl, FormHelperText } from '@material-ui/core';
// import CloseIcon from '@material-ui/icons/Close';


// setOptions({
//   // localeJs,
//   // themeJs
// });
import { Box } from '@mui/system';
import { Button, FormControl, FormControlLabel, FormGroup, FormHelperText, Grid, IconButton, InputAdornment, InputLabel, MenuItem, Radio, RadioGroup, Select, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography } from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import SearchIcon from '@mui/icons-material/Search';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import AddIcon from '@mui/icons-material/Add';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import SettingsIcon from '@mui/icons-material/Settings';
import Input from '@mui/material/Input';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import dayjs from 'dayjs';
// import IconButton from '@mui/material/IconButton';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import PersonIcon from '@mui/icons-material/Person';
import { useNavigate } from 'react-router';


const Dashboard = () => {

  // roster work start 
  const [data, setData] = useState('Participant');
  const [selectDay, setSelectDay] = useState('Fortnightly');
  const [selectedData, setSelectedData] = useState([]);
  const [startDate, setStartDate] = useState(moment().startOf('week').add(1, 'days'));
  const [endDate, setEndDate] = useState(startDate.clone().add(13, 'days'));
  const [endDate2, setEndDate2] = useState(startDate.clone().add(6, 'days'));
   const [showDropdown, setShowDropdown] = useState(false)



  const [weekName, setWeekName] = useState([])

  const [startTime, setStartTime] = useState(null)
  const [endTime, setEndTime] = useState(null)





  const [serviceL, setServiceL] = useState([]);
// pay item states 

const [payLevel,setPaylevel]=useState([])

  const navigate = useNavigate();
  
  const handleClickSetting = () => {
    // console.log('yes');
    navigate('/roster/setting/tab')
  }

























  // roster work end 








  //  replace end text from id 
 

  //console.log(selectedData);


 
  

  const fetchPayLevel = async () => {
    let endpoint = 'getAll?table=fms_staff_pay_levels&select=pay_level_id,pay_level_name';
    try {
      let response = await COMMON_GET_FUN(BASE_URL, endpoint);
      if (response.status) {
        setPaylevel(response.messages);

       
      }
    } catch (error) {
      throw('Error fetching data:', error);
    }
  };



  const getServices = async () => {
    let endpoint = 'getAll?table=services&select=services_id,services_name';

    let response = await COMMON_GET_FUN(BASE_URL, endpoint)
    //  console.log(response);
    if (response.status) {

      setServiceL(response.messages)
    }

  }
  useEffect(()=>{
    fetchPayLevel()
    getServices()
    
  },[])
  return (
    <div className='container roster_pop' style={{marginTop:"10px"}}>

      <div className='roster_top_bar pay_item'>
        <Box className="roster_main">
        
<p>Pay Items</p>
       



        </Box>

        <div className='right_menu'>
          <div className='right_btn'>
            <Button variant="contained" className='pay_top_btn_xero'>Sync with xero</Button>
          </div>
          <div className=''>
          <Button variant="contained" className='pay_top_btn_save'>Save</Button>

            {/* <div className='right_icon pay_top_btn_save' onClick={handleShowDropDown}>Save</div> */}

          </div>
          {
            showDropdown ? <div className='roter_dropdown'>
              <Box sx={{ width: '100%', bgcolor: 'background.paper' }}>
                <nav aria-label="main mailbox folders">
                  <List className='dropdown_ul'>
                    <ListItem disablePadding className='dropdown_li' onClick={handleClickSetting}>
                      <ListItemButton className='dropdown_li_btn'>
                        <ListItemIcon >
                          <SettingsIcon  />
                        </ListItemIcon>
                        <ListItemText primary="Settings" />
                      </ListItemButton>
                    </ListItem>

                    {/* <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <DraftsIcon />
                </ListItemIcon>
                <ListItemText primary="Drafts" />
              </ListItemButton>
            </ListItem> */}
                  </List>
                </nav>
              </Box>
            </div> : ""
          }


        </div>
      </div>


      {/* <div>
        {datesWithWeeks.map((item, index) => (
          <div key={index}>
            <span>{item.weekName} </span> 
            <span>{item.date.format('DD MMM YYYY')}</span>
          
          </div>
        ))}
      </div>  */}
      <TableContainer sx={{ border: " 1px solid #ddd", marginBottom: "30px" }}>
        <Table sx={{ minWidth: 650, border: " 1px solid #ddd" }} aria-label="simple table">
          <TableHead>
            <TableRow sx={{ border: " 1px solid #ddd" }} >
              <TableCell className='payitem_table_header' sx={{ border: " 1px solid #ddd" }}>
              Services
              </TableCell>

              {payLevel.map((item, index) => {
                return (
                  <TableCell className='payitem_table_header' sx={{ border: " 1px solid #ddd" }} key={index}>{item?.pay_level_name}</TableCell>
                )
              })}

            </TableRow>
          </TableHead>
          <TableBody style={{ background: "white" }}>
         
            {
              serviceL.map((item)=>{

                return(
                  <TableRow key={item.services_id}>
                   <TableCell  className='payitem_td' >{item.services_name}</TableCell>

                   {payLevel.map((item, index) => {
                return (
                  <TableCell className='payitem_Tbcell' sx={{ border: " 1px solid #ddd" }} key={index}>


          <select
           labelId="demo-simple-select-label"
          id="itemtype_select"
           
            style={{border:"none"}}
            // onChange={e => setParticipant(e.target.value)}
          >
              <option value="" disabled selected>

  </option>
            {
              serviceL?.map((item)=>{
             
                return(
                  <option    style={{border:"none"}} key={item.services_id} value={item.services_name}><span  className='payitem_option'>{item.services_name}</span></option>

                )

              })
            }
          </select>
        
                  </TableCell>
                )
              })}
                   </TableRow>

                )
              })
            }
         
          </TableBody>
        </Table>
      </TableContainer>

    

    </div>
  )
}

export default Dashboard
