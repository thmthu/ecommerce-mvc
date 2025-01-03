document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("forgotPasswordForm");
  const errorContainer = document.getElementById("error-register");
  errorContainer.innerHTML = "";

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const requestBody = {
      email: email,
    };
    console.log("mailtrap", requestBody);
    fetch("/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        errorContainer.innerHTML = "";
        return response.json().then((data) => {
          console.log("Response:", response);
          if (!response.ok) {
            throw new Error(
              data.error || `HTTP error! status: ${response.status}`
            );
          }
          return data;
        });
      })
      .then((data) => {
        console.log("Account created successfully:", data);
        form.reset(); // Clear the form fields
        errorContainer.innerHTML = ""; // Clear any previous error messages
        alert("A link to reset password was sent to this email");
      })
      .catch((error) => {
        errorContainer.innerHTML += `<div class="alert alert-danger mt-1">${error}</div>`;
      });
  });
});
