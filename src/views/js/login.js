function redirectToGoogleAuth() {
  window.location.href = `${domain}/auth/google`;
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  const errorContainer = document.getElementById("error-register");
  errorContainer.innerHTML = "";
  console.log("===========domain", domain);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const emailInput = document.getElementById("loginEmail").value;
    const passwordInput = document.getElementById("loginPassword").value;
    if (!emailInput) {
      errorContainer.innerHTML = `<div class="mt-1 alert alert-danger">Email is require</div>`;
      return;
    }
    if (!passwordInput) {
      errorContainer.innerHTML = `<div class="mt-1 alert alert-danger">Password is require</div>`;
      return;
    }
    const requestBody = {
      email: emailInput,
      password: passwordInput,
    };
    console.log(requestBody);
    fetch(`${domain}/login/password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        errorContainer.innerHTML = "";
        console.log("Response:", response);
        return response.json().then((data) => {
          console.log("data", data);
          if (!response.ok) {
            throw new Error(
              data.error ||
                data.message ||
                `HTTP error! status: ${response.status}`
            );
          }
          return data;
        });
      })
      .then((data) => {
        console.log("Account created successfully:", data);
        form.reset(); // Clear the form fields
        errorContainer.innerHTML = ""; // Clear any previous error messages
        window.location.href = data.redirect; // Redirect to home page
      })
      .catch((error) => {
        errorContainer.innerHTML += `<div class="alert alert-danger mt-2">${error}</div>`;
      });
  });
});
