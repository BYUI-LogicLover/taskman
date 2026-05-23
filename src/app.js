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

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpec));
app.get('/openapi.json', (_req, res) => res.json(openapiSpec));

app.use('/auth', authRoutes);
app.use('/projects', projectRoutes);
app.use('/', taskRoutes);

app.use((req, res) => res.status(404).json({ error: 'not found' }));
app.use(errorHandler);

module.exports = app;
