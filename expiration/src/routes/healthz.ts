import express from 'express';

const router = express.Router();

router.get('/api/expiration/healthz', (req, res) => {
  res.status(200).send({});
});

export { router as healthzRouter };
