const API_KEY = 'AIzaSyCxoFLYO4wsf6lxQC3Nx_V81XGlqBM3Ips'; // Replace with your API key
const ROOT_FOLDER_ID = '1-14QqqtyvPU7bzjy-EoGDBTLK5RtiYyd'; // Replace with your root Google Drive folder ID

// Recursive function to fetch files and folders
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
        const files = data.files;

        // Process the files and folders
        const folderContents = [];
        for (const file of files) {
            if (file.mimeType === 'application/vnd.google-apps.folder') {
                // Recursively fetch subfolder contents
                const subfolderContents = await fetchFolderContents(file.id);
                folderContents.push({
                    name: file.name,
                    type: 'folder',
                    contents: subfolderContents,
                });
            } else {
                // Add file to the current folder
                folderContents.push({
                    name: file.name,
                    type: 'file',
                    link: file.webContentLink || file.webViewLink,
                });
            }
        }
        return folderContents;
    } catch (error) {
        console.error('Error fetching folder contents:', error);
        return [];
    }
}

// Display files and folders recursively on the webpage
function displayFolderContents(contents, container) {
    contents.forEach(item => {
        const li = document.createElement('li');
        if (item.type === 'folder') {
            // Folder: Display its name and recursively display its contents
            li.textContent = `📁 ${item.name}`;
            const sublist = document.createElement('ul');
            displayFolderContents(item.contents, sublist);
            li.appendChild(sublist);
        } else {
            // File: Display as a link
            const link = document.createElement('a');
            link.href = item.link;
            link.target = '_blank';
            link.textContent = `📄 ${item.name}`;
            li.appendChild(link);
        }
        container.appendChild(li);
    });
}

// Fetch and display the entire folder hierarchy when the page loads
async function init() {
    const fileList = document.getElementById('file-list');
    fileList.innerHTML = '<li>Loading...</li>'; // Show loading message

    const contents = await fetchFolderContents(ROOT_FOLDER_ID);
    fileList.innerHTML = ''; // Clear loading message
    displayFolderContents(contents, fileList);
}

// Run the init function
init();
