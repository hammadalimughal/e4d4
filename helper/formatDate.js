function formatDate(mongoDate) {
    // Convert the input to a Date object if it's not already
    const date = new Date(mongoDate);

    // Check if the date is valid
    if (isNaN(date)) {
        return "Invalid Date";
    }

    // Define options for formatting the date
    const options = {
        year: 'numeric',
        month: 'long', // "long" for full month name, "short" for abbreviated
        day: 'numeric'
    };

    // Format the date using toLocaleDateString with the specified options
    return date.toLocaleDateString('en-US', options);
}

module.exports = formatDate