const express = require('express');
const authRequired = require('../middleware/authRequired');
const projects = require('../controllers/projectsController');
const tasks = require('../controllers/tasksController');

const router = express.Router();

router.use(authRequired);

/**
 * @openapi
 * /projects:
 *   get:
 *     tags: [Projects]
 *     summary: List projects owned by the current user
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Project' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *   post:
 *     tags: [Projects]
 *     summary: Create a project
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ProjectInput' }
 *     responses:
 *       '201':
 *         description: Created
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Project' }
 *       '400': { $ref: '#/components/responses/BadRequest' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 */
router.post('/', projects.create);
router.get('/', projects.list);

/**
 * @openapi
 * /projects/{id}:
 *   parameters:
 *     - $ref: '#/components/parameters/IdParam'
 *   get:
 *     tags: [Projects]
 *     summary: Get a project
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Project' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '404': { $ref: '#/components/responses/NotFound' }
 *   patch:
 *     tags: [Projects]
 *     summary: Update a project
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/ProjectPatch' }
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Project' }
 *       '400': { $ref: '#/components/responses/BadRequest' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '404': { $ref: '#/components/responses/NotFound' }
 *   delete:
 *     tags: [Projects]
 *     summary: Delete a project (cascades to its tasks)
 *     responses:
 *       '204': { description: No Content }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '404': { $ref: '#/components/responses/NotFound' }
 */
router.get('/:id', projects.readOne);
router.patch('/:id', projects.update);
router.delete('/:id', projects.remove);

/**
 * @openapi
 * /projects/{projectId}/tasks:
 *   parameters:
 *     - name: projectId
 *       in: path
 *       required: true
 *       schema: { type: string }
 *   get:
 *     tags: [Tasks]
 *     summary: List tasks under a project
 *     parameters:
 *       - name: status
 *         in: query
 *         schema: { $ref: '#/components/schemas/TaskStatus' }
 *       - name: priority
 *         in: query
 *         schema: { $ref: '#/components/schemas/TaskPriority' }
 *     responses:
 *       '200':
 *         description: OK
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items: { $ref: '#/components/schemas/Task' }
 *       '400': { $ref: '#/components/responses/BadRequest' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '404': { $ref: '#/components/responses/NotFound' }
 *   post:
 *     tags: [Tasks]
 *     summary: Create a task under a project
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { $ref: '#/components/schemas/TaskInput' }
 *     responses:
 *       '201':
 *         description: Created
 *         content:
 *           application/json:
 *             schema: { $ref: '#/components/schemas/Task' }
 *       '400': { $ref: '#/components/responses/BadRequest' }
 *       '401': { $ref: '#/components/responses/Unauthorized' }
 *       '404': { $ref: '#/components/responses/NotFound' }
 */
router.post('/:projectId/tasks', tasks.createForProject);
router.get('/:projectId/tasks', tasks.listForProject);

module.exports = router;
