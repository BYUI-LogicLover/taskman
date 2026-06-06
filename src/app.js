const express = require('express');
const swaggerUi = require('swagger-ui-express');

const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');
const taskRoutes = require('./routes/tasks');
const errorHandler = require('./middleware/errorHandler');
const openapiSpec = require('./docs/swagger');

const app = express();

app.use(express.json());

/**
 * @openapi
 * /health:
 *   get:
 *     tags: [Health]
 *     summary: Liveness probe
 *     security: []
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ok: { type: boolean }
 */
app.get('/health', (req, res) => res.json({ ok: true }));

const specForRequest = (req) => ({
  ...openapiSpec,
  servers: [{ url: `${req.protocol}://${req.get('host')}`, description: 'Current host' }],
});

app.use(
  '/api-docs',
  swaggerUi.serve,
  (req, res, next) => swaggerUi.setup(specForRequest(req))(req, res, next),
);
app.get('/openapi.json', (req, res) => res.json(specForRequest(req)));

app.use('/auth', authRoutes);
app.use('/projects', projectRoutes);
app.use('/', taskRoutes);

app.use((req, res) => res.status(404).json({ error: 'not found' }));
app.use(errorHandler);

module.exports = app;
