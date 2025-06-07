const whois = require('whois');

function checkDomain(domain) {
    whois.lookup(domain, function (err, data) {
        if (err) {
            console.error(`Error checking ${domain}:`, err);
        } else if (data.includes("No match") || data.includes("NOT FOUND") || data.includes("Status: free")) {
            console.log(`${domain} is available ✅`);
        } else {
            console.log(`${domain} is taken ❌`);
        }
    });
}

// Example



checkDomain("Conneqt360.com");
