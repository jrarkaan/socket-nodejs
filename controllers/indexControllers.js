
const getPage = (req, res)=>{
    res.render('chat');
};

const getPageChat = (req, res)=>{
    res.render('index');
};

export {
    getPageChat, getPage
}