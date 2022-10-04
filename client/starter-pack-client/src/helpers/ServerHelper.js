import axios from 'axios';

export const startDeployment = (data) => {
    axios.post('/deploy', data)
        .then(resp => console.log(resp));
}