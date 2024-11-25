document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("Theateradd").addEventListener("submit", function (event) {
      event.preventDefault();
      const formData = {
        Theater_Name: document.getElementById("theater_name").value,
        Location: document.getElementById("location").value,
        City: document.getElementById("city").value,
        EirCode: document.getElementById("eircode").value,
        Mobile: document.getElementById("mobile").value,
        Email: document.getElementById("email").value
      };
  
      fetch('/addTheater', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
        .then(response => {
          if (!response.ok) {
            throw new Error('Failed to save data');
          }
          return response.json();
        })
        .then(data => {
          setTimeout(() => {
            window.location.href = "index.html";
          }, 1000);
        })
        .catch(error => {
          console.error('Error:', error);
        });
    });
  });
  