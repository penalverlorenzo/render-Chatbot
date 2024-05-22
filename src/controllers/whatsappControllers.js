const verifyToken = (req,res) => {
    res.send('Verified')
}

const RecievedMsg = (req,res) => {
    res.send('Recieved')
}

export {RecievedMsg, verifyToken}