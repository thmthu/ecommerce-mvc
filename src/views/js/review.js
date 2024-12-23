document.addEventListener("DOMContentLoaded", () => {
  const testButton = document.getElementById("fill-and-submit");
  const form = document.getElementById("review-form");
  const starsContainer = document.getElementById("stars-container");

  let selectedStars = 3; // Default stars

  // Handle star click
  starsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("fa-star")) {
      selectedStars = parseInt(e.target.getAttribute("data-value"), 10);
      updateStars(selectedStars);
    }
  });

  const updateStars = (stars) => {
    [...starsContainer.children].forEach((star, index) => {
      star.classList.remove("fas", "far");
      star.classList.add(index < stars ? "fas" : "far");
    });
  };

  testButton.addEventListener("click", (e) => {
    e.preventDefault(); // Prevent default form submission

    // Construct the request body in the required format
    const requestBody = {
      email: document.getElementById("email").value || "",
      userName: document.getElementById("name").value || "",
      comment: document.getElementById("message").value || "",
      star: selectedStars,
      sessionId: "s", // Replace with the actual session ID if needed
    };
    fetch(form.action, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody),
    })
      .then((response) => {
        return response.json().then((data) => {
          if (!response.ok) {
            throw new Error(`${response.status} ${d.message}`);
          }
          return data;
        });
      })
      .then((data) => {
        document.getElementById("email").value = "";
        document.getElementById("name").value = "";
        document.getElementById("message").value = "";
        updateStars(0);
      })
      .catch((error) => {
        console.error("Error submitting review:", error);
        alert(`Error submitting review: ${error.message}`);
      });
  });
});
