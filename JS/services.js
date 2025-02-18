export const getData = async (url, params) => {

    const response = await axios.get(url, { params });
    
    return response.data;
}


export const postData = async(url, newData) => {

    const response = await axios.post(url, newData);
    return response.data;
}

export const changeData = async(url, newData) => {
    const response = await axios.patch(url, newData);
    return response.data
}

export const deleteData = async(url) => {
    const response = await axios.delete(url);

}