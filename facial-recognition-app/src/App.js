import { useState, useEffect } from 'react';
import './App.css';
import placeholderImage from './visitors/placeholder.png';
const uuid = require('uuid');

function App() {
  const [image, setImage] = useState('');
  const [uploadResultMessage, setUploadResultMessage] = useState('Please upload an image to authenticate.');
  const [visitorName, setVisitorName] = useState('placeholder.png');
  const [visitorImagePath, setVisitorImagePath] = useState(placeholderImage);
  const [isAuth, setAuth] = useState(false);

  useEffect(() => {
    setVisitorImagePath(placeholderImage);
  }, []);

  function sendImage(e) {
    // e.preventDefault();
    // setVisitorName(image.name);
    // const visitorImageName = uuid.v4();
    // setVisitorImagePath(URL.createObjectURL(image));
    e.preventDefault();
  setVisitorName(image.name);
  const visitorImageName = uuid.v4();
  const newVisitorImagePath = URL.createObjectURL(image); // Create new object URL

  if (visitorImagePath) {
    URL.revokeObjectURL(visitorImagePath); // Revoke previous object URL
  }

  setVisitorImagePath(newVisitorImagePath);

    fetch(`https://mux7t53t2a.execute-api.us-west-1.amazonaws.com/dev/project1-visitor-image-store/${visitorImageName}.jpeg`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'image/jpeg',
      },
      body: image,
      mode: 'cors',
    })
      .then(async () => {
        const response = await authenticate(visitorImageName);
        if (response.Message === 'Success') {
          setAuth(true);
          setUploadResultMessage(`Hi ${response['firstName']} ${response['lastName']}, welcome. Hope you have a great day today.`);
        } else {
          setAuth(false);
          setUploadResultMessage('Authentication Failed: this person is not an employee.');
        }
      })
      .catch((error) => {
        setAuth(false);
        setUploadResultMessage('There is an error during the authentication. Please try again.');
        console.error(error);
      });
  }

  async function authenticate(visitorImageName) {
    const requestUrl = 'https://mux7t53t2a.execute-api.us-west-1.amazonaws.com/dev/employee?' + new URLSearchParams({
      objectKey: `${visitorImageName}.jpeg`,
    });
    return await fetch(requestUrl, {
      method: 'GET',
      headers: {
        Accept: 'application.json',
        'Content-Type': 'application.json',
      },
    })
      .then((response) => response.json())
      .then((data) => {
        return data;
      })
      .catch((error) => console.error(error));
  }

  return (
    <div className="App">
      <header>
        <h1>Facial Recognition System</h1>
      </header>
      <div className="headerNote">
    <p>Some pre-uploaded employee images include Satya Nadella, Mark Zuckerberg, Sundar Pichai, Larry Page, Jack Dorsey, Mukesh Ambani, and Shahrukh Khan.</p>
  </div>
  
      <div className="container">
        <form className="form" onSubmit={sendImage}>
          <input type="file" name="image" onChange={(e) => setImage(e.target.files[0])} />
          <button className="submitButton" type="submit">
            Authenticate
          </button>
        </form>
  
        <div className={isAuth ? 'success' : 'failure'}>{uploadResultMessage}</div>
  
        <img src={visitorImagePath} alt="Visitor" className="visitorImage" />
      </div>
  
      <footer>
        <p>&copy; 2023 Created by Prajwal Mahaveera</p>
      </footer>
    </div>
  );
}

export default App;
