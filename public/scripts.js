fetch('/theaters')
      .then(response => response.json())
      .then(data => {
        const tableBody = document.querySelector('#data-table tbody');
        data.forEach(row => {
          const tr = document.createElement('tr');
          tr.innerHTML = `
            <td hidden>${row.Theater_ID}</td>
            <td>${row.Theater_Name}</td>
            <td>${row.Location}</td>
            <td>${row.City}</td>
            <td>${row.EirCode}</td>
            <td>${row.Mobile}</td>
            <td>${row.Email}</td>
          `;
          tableBody.appendChild(tr);
        });
      })
      .catch(error => console.error('Error fetching data:', error));