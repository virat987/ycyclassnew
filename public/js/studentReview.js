// Getting DOM 
const studentForm = document.querySelector(".form-student-review");
if (studentForm) {
  studentForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const review = document.getElementById("review_message").value;
    if (review) {
      fetch("/create-student-review", {
        method: "POST",
        headers: {
          "Content-type": "application/json"
        },
        body: JSON.stringify({review})
      }).then(resp => {
        return resp.json();
      }).then(data => {
        window.location = "/me";
      })
    } else {
      alert("Enter Message");
    }
  })
}