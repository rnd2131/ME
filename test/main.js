const root = document.documentElement;
const eye = document.getElementById('eyeball');
const beam = document.getElementById('beam');
const passwordInput = document.getElementById('password');

root.addEventListener('mousemove', (e) => {
  let rect = beam.getBoundingClientRect();
  let mouseX = rect.right + (rect.width / 2); 
  let mouseY = rect.top + (rect.height / 2);
  let rad = Math.atan2(mouseX - e.pageX, mouseY - e.pageY);
  let degrees = (rad * (20 / Math.PI) * -1) - 350;

  root.style.setProperty('--beamDegrees', `${degrees}deg`);
});

eye.addEventListener('click', e => {
  e.preventDefault();
  document.body.classList.toggle('show-password');
  passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password'
  passwordInput.focus();
});


// Initialize the Appwrite client
const client = new Appwrite.Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Your Appwrite endpoint
    .setProject('66bf2f0c001ed3fc6a5e'); // Your project ID

// Initialize the database object
const databases = new Appwrite.Databases(client);

// IDs for database and collection
const databaseId = 'products'; // Your database ID
const purchaseCollectionId = '66edca890004addcad44'; // Your collection ID for storing users

// Function to save username and password in the database
async function saveUser(name, pass) {
    try {
        const response = await databases.createDocument(
            databaseId, // Your database ID
            purchaseCollectionId, // Your collection ID
            'unique()', // Document ID (let Appwrite generate a unique one)
            {
                name: name, // The name attribute (username)
                pass: pass  // The pass attribute (password)
            }
        );
        console.log('User saved successfully:', response);
    } catch (error) {
        console.error('Failed to save user:', error);
    }
}
