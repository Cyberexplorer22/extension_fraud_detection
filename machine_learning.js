function isPhishingURL(url) {
    // Example of basic heuristics
    const suspiciousPatterns = ["login", "verify", "secure", "update"];
    return suspiciousPatterns.some(pattern => url.includes(pattern));
}

export { isPhishingURL };
