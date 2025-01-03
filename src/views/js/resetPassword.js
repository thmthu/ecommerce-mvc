document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("resetPasswordForm");
  const errorContainer = document.getElementById("error-register");
  errorContainer.innerHTML = "";
  const urlPath = window.location.pathname;
  const token = urlPath.split("/").pop();
  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const password = document.getElementById("resetPassword").value;
    const confirmPassword = document.getElementById(
      "confirmResetPassword"
    ).value;
    if (!password) {
      console.log("Please enter");
      errorContainer.innerHTML = `<div class="mt-1 alert alert-danger">Password is require</div>`;
      return;
    }
    if (!passwordRegex.test(password)) {
      console.log("error patter");
      errorContainer.innerHTML = `<div class="mt-1 alert alert-danger">Password must be at least 8 characters long and include at least one special character and one number</div>`;
      return;
    }
    if (!confirmPassword || confirmPassword !== password) {
      errorContainer.innerHTML = `<div class="mt-1 alert alert-danger">Confirm password does not match</div>`;
      return;
    }
    const requestBody = {
      password: password,
    };
    fetch(`/reset-password/${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
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
        window.location.href = "/login"; // Redirect to home page
      })
      .catch((error) => {
        errorContainer.innerHTML += `<div class="alert alert-danger mt-1">${error}</div>`;
      });
  });
});
