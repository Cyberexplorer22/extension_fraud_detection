document.getElementById('report').addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const url = tabs[0].url;
        const reportData = { url, timestamp: new Date().toISOString() };

        // Send the report to the backend
        fetch('http://localhost:3000/reports', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reportData),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Report sent to server:', data);
                alert(`Reported ${url} as fraudulent.`);
            })
            .catch(error => {
                console.error('Error sending report:', error);
                alert('Failed to send report. Please try again.');
            });
    });
});

document.getElementById('view-reports').addEventListener('click', () => {
    // Fetch reports from the backend
    fetch('http://localhost:3000/reports')
        .then(response => response.json())
        .then(data => {
            console.log('Reported Websites:', data);
            alert(`Reported Websites:\n${JSON.stringify(data, null, 2)}`);
        })
        .catch(error => {
            console.error('Error fetching reports:', error);
            alert('Failed to fetch reports. Please try again.');
        });
});
