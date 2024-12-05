document.addEventListener("DOMContentLoaded", function () {
  const addForm = document.getElementById("Theateradd");
  const updateForm = document.getElementById("UpdateTheater");


  if (addForm) {
    addForm.addEventListener("submit", function (event) {
      event.preventDefault();
      handleAddForm();
    });
  }

  if (updateForm) {
    updateForm.addEventListener("submit", function (event) {
      event.preventDefault();
      handleUpdateForm();
    });
    populateUpdateForm(); 
  }
});

function handleAddForm() {
  const formData = {
    Theater_Name: document.getElementById("theater_name").value,
    Location: document.getElementById("location").value,
    City: document.getElementById("city").value,
    EirCode: document.getElementById("eircode").value,
    Mobile: document.getElementById("mobile").value,
    Email: document.getElementById("email").value,
  };


  fetch("/addTheater", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  })
    .then((response) => {
      if (!response.ok) throw new Error("Failed to save data");
      return response.json();
    })
    .then(() => {
      alert("Theater added successfully!");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("Failed to add theater. Please try again.");
    });
}

function populateUpdateForm() {
  // Retrieve Theater ID from sessionStorage
  const Theater_Id = sessionStorage.getItem("theaterid");
  if (!Theater_Id) {
    console.error('No Theater ID found in sessionStorage');
    return;
  }

  fetch(`/theaterInfo?Theater_Id=${encodeURIComponent(Theater_Id)}`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (!data || data.length === 0) {
        throw new Error('No data found for the given Theater ID');
      }
      console.log("Raw data: ", data);
      const theater = data[0];


      document.getElementById("Theater_Id").value = theater.Theater_Id || "";
      document.getElementById("update_name").value = theater.Theater_Name || "";
      document.getElementById("updatelocation").value = theater.Location || "";
      document.getElementById("updateeircode").value = theater.EirCode || "";
      document.getElementById("updatecity").value = theater.City || "";
      document.getElementById("updateemail").value = theater.Email || "";
      document.getElementById("updatemobile").value = theater.Mobile || "";
    })
    .catch(error => {
      console.error('Error fetching theater data:', error);
    });
}

function handleUpdateForm() {
  const Theater_Id = parseInt(document.getElementById("Theater_Id").value, 10);
  
  if (isNaN(Theater_Id)) {
    alert("Invalid Theater ID. Please enter a valid number.");
    return;
  }

  const formData = {
    Theater_Name: document.getElementById("update_name").value.trim(), 
    Location: document.getElementById("updatelocation").value.trim(),
    City: document.getElementById("updatecity").value.trim(),
    EirCode: document.getElementById("updateeircode").value.trim(),
    Mobile: document.getElementById("updatemobile").value.trim(),
    Email: document.getElementById("updateemail").value.trim(),
};


  console.log("Form Data:", formData);
  fetch(`/updateTheater/${Theater_Id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((error) => {
          throw new Error(error.message || "Failed to update data");
        });
      }
      return response.json();
    })
    .then(() => {
      alert("Theater updated successfully!");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 1000);
    })
    .catch((error) => {
      console.error("Error:", error);
      alert(`Failed to update theater: ${error.message}`);
    });
}

