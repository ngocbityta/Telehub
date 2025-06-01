import axios from 'axios';

const baseURL = 'https://ec2-52-65-182-50.ap-southeast-2.compute.amazonaws.com';   

export default axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});