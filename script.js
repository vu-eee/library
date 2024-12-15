const API_KEY = 'AIzaSyCxoFLYO4wsf6lxQC3Nx_V81XGlqBM3Ips'; // Replace with your API key
const ROOT_FOLDER_ID = '1-14QqqtyvPU7bzjy-EoGDBTLK5RtiYyd'; // Replace with your root Google Drive folder ID

// Function to fetch files and folders
async function fetchFolderContents(folderId) {
    const endpoint = `https://www.googleapis.com/drive/v3/files`;
    const params = new URLSearchParams({
        key: API_KEY,
        q: `'${folderId}' in parents and trashed=false`,
        fields: 'files(id, name, mimeType, webViewLink, webContentLink)',
    });

    try {
        const response = await fetch(`${endpoint}?${params}`);
        const data = await response.json();
        return data.files || [];
    } catch (error) {
        console.error('Error fetching folder contents:', error);
        return [];
    }
}

// Function to create a loading spinner
function createSpinner() {
    const spinner = document.createElement('div');
    spinner.className = 'spinner';
    spinner.innerHTML = `
        <style>
            .spinner {
                display: inline-block;
                width: 16px;
                height: 16px;
                border: 2px solid #ccc;
                border-top: 2px solid #333;
                border-radius: 50%;
                animation: spin 1s linear infinite;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
        </style>
    `;
    return spinner;
}

// Function to toggle folder contents
async function toggleFolderContents(folderLi, folderId) {
    const sublist = folderLi.querySelector('ul');
    const spinner = folderLi.querySelector('.spinner');

    // Check if contents are already loaded
    if (sublist) {
        sublist.style.display = sublist.style.display === 'none' ? 'block' : 'none';
        return;
    }

    // Show spinner while loading
    const loadingSpinner = createSpinner();
    folderLi.appendChild(loadingSpinner);

    // Fetch subfolder contents
    const contents = await fetchFolderContents(folderId);

    // Remove spinner
    loadingSpinner.remove();

    // Create and append the sublist
    const newSublist = document.createElement('ul');
    displayFolderContents(contents, newSublist);
    folderLi.appendChild(newSublist);
}

// Function to display files and folders
function displayFolderContents(contents, container) {
    contents.forEach(item => {
        const li = document.createElement('li');

        if (item.mimeType === 'application/vnd.google-apps.folder') {
            // Folder: Clickable to load contents
            li.textContent = `📁 ${item.name}`;
            li.style.cursor = 'pointer';

            li.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent event bubbling
                toggleFolderContents(li, item.id);
            });
        } else {
            // File: Display as a link
            const link = document.createElement('a');
            link.href = item.webContentLink || item.webViewLink;
            link.target = '_blank';
            link.textContent = `📄 ${item.name}`;
            li.appendChild(link);
        }

        container.appendChild(li);
    });
}

// Initialize the folder viewer
async function init() {
    const fileList = document.getElementById('file-list');
    fileList.innerHTML = '<li>Loading...</li>'; // Show loading message

    const contents = await fetchFolderContents(ROOT_FOLDER_ID);
    fileList.innerHTML = ''; // Clear loading message
    displayFolderContents(contents, fileList);
}

// Run the init function
init();
