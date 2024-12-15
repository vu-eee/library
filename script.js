const API_KEY = 'AIzaSyCxoFLYO4wsf6lxQC3Nx_V81XGlqBM3Ips'; // Replace with your API key
const ROOT_FOLDER_ID = '1-14QqqtyvPU7bzjy-EoGDBTLK5RtiYyd'; // Replace with your root folder ID

// Fetch files and folders
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

// Create spinner
function createSpinner() {
  const spinner = document.createElement('div');
  spinner.className = 'spinner';
  return spinner;
}

// Toggle folder contents
async function toggleFolderContents(folderLi, folderId) {
  const sublist = folderLi.querySelector('ul');
  const spinner = folderLi.querySelector('.spinner');

  // Check if contents are already loaded
  if (sublist) {
    sublist.style.display = sublist.style.display === 'none' ? 'block' : 'none';
    return;
  }

  // Add spinner
  const loadingSpinner = createSpinner();
  folderLi.appendChild(loadingSpinner);

  // Fetch contents
  const contents = await fetchFolderContents(folderId);

  // Remove spinner
  loadingSpinner.remove();

  // Add folder contents
  const newSublist = document.createElement('ul');
  displayFolderContents(contents, newSublist);
  folderLi.appendChild(newSublist);
}

// Display folder contents
function displayFolderContents(contents, container) {
  contents.forEach((item) => {
    const li = document.createElement('li');

    if (item.mimeType === 'application/vnd.google-apps.folder') {
      // Folder
      li.innerHTML = `<span class="folder">📁 ${item.name}</span>`;
      li.style.cursor = 'pointer';

      li.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent event bubbling
        toggleFolderContents(li, item.id);
      });
    } else {
      // File
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
  fileList.innerHTML = '<li>Loading...</li>';

  const contents = await fetchFolderContents(ROOT_FOLDER_ID);
  fileList.innerHTML = '';
  displayFolderContents(contents, fileList);
}

// Start the app
init();
