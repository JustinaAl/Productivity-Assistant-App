const getData = async (url, params) => {
    // const response = await fetch(url);
    // if (!response.ok){
    //     const errorData = await response.json();
    //     return errorData;
    //   }
    //   return await response.json();

    
    const response = await axios.get(url, {
        params: {
            // inc: "gender,name,nat",
            // gender,
            // nat: nationality,
            // noinfo: "noinfo"
        }
    })
    
    return response.data;
}