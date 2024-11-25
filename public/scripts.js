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
        `;
        tableBody.appendChild(tr);
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


// document.addEventListener("DOMContentLoaded", function () {
//   document.getElementById("Theateradd").addEventListener("submit", function (event) {
//     event.preventDefault(); 
//     const formData = {
//       Theater_Name: document.getElementById("theater_name").value,
//       Location: document.getElementById("location").value,
//       City: document.getElementById("city").value,
//       EirCode: document.getElementById("eircode").value,
//       Mobile: document.getElementById("mobile").value,
//       Email: document.getElementById("email").value
//     };

//     fetch('/addTheater', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json'
//       },
//       body: JSON.stringify(formData)
//     })
//       .then(response => {
//         if (!response.ok) {
//           throw new Error('Failed to save data');
//         }
//         return response.json();
//       })
//       .then(data => {
//         document.getElementById("message").innerText = "Theater added successfully!";
//         document.getElementById("Theateradd").reset(); 
//       })
//       .catch(error => {
//         console.error('Error:', error);
//         document.getElementById("message").innerText = "Error adding theater.";
//       });
//   });
// });


 