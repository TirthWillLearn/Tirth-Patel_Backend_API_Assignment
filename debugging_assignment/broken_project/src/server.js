const app = require('./app');
const port = process.env.PORT || 3001;
app.listen(port, () => console.log('Broken server running on port', port));
