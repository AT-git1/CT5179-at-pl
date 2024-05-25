import express from 'express';
import getData from "./calc.js";
const app = express();

//Todo: Catch errors
//Todo: Check with supervisor about hosting (Local/VM/Cloud)
app.post('/api', express.json(), (req, res) => {
    const body = req.body;
    const providers = body.providers;
    const interest = body.interest;
    const loc = body.loc;
    return res.send(getData(providers,interest,loc));
});

//React on 3000, express on 3001
app.listen(3001, () => {
    console.log('Server listening on port 3001');
});