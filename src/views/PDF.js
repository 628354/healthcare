export const printEmployeesData = () => {
  const getDatafromSession = localStorage.getItem("currentData");
  const employees = getDatafromSession ? JSON.parse(getDatafromSession) : [];

  const imgS = employees.length > 0 ? employees[0]?.photo : "";

  const getDatafromLocal = localStorage.getItem("fieldName");
  const fieldName = getDatafromLocal ? JSON.parse(getDatafromLocal) : [];
  const companyName = localStorage.getItem("pageName") || "Company Name";

  const content = `
    <html>
      <head>
        <style>
          body {
            width: 100%;
            margin: 0;
            padding: 0;
            overflow: hidden;
          }
          .pdf_header {
            text-align: center;
            margin-bottom: 20px;
          }
          .pdf_img {
            max-width: 100px;
            max-height: 100px;
            display: block;
            margin: 0 auto;
          }
          h1 {
            font-size: 2rem;
            text-align: center;
            margin: 10px 0;
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
            padding-bottom: 10px;
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
        </style>
      </head>
      <body>
        <div class="pdf_header">
          <img class="pdf_img" src="${imgS ? `https://tactytechnology.com/mycarepoint/upload/admin/users/${imgS}` : ''}" alt="Employee Image">
          <h1 class="font-weight-bold text-capitalize">${companyName}</h1>
        </div>
        ${employees.map(employee => `
          <div class="page">
            ${fieldName.map(field => `
              <div class="align-items-baseline">
                <span class="font-weight-bold display-5 text-dark printHeading">
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

  const iframe = document.createElement('iframe');
  iframe.style.position = 'absolute';
  iframe.style.width = '0';
  iframe.style.height = '0';
  iframe.style.border = 'none';
  document.body.appendChild(iframe);

  // Ensure iframe is properly loaded
  iframe.onload = () => {
    const doc = iframe.contentDocument || iframe.contentWindow.document;
    doc.open();
    doc.write(content);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow.focus();
      iframe.contentWindow.print();
      document.body.removeChild(iframe);
    }, 500); // Delay for rendering
  };

  const doc = iframe.contentDocument || iframe.contentWindow.document;
  doc.open();
  doc.write('<html><body></body></html>'); // Initial empty content
  doc.close();
};
