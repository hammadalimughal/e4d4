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
// (function ($) {
//     let classes = ['outline-primary', 'outline-dark', 'outline-danger', 'info', 'secondary'];
//     let selects = $('select[multiple]');
//     selects.each(function (i, e) {
//         let randomClass = classes[Math.floor(Math.random() * classes.length)];
//         $(this).bsSelectDrop({
//             // btnClass: 'btn btn-'+classes[i],
//             btnClass: 'select-multiple',
//             btnWidth: 'auto',
//             darkMenu: false,
//             showSelectionAsList: false,
//             showActionMenu: true,
//             // showSelectedText: (count, total) => {return `${count} von ${total} Städte ausgewählt`}
//         });
//     })
// }(jQuery));
function deleteCookie(name) {
    debugger
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    location.reload()
}
function createCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}
function readCookie(name) {
    const nameEQ = name + "=";
    const cookies = document.cookie.split(';');
    for(let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        while (cookie.charAt(0) === ' ') cookie = cookie.substring(1, cookie.length);
        if (cookie.indexOf(nameEQ) === 0) return cookie.substring(nameEQ.length, cookie.length);
    }
    return null;
}

$('.suggestTags').each((ind,elem)=>{
    $(elem).amsifySuggestags({
        // suggestions: JSON.parse($(elem).data('suggestion')),
        suggestions: $(elem).data('suggestion'),
        whiteList: true
    });
})