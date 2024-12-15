
  
    // Google Drive API Integration
    const API_KEY = 'AIzaSyCxoFLYO4wsf6lxQC3Nx_V81XGlqBM3Ips'; // Replace with your API key
    const FOLDER_ID = '1-14QqqtyvPU7bzjy-EoGDBTLK5RtiYyd'; // Replace with your Google Drive folder ID

    // Function to fetch files and folders from Google Drive
    async function fetchFiles(folderId = FOLDER_ID, parentElement = document.getElementById('file-list')) {
      const endpoint = 'https://www.googleapis.com/drive/v3/files';
      const params = new URLSearchParams({
        key: API_KEY,
        q: `'${folderId}' in parents and trashed=false`,
        fields: 'files(id, name, mimeType, webViewLink, webContentLink)',
      });

      try {
        const response = await fetch(`${endpoint}?${params}`);
        const data = await response.json();

        if (data.files && data.files.length > 0) {
          data.files.forEach(file => {
            const li = document.createElement('li');
            if (file.mimeType === 'application/vnd.google-apps.folder') {
              // Create a folder element with a dropdown
              li.innerHTML = `
                <span style="cursor: pointer; color: #ff0;">📁 ${file.name}</span>
                <ul style="display: none; padding-left: 15px;"></ul>
              `;
              li.querySelector('span').addEventListener('click', () => {
                const subList = li.querySelector('ul');
                if (subList.style.display === 'none') {
                  subList.style.display = 'block';
                  fetchFiles(file.id, subList);
                } else {
                  subList.style.display = 'none';
                }
              });
            } else {
              // Display a file link
              li.innerHTML = `<a href="${file.webContentLink || file.webViewLink}" target="_blank">${file.name}</a>`;
            }
            parentElement.appendChild(li);
          });
        } else {
          parentElement.innerHTML = '<li>No files found in this folder.</li>';
        }
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    }

    // Fetch files when the page loads
    fetchFiles();
  
