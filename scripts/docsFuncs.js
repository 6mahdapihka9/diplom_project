const getById = (str)=>{
    return document.getElementById(str);
};
const crEl = (str)=>{
    return document.createElement(str);
};
getById("hideButton").onclick = ()=>{
    getById("main").hidden = !getById("main").hidden;
};
