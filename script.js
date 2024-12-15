const API_KEY = 'AIzaSyCxoFLYO4wsf6lxQC3Nx_V81XGlqBM3Ips'; // Replace with your API key
const FOLDER_ID = '1-14QqqtyvPU7bzjy-EoGDBTLK5RtiYyd'; // Replace with your Google Drive folder ID

// Function to fetch files from Google Drive
async function fetchFiles() {
    const endpoint = `https://www.googleapis.com/drive/v3/files`;
    const params = new URLSearchParams({
        key: API_KEY,
        q: `'${FOLDER_ID}' in parents and trashed=false`,
        fields: 'files(id, name, mimeType, webViewLink, webContentLink)',
    });

    try {
        const response = await fetch(`${endpoint}?${params}`);
        const data = await response.json();
        displayFiles(data.files);
    } catch (error) {
        console.error('Error fetching files:', error);
    }
}

// Function to display files on the webpage
function displayFiles(files) {
    const fileList = document.getElementById('file-list');
    fileList.innerHTML = ''; // Clear any existing content

    if (!files || files.length === 0) {
        fileList.innerHTML = '<li>No files found in this folder.</li>';
        return;
    }

    files.forEach(file => {
        const li = document.createElement('li');
        const link = document.createElement('a');
        link.href = file.webContentLink || file.webViewLink; // Use webContentLink for direct downloads
        link.target = '_blank';
        link.textContent = file.name;

        li.appendChild(link);
        fileList.appendChild(li);
    });
}

// Fetch files when the page loads
fetchFiles();
