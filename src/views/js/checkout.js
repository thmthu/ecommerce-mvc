document.addEventListener("DOMContentLoaded", () => {
  const paymentButton = document.getElementById("paymentButton");
  paymentButton.addEventListener("click", (e) => {
    e.preventDefault();
    if (
      !address ||
      address.trim() === "" ||
      !phoneNumber ||
      phoneNumber.trim() === ""
    ) {
      alert("Must update address and phone number before checkout");
      return;
    }
    const requestData = {
      amountInput: price * 2000, // Hardcoded value
      contentPayment: "Payment for order", // Hardcoded value
      productTypeSelect: "other", // Hardcoded value
      langSelect: "vi", // Hardcoded value
    };
    fetch("/vnpay", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Payment request sent successfully:", data.url);
        window.location.href = data.url;
        // Insert the URL into the error-container div
      })
      .catch((error) => {
        console.error("Error sending payment request:", error);
      });
  });
});
