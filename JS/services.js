export const getData = async (url, params) => {

    const response = await axios.get(url, { params });
    
    return response.data;
}


export const postData = async(url, newData) =>{

    const response = await axios.post(url, newData);
    return response.data;
}