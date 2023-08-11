import axios from 'axios'

export default axios.create(
    {
        //baseurl for full application 
        //no need to type entire url 
        //we'll import axios from here to other components
        baseURL: 'http://localhost:3500' 
        //because we run development server in the backend in node js server in another instance of vs code
    }
)