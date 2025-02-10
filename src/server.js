const express = require('express');
const cors = require('cors');
const sequelize = require('./config/database');
const gadgetRoutes = require('./routes/gadgetRoutes');

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

app.use('/gadgets', gadgetRoutes);

sequelize
	.sync({ alter: true })
	.then(() => {
		console.log('Database synced successfully');
		app.listen(PORT, () => {
			console.log(`IMF Gadget API is running on port ${PORT}`);
		});
	})
	.catch((error) => {
		console.error('Unable to sync database:', error);
	});

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).json({ error: 'Something went wrong!' });
});
