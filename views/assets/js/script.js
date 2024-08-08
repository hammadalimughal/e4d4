function createToast(message, type = 'success') {
    // Create the toast container if it doesn't exist
    let toastContainer = document.querySelector(".toast-container");
    if (!toastContainer) {
        toastContainer = document.createElement("div");
        toastContainer.classList.add("toast-container");
        document.body.appendChild(toastContainer);
    }
    // Create the toast element
    let toast = document.createElement("div");
    toast.className = `toast ${type} align-items-center show`;
    toast.setAttribute("role", "alert");
    toast.setAttribute("aria-live", "assertive");
    toast.setAttribute("aria-atomic", "true");
    // Create the inner HTML of the toast
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
    `;
    // Append the toast to the toast container
    toastContainer.appendChild(toast);

    // Add event listener to remove toast on close button click
    toast.querySelector(".btn-close").addEventListener("click", function () {
        toast.remove();
    });
    // Remove the toast after 5 seconds
    setTimeout(() => {
        toast.remove();
    }, 5000);
}
