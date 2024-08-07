
export const BASE_URL = "https://tactytechnology.com/mycarepoint/api/";
export const IMG_BASE_URL = "https://tactytechnology.com/mycarepoint/upload/admin/users/";

 const getDatafromSession=localStorage.getItem("user")
// //console.log(getDatafromSession == "undefined"?"":JSON.parse(getDatafromSession)?.company_id);
export const companyId = getDatafromSession == "undefined"?"":JSON.parse(getDatafromSession)?.company_id;

// get participant list

export const GET_PARTICIPANT_LIST = {
    participant : `${BASE_URL}getWhereAll?table=fms_prtcpnt_details&field=prtcpnt_archive&value=1&prtcpnt_status=0&statusfields=prtcpnt_status&company_id=`,
    staff : `${BASE_URL}getWhereAll?table=fms_staff_detail&field=stf_archive&value=1&stf_status=0&statusfields=stf_status&company_id=`

  };

  
  export async function COMMON_GET_PAR(url) {
    try {
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      throw error;
    }
  }

  
//   common get function 
  export async function COMMON_GET_FUN(url, endpoint) {
    try {
      const response = await fetch(url + endpoint, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      //console.log(response);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    } catch (error) {
      console.error('There was a problem data:', error);
      throw error;
    }
  }

export async function COMMON_ADD_FUN(url, endpoint, data)  {
    try {
        const response = await fetch(url + endpoint, {
            method: "POST",
            body: data, 
          });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      throw error;
    }
  }

  export async function COMMON_NEW_ADD(url, endpoint, data) {
    try {
      const response = await fetch(url + endpoint, {
        method: 'POST',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
  //console.log(response);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
  
      return response.json();
    } catch (error) {
      console.error('Error:', error);
      throw new Error('An error occurred while processing your request.');
    }
  }
  

export async function COMMON_UPDATE_FUN(url, endpoint, data)  {
    try {
        const response = await fetch(url + endpoint, {
            method: "POST", 
            body: data, 
          });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    } catch (error) {
      console.error('There was a problem with the fetch operation:', error);
      throw error;
    }
  }




// export const getallUserRole = {
//     role : `${BASE_URL}getAll?table=fms_role_permissions&select=user_role,permission_id,permissions`
  
//   };

// export const  deleteUserRole={
//     delete:`${BASE_URL}deleteSelected?table=fms_role_permissions&field=permission_id&id=`
// }
// export const editUserRole={
//     edit:`${BASE_URL}getWhere?table=fms_role_permissions&field=permission_id&id=`
// }
