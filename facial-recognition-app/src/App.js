import { useState } from 'react';
import { useEffect } from 'react';
import './App.css';
const uuid=require('uuid');

function App() {
  const [image,setImage]=useState('');
  const [uploadResultMessage,setUploadResultMessage]=useState('Please upload an image to authenticate.');
  const [visitorName,setVisitorName]=useState('placeholder.png');
  const [visitorImagePath, setVisitorImagePath] = useState('./visitors/placeholder.png');
  const [isAuth,setAuth]=useState(false);
  useEffect(() => {
    setVisitorImagePath('./visitors/placeholder.png');
  }, []);

  function sendImage(e){
    e.preventDefault();
    setVisitorName(image.name);
    const visitorImageName=uuid.v4();
    //setVisitorImagePath(`./visitors/${visitorName}`);
    setVisitorImagePath(URL.createObjectURL(image));
    //rest of the method needs to be added
    fetch(`https://mux7t53t2a.execute-api.us-west-1.amazonaws.com/dev/project1-visitor-image-store/${visitorImageName}.jpeg`,{
       method:'PUT',
       headers:{
        'Content-Type':'image/jpeg'
       },
       body:image,
       mode: 'cors'
    }).then(async()=>{
      const response=await authenticate(visitorImageName);
      if(response.Message ==='Success'){
        setAuth(true);
        setUploadResultMessage(`Hi ${response['firstName']} ${response['lastName']}, welcome. Hope you have a great day today.`)
      } else{
        setAuth(false);
        setUploadResultMessage('Authentication Failed: this person is not an employee.')
      }
    }).catch(error=>{
      setAuth(false);
      setUploadResultMessage('There is an error during the authentication. Please try again.')
      console.error(error);
    })
  }

  async function authenticate(visitorImageName){
    const requestUrl='https://mux7t53t2a.execute-api.us-west-1.amazonaws.com/dev/employee?'+new URLSearchParams({
      objectKey:`${visitorImageName}.jpeg`
    });
    return await fetch(requestUrl,{
      method:'GET',
      headers:{
        'Accept': 'application.json',
        'Content-Type':'application.json'
      }
    }).then(response => response.json())
    .then((data)=>{
      return data;
    }).catch(error => console.error(error));
  }

  return (
    
    <div className="App">
      <h2>Facial Recognition System</h2>
      <form onSubmit={sendImage}>
        <input type='file' name='image' onChange={e=>setImage(e.target.files[0])}/>
        <button type='submit'>Authenticate</button>
      </form>
      <div className={isAuth?'success':'failure'}>{uploadResultMessage}</div>
      <img src={ require(`./visitors/${visitorName}`)} alt="Visitor" height={250} width={250} /> 
      <img src={visitorImagePath} alt="Visitor" height={300} width={300} />

    </div>
  );
}

export default App;
