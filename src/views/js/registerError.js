document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const errorContainer = document.getElementById("error-register");
  errorContainer.innerHTML = "";
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const username = document.getElementById("yourUsername").value;
    const email = document.getElementById("yourEmail").value;
    const password = document.getElementById("yourPassword").value;
    const confirmPasswordInput = document.getElementById(
      "yourConfirmPassword"
    ).value;
    // Prevent default form submission
    if (!username) {
      errorContainer.innerHTML = `<div class="mt-1 alert alert-danger">Username is require</div>`;
      return;
    }
    if (!email) {
      errorContainer.innerHTML = `<div class="mt-1 alert alert-danger">Email is require</div>`;
      return;
    }
    if (!password) {
      errorContainer.innerHTML = `<div class="mt-1 alert alert-danger">Password is require</div>`;
      return;
    }
    if (!passwordRegex.test(password)) {
      console.log("error patter");
      errorContainer.innerHTML = `<div class="mt-1 alert alert-danger">Password must be at least 8 characters long and include at least one special character and one number</div>`;
      return;
    }
    if (!confirmPasswordInput || confirmPasswordInput !== password) {
      errorContainer.innerHTML = `<div class="mt-1 alert alert-danger">Confirm password does not match</div>`;
      return;
    }
    // Construct the request body in the required format
    const requestBody = {
      username: username,
      email: email,
      password: password,
    };
    fetch("/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        errorContainer.innerHTML = "";
        return response.json().then((data) => {
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
        window.location.href = "/email-verify"; // Redirect to home page
      })
      .catch((error) => {
        errorContainer.innerHTML += `<div class="alert alert-danger mt-1">${error}</div>`;
      });
  });
});
