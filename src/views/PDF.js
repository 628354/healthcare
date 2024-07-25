export const printEmployeesData = () => {

    const getDatafromSession = localStorage.getItem("currentData");
    const employees = getDatafromSession === "undefined" ? [] : JSON.parse(getDatafromSession);
  
    const imgS = employees.length > 0 ? employees[0]?.photo : "";
  
    const getDatafromLocal = localStorage.getItem("fieldName");
    const fieldName = getDatafromLocal === "undefined" ? [] : JSON.parse(getDatafromLocal);
    const companyName = localStorage.getItem("pageName");
  

  
    const printWindow = window.open('', '', 'height=600,width=800');
  
    const content = `
      <html>
        <head>
          <title>Employees Data</title>
          <style>
           body{
           width:100%;
           }
            .page-header-space {
              height: 20px;
              text-align:center;
            }
            .page {
              padding: 10px;
             
              margin-bottom:15px;
            }
            h1 {
              font-size: 1rem;
              margin-bottom:10px;
            }
            .font-weight-bold {
              font-weight: bold;
            }
            .text-capitalize {
              text-transform: capitalize;
            }
            .h3 {
              font-size: 1rem;
              margin: 0;
            }
            .align-items-baseline {
              display: flex;
              align-items: baseline;
            }
            .printHeading {
              margin-right: 10px;
            }
            .display-5 {
              font-size: 1rem;
            }
            .text-dark {
              color: #6e6b7b;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              padding: 8px;
            }
            th {
              background-color: #f2f2f2;
            }
            h1 {
              font-size: 2rem;
              text-align: center;
              margin: 10px 0;
            }
              .pdf_header{
              text-align:center;
              }
          </style>
        </head>
        <body>
  
        <div class="pdf_header">
        <img class="pdf_img" src="https://tactytechnology.com/mycarepoint/upload/admin/users/${imgS}" alt="test image" onload="window.print()">
         <h1 class="font-weight-bold text-capitalize">${companyName}</h1></div>
         
        ${employees.map(employee => `
            <div class="page">
             
              ${fieldName.map(field => `
                <div class="align-items-baseline" style="padding-bottom: 10px;">
                  <span class="font-weight-bold display-5 text-dark printHeading h1">
                    <span style="padding-right: 1rem;">${field.headerName}:</span>
                    <span class="h3">
                      ${field.field === 'stf_firstname' ? `${employee.stf_firstname} ${employee.stf_lastname}` :
                        field.field === 'prtcpnt_firstname' ? `${employee.prtcpnt_firstname} ${employee.prtcpnt_lastname}` :
                        employee[field.field]
                      }
                    </span>
                  </span>
                </div>
              `).join('')}
              <h1>----------------</h1>
            </div>
          `).join('')}
        </body>
      </html>
    `;
    
    printWindow.document.write(content);
    printWindow.document.close();

  };
  