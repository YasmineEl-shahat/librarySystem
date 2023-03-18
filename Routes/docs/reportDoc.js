/**
 * @swagger
 * /report:
 *   post:
 *     summary: Creates a report of all book operations
 *     description: Creates a JSON report file of all book operations, including book title, member name, employee name, operation type, deadline date, return date, and creation date.
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Successfully created report file
 *         schema:
 *           type: object
 *           properties:
 *             message:
 *               type: string
 *               description: A success message
 *     tags:
 *       - Reports
 */
