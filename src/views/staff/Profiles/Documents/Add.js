import React, { useEffect, useState } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
//import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
//select field
//import InputLabel from '@mui/material/InputLabel';
//import MenuItem from '@mui/material/MenuItem';
//import FormControl from '@mui/material/FormControl';
//import Select from '@mui/material/Select';
import Swal from 'sweetalert2';
import dayjs from 'dayjs'

import Switch from '@mui/material/Switch';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

// css import 
import '../../../../style/document.css'
import { Upload } from 'antd';
import { useSelector } from 'react-redux';
// import { UploadOutlined } from '@ant-design/icons';


const Add = ({setIsAdding,final,staffId}) => {
  const CurrentDate =new Date();
  // const participantdata=useSelector(state=>state.participantData)
  // const parData =participantdata.participantdata?.prtcpnt_firstname ;
  // const lastName=participantdata.participantdata?.prtcpnt_lastname;
  // const final=`${parData}  ${lastName}`

  const [participant, setParticipant] = useState(final);
    const [category, setCategory] = useState('');
    const [type, setType] = useState('');
    const [attachment, setAttachment] = useState([]);
    const [note, setNote] = useState('');
    const [hasExpiryDate, setHasExpiryDate] = useState(false);
    const [expiryDate, setExpiryDate] = useState('');
  
    const [categoryList, setCategoryList] = useState([])
    const [typeList, setTypeList] = useState([])
  
  // const [role, setRole] = useState('');
  
  // const [status, setStatus] = useState('');
  
  
  // console.log(hasExpiryDate);
  // console.log(attachment);
 
  const getAdminstrationType = async () => {
    let url = "https://tactytechnology.com/mycarepoint/api/";
    let endpoint = 'getAll?table=staff_doc_categories&select=categorie_id,categorie_name,company_id';


    let response = await fetch(`${url}${endpoint}`, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        //'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    if (response.ok) {
      const res = await response.json()
      setCategoryList(res.messages)
      // console.log(res);
    }

  }

  const getType = async () => {
    let url = "https://tactytechnology.com/mycarepoint/api/";
    let endpoint = `getWhereAll?table=fms_staff_doc_name&field=categorie_id&value=${category}`;


    let response = await fetch(`${url}${endpoint}`, {
      method: "GET", // *GET, POST, PUT, DELETE, etc.
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        //'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    if (response.ok) {
      const res = await response.json()
      setTypeList(res.messages)
      console.log(res);
    }

  }

  useEffect(() => {
    getType()
  }, [category])

  useEffect(() => {
    
    getAdminstrationType()
  }, [])
const handleAddRow=()=>{
 
  setHasExpiryDate((prevValue) => !prevValue);
  
  
}

const handleChange = (info) => {
  // console.log(info);
  const names = info.fileList.map((file) => file.name);
  setAttachment(names);
};




  const handleAdd = e => {
    e.preventDefault();

    if (!category) {
      return Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'All fields are required.',
        showConfirmButton: true,
      });
      
    }
   

    //const id = employees.length + 1+1;
    // const fileName = attachment.split('\\').pop().split('/').pop();
    const attachmentText = attachment.join(', ');
    const data = {
           doc_prtcpntid:staffId,
           doc_prtcpntname:final,
            doc_ctgry:category,
            doc_type:type,
            doc_attchmnt:attachmentText,
            doc_notes:note,
            doc_exp:hasExpiryDate,
            doc_expdate:expiryDate,
    }
    // console.log(data);

    /* employees.push(newEmployee);
    localStorage.setItem('employees_data', JSON.stringify(employees));
    setEmployees(employees); 
    setIsAdding(false); */
    //let url = process.env.REACT_APP_BASE_URL;
    
    let url="https://tactytechnology.com/mycarepoint/api/";
    let endpoint = 'insertData?table=fms_prtcpnt_documts';
    let response = add(url,endpoint,data);
      response.then((data)=>{
          // console.log(data.status);
          // console.log("check",data)
          //return data;
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
    
  };

  
  async function add(url,endpoint,data){
        // console.log(data);
        // console.log('console from function');
       const response =  await fetch( url+endpoint,{
                                    method: "POST", // *GET, POST, PUT, DELETE, etc.
                                    mode: "cors",
                                    headers: {
                                      "Content-Type": "application/json",
                                      //'Content-Type': 'application/x-www-form-urlencoded',
                                    },
                                    body: JSON.stringify(data), // body data type must match "Content-Type" header
                                  }); 
        return response.json();
  }  
 
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
         <h1>Add Document</h1>
     
  <FormControl sx={{width: '50ch',m:1}}>
            <InputLabel id="Participant">Participant</InputLabel>
            <Select
              labelId="participant"
              id="Participant"
              value={participant}
              label="Participant"
              onChange={(e)=>{setParticipant(e.target.value)}}

            >
                     <MenuItem   style={{ display: 'none' }} value={participant}>{participant}</MenuItem>
                 

              
            </Select>
          </FormControl>
       
          <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }}>
          <InputLabel id="select-four-label">Category</InputLabel>
          <Select
            labelId="select-four-label"
            id="select-four-label"
            value={category}
            label="Status"
            onChange={(e) => { setCategory(e.target.value) }}
            required

          >
            {
              categoryList?.map((item) => {

                return (
                  <MenuItem key={item?.categorie_id} value={item?.categorie_id}>{item?.categorie_name}</MenuItem>

                )

              })
            }



          </Select>
        </FormControl>

          
        <FormControl id="selecet_tag_w" className="desk_sel_w"  sx={{ m: 1 }}>
          <InputLabel id="select-four-label">Type</InputLabel>
          <Select
            labelId="select-four-label"
            id="select-four-label"
            value={type}
            label="Status"
            onChange={(e) => { setType(e.target.value) }}


          >
            {
              Array.isArray(typeList) && typeList.length > 0 ? (
                typeList.map((item) => (
                  <MenuItem key={item?.category_document_id} value={item?.category_document_id}>
                    {item?.category_document_name}
                  </MenuItem>
                ))
              ) : (
                <MenuItem value="">No types available</MenuItem>
              )
            }



          </Select>
        </FormControl>
           <TextField
          
            multiline
            label="Notes"
            type="text"
            onChange={(e)=>{setNote(e.target.value)}}
          />

		
		
		<Switch label="Expiry date" onClick={handleAddRow} /> <br></br>
			
          {/* date picker field */}
         
       {
    hasExpiryDate ? (
      <div>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker label="Expiry date" format='DD/MM/YYYY'  minDate={dayjs(CurrentDate)}  onChange={(newValue) => { setExpiryDate(newValue) }} />
        </LocalizationProvider>
      </div>
    ) : null
  }
          
         
       
          <Upload style={{ width: '100px', display: 'flex', flexDirection: 'row-reverse' }} multiple listType="picture-card" onChange={handleChange} >
    <Button size='small'>Click here or Drag and drop a file in this area</Button>
</Upload>

          
          
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

