import axios from 'axios'
import { useEffect, useState } from 'react'

function test() {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [file, setFile] = useState()
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [image, setImage] = useState()
  const handleUpload = () => {
    const formData = new FormData()
    formData.append('file', file)
    axios.post('http://localhost:8017/upload', formData)
      .then(res => console.log(res))
      .catch(err => console.log(err))
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    axios.get('http://localhost:8017/getImage')
      .then(res => setImage(res.data.avatar))
      .catch(err => console.log(err))
  }, [])

  return (
    <div>
      <h1>Test</h1>
      <input type="file" onChange={e => setFile(e.target.files[0])}/>
      <button onClick={handleUpload}>Upload</button>
      <img src={image}/>
    </div>
  )
}

export default test