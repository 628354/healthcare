import { BASE_URL, COMMON_ADD_FUN, COMMON_NEW_ADD, companyId } from "helper/ApiInfo";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { log } from "util";
// import { log } from "util";
// import { useNavigate } from "react-router-dom";

const AuthContext = createContext();


export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState();
  const [allowUser, setAllowUser] = useState()
  const [companyId, setCompanyId] = useState(null);
  const [message ,setMessage]=useState('')
  const navigate = useNavigate()
  // //console.log(permissions);
  // //console.log(allowUser);
  const localUser = localStorage.getItem('user')
  // //console.log(localUser);

  const finalUser = localUser == "undefined" ? "" : JSON.parse(localUser)
  useEffect(() => {


    const fetchPermissions = async () => {
      try {
        if (localUser) {
          const response = await fetch(`${BASE_URL}getWhere?table=fms_role_permissions&field=permission_id&id=${finalUser?.stf_role}`);
          const data = await response.json();
          //console.log(data);
          const res = data?.messages == "no data found" ? "" : JSON.parse(data?.messages?.permissions)

          setPermissions(res);
        }

      } catch (error) {
        throw ('Error fetching user list:', error);

      }


    };

    fetchPermissions();
  }, [localUser]);


  useEffect(() => {

  setCompanyId(finalUser?.company_id);




  }, [localUser])

  function getUsersWithTrue(data) {
    const usersWithTrue = [];

    if (Array.isArray(data)) {
      for (let obj of data) {
        const values = Object.values(obj).slice(1);
        if (values.some(value => value === true)) {
          usersWithTrue.push(obj);
        }
      }
    }
    return usersWithTrue;
  }




  useEffect(() => {
    // //console.log(permissions);
    const usersWithTrue = getUsersWithTrue(permissions);
    setAllowUser(usersWithTrue)

  }, [permissions])



  const loginUser = async (formData) => {
    try {
      const formData2 = new FormData();
      formData2.append('email', formData?.email);
      formData2.append('password', formData?.password);
  
      let endpoint = 'loginUser';
      let response = await COMMON_ADD_FUN(BASE_URL, endpoint, formData2);
  
      if (response.status) {
        setCompanyId(response?.data?.company_id);
        setTimeout(() => {
          navigate('/');
        }, 200);
        localStorage.setItem('user', JSON.stringify(response.data));
        setUser(response.data);
      } else {
        setUser(null);
        setMessage('Invalid email or password');
      }
    } catch (error) {
      console.error('Login error:', error);
      setUser(null);
      setMessage('An error occurred. Please try again later.');
    }
  };
  


  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    // localStorage.removeItem('user2');
    localStorage.removeItem('fieldName');
    localStorage.removeItem('companyName');
    localStorage.removeItem('currentData');

    navigate('/application/login');
  }


  // const [currentPath, setCurrentPath] = useState('');
  // const [finalPath, setFinalPath] = useState('');
  // const [resourceData, setResourceData] = useState([]);

  // // Effect to update currentPath on mount and when pathname changes
  // useEffect(() => {
  //   const updatePath = () => {
  //     const pathname = window.location.pathname;
  //     setCurrentPath(pathname);
  //   };

  //   updatePath(); // Initial update

  //   window.addEventListener('popstate', updatePath);

  //   return () => {
  //     window.removeEventListener('popstate', updatePath);
  //   };
  // }, []);

  // // Effect to transform currentPath into finalPath
  // useEffect(() => {
  //   const handleTransform = () => {
  //     const parts = currentPath.split('/');
  //     const lastSegment = parts[parts.length - 1];
  //     const transformedText = lastSegment
  //       .split('-')
  //       .map(word => word.charAt(0).toUpperCase() + word.slice(1))
  //       .join(' ');

  //     setFinalPath(transformedText);
  //   };

  //   handleTransform();
  // }, [currentPath]);


  // //console.log(finalPath);



  //     const fetchData = async () => {
  //       try {

  //         const url = `${BASE_URL}getAll?table=fms_setting_resource&select=resource_id,resource_date,resource_staff_id,resource_type,resource_title,company_id,resource_status,resource_clltntype,resource_status&company_id=${companyId}&fields=resource_status&status=0`;
  //         const response = await fetch(url, {
  //           method: 'GET',
  //           mode: 'cors',
  //           headers: {
  //             'Content-Type': 'application/json',
  //           },
  //         });
  //         const data = await response.json();
  //         if (data.status) {
  //           if (Array.isArray(data.messages) && data.messages.length > 0) {
  //             const filteredEmployees = data.messages.filter(employee => {
  //               //console.log(employee.resource_clltntype);

  //               const clltntypes = employee.resource_clltntype.split(',').map(item => item.trim());


  //               return clltntypes.some(name => name === finalPath);
  //             });
  //             setResourceData(filteredEmployees);

  //           } 
  //         }
  //       } catch (error) {
  //         console.error('Error fetching data:', error);
  //       }
  //     };

  // // //console.log(resourceData);
  //     useEffect(()=>{
  //       fetchData();

  //     },[])

  return (
    <AuthContext.Provider value={{

      loginUser,
      user,
      logout,
      permissions,
      allowUser,
      companyId,
      setMessage,
      message



    }}>
      {children}
    </AuthContext.Provider>
  ) 
}

export default AuthContext;