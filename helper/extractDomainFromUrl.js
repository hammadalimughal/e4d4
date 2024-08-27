const extractDomain = (url) => {
    const regex = /^(?:https?:\/\/)?(?:www\.)?([^\/\?]+)/i;
    const match = url.match(regex);
    return match ? match[1] : null;
}
module.exports = extractDomain