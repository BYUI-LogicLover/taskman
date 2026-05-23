const express = require('express');
const authRequired = require('../middleware/authRequired');
const tasks = require('../controllers/tasksController');

const router = express.Router();

router.use(authRequired);

/**
 * @openapi
 * /tasks/{id}:
 *   parameters:
 *     - $ref: '#/components/parameters/IdParam'
 *   get:
 *     tags: [Tasks]
 *     summary: Get a task
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Task' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '404': { $ref: '#/components/responses/NotFound' }
 *   patch:
 *     tags: [Tasks]
 *     summary: Update a task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/TaskPatch' }
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Task' }
 *       '400': { $ref: '#/components/responses/BadRequest' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '404': { $ref: '#/components/responses/NotFound' }
 *   delete:
 *     tags: [Tasks]
 *     summary: Delete a task
 *     responses:
 *       '204': { description: No Content }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '404': { $ref: '#/components/responses/NotFound' }
 */
router.get('/tasks/:id', tasks.readOne);
router.patch('/tasks/:id', tasks.update);
router.delete('/tasks/:id', tasks.remove);

module.exports = router;
