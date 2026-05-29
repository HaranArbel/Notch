import express from "express";

const router = express.Router();
router.get('/healthCheck', (_req, res) => {
  res.send('Hello world!');
});
export default router;
