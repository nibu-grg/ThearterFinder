document.addEventListener("DOMContentLoaded", function () {
  fetch('/theaters')
    .then(response => response.json())
    .then(data => {
      const tableBody = document.querySelector('#data-table tbody');
      tableBody.innerHTML = '';
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
          <td>
            <button class="delete-btn" data-id="${row.Theater_ID}">
              <i class="fa fa-trash" aria-hidden="true"></i>
            </button>
            <button class="edit-btn" data-id="${row.Theater_ID}" data-name="${row.Theater_Name}" data-location="${row.Location}" data-city="${row.City}" data-eircode="${row.EirCode}" data-mobile="${row.Mobile}" data-email="${row.Email}">
              <i class="fa fa-edit" aria-hidden="true"></i>
            </button>
          </td>
        `;
        tableBody.appendChild(tr);
      });

      document.querySelector('#data-table').addEventListener('click', function (e) {
        if (e.target && e.target.classList.contains('delete-btn')) {
          const theaterId = e.target.getAttribute('data-id'); 
          deleteTheater(theaterId);  
        }
      });

      document.querySelector('#data-table').addEventListener('click', function (e) {
        if (e.target && e.target.classList.contains('edit-btn')) {
          const theaterData = {
            Theater_ID: e.target.getAttribute('data-id'),
            Theater_Name: e.target.getAttribute('data-name'),
            Location: e.target.getAttribute('data-location'),
            City: e.target.getAttribute('data-city'),
            EirCode: e.target.getAttribute('data-eircode'),
            Mobile: e.target.getAttribute('data-mobile'),
            Email: e.target.getAttribute('data-email')
          };
          sessionStorage.setItem('theaterData', JSON.stringify(theaterData));
          window.location.href = 'add.html';
        }
      });
    })
    .catch(error => console.error('Error fetching theaters:', error));
});



function search() {
  const eircode = document.getElementById("eircode").value.trim();
  if (!eircode) {
    alert('Please enter an EirCode to search.');
    return;
  }
  fetch(`/search?EirCode=${encodeURIComponent(eircode)}`)
    .then(response => response.json())
    .then(data => {
    const tableBody = document.querySelector('#data-table tbody');
    tableBody.innerHTML = ''; 
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
  .catch(error => console.error('Error fetching search results:', error));
}

function deleteTheater(theaterId) {
  if (!confirm('Are you sure you want to delete this theater?')) return;

  fetch(`/deleteTheater/${theaterId}`, {
    method: 'DELETE',
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to delete theater');
      }
      return response.json();
    })
    .then(data => {
      alert(data.message || 'Theater deleted successfully');
      const row = document.getElementById(`row-${theaterId}`);
      if (row) row.remove();
    })
    .catch(error => {
      console.error('Error deleting theater:', error);
      alert('Error deleting theater.');
    });
}
