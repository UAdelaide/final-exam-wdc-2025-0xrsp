var express = require('express');
const router = express.Router();

router.get('/dogs', async (req, res) => {
	try {
		const db = req.app.locals.db;
		const [rows] = await db.execute(`
      SELECT Dogs.name AS dog_name, Dogs.size, Users.username AS owner_username
      FROM Dogs
      JOIN Users ON Dogs.owner_id = Users.user_id
    `);
		res.json(rows);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Unable to get dogs' });
	}
});

router.get('/walkrequests/open', async (req, res) => {
	try {
		const db = req.app.locals.db;
		const [rows] = await db.execute(`
      SELECT WalkRequests.request_id, Dogs.name AS dog_name, WalkRequests.requested_time,
             WalkRequests.duration_minutes, WalkRequests.location, Users.username AS owner_username
      FROM WalkRequests
      JOIN Dogs ON WalkRequests.dog_id = Dogs.dog_id
      JOIN Users ON Dogs.owner_id = Users.user_id
      WHERE WalkRequests.status = 'open'
    `);
		res.json(rows);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Unable to get open walk requests' });
	}
});

router.get('/walkers/summary', async (req, res) => {
	try {
		const db = req.app.locals.db;
		const [rows] = await db.execute(`
      SELECT
        Users.username AS walker_username,
        COUNT(WalkRatings.rating) AS total_ratings,
        AVG(WalkRatings.rating) AS average_rating,
        COUNT(CASE WHEN WalkRequests.status = 'completed' THEN 1 END) AS completed_walks
      FROM Users
      LEFT JOIN WalkRatings ON Users.user_id = WalkRatings.walker_id
      LEFT JOIN WalkRequests ON WalkRequests.request_id = WalkRatings.request_id
      WHERE Users.role = 'walker'
      GROUP BY Users.user_id
    `);
		res.json(rows);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: 'Unable to get walkers summary' });
	}
});

module.exports = router;