/**
 * @swagger
 * /employees:
 *   get:
 *     summary: Get all employees
 *     description: Returns a list of all employees
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Employee'
 *       500:
 *         description: Internal Server Error
 */

/**
 * @swagger
 * /employees/{id}:
 *   get:
 *     summary: Get employee by ID
 *     description: Returns a single employee by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the employee to get
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Internal Server Error
 */

// Employee schema definition
/**
 * @swagger
 * components:
 *   schemas:
 *     Employee:
 *       type: object
 *       properties:
 *         _id:
 *           type: number
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         department:
 *           type: string
 *       required:
 *         - name
 *         - email
 *         - department
 */
/**
 * @swagger
 * /employees:
 *   post:
 *     summary: Add a new employee
 *     description: Adds a new employee to the database
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmployeeInput'
 *     responses:
 *       201:
 *         description: Employee created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       500:
 *         description: Internal Server Error
 */

// Employee input schema definition
/**
 * @swagger
 * components:
 *   schemas:
 *     EmployeeInput:
 *       type: object
 *       properties:
 *         _id:
 *           type: number
 *         fname:
 *           type: string
 *         lname:
 *           type: string
 *         email:
 *           type: string
 *         salary:
 *           type: number
 *         hiredate:
 *           type: string
 *           format: date
 *         birthdate:
 *           type: string
 *           format: date
 *       required:
 *         - fname
 *         - lname
 *         - email
 *         - salary
 *         - hiredate
 *         - birthdate
 */

// Employee output schema definition
/**
 * @swagger
 * components:
 *   schemas:
 *     Employee:
 *       type: object
 *       properties:
 *         _id:
 *           type: number
 *         fname:
 *           type: string
 *         lname:
 *           type: string
 *         email:
 *           type: string
 *         salary:
 *           type: number
 *         hiredate:
 *           type: string
 *           format: date
 *         birthdate:
 *           type: string
 *           format: date
 *       required:
 *         - _id
 *         - fname
 *         - lname
 *         - email
 *         - salary
 *         - hiredate
 *         - birthdate
 */
/**
 * @swagger
 * /employees/{id}:
 *   patch:
 *     summary: Update an employee
 *     description: Updates an employee's details in the database
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the employee to update
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmployeeUpdate'
 *     responses:
 *       200:
 *         description: Employee updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Employee'
 *       401:
 *         description: Unauthorized - Employee not allowed to update email and salary
 *       404:
 *         description: Employee not found
 *       500:
 *         description: Internal Server Error
 */

// Employee update schema definition
/**
 * @swagger
 * components:
 *   schemas:
 *     EmployeeUpdate:
 *       type: object
 *       properties:
 *         fname:
 *           type: string
 *         lname:
 *           type: string
 *         email:
 *           type: string
 *         salary:
 *           type: number
 *         hiredate:
 *           type: string
 *           format: date
 *         birthdate:
 *           type: string
 *           format: date
 *         password:
 *           type: string
 *       anyOf:
 *         - properties:
 *             fname:
 *               type: string
 *             lname:
 *               type: string
 *             hiredate:
 *               type: string
 *               format: date
 *             birthdate:
 *               type: string
 *               format: date
 *             password:
 *               type: string
 *         - properties:
 *             email:
 *               type: string
 *               readOnly: true
 *             salary:
 *               type: number
 *               readOnly: true
 *       minProperties: 1
 *       additionalProperties: false
 */

// Employee output schema definition
/**
 * @swagger
 * components:
 *   schemas:
 *     Employee:
 *       type: object
 *       properties:
 *         _id:
 *           type: number
 *         fname:
 *           type: string
 *         lname:
 *           type: string
 *         email:
 *           type: string
 *         salary:
 *           type: number
 *         hiredate:
 *           type: string
 *           format: date
 *         birthdate:
 *           type: string
 *           format: date
 *         password:
 *           type: string
 *       required:
 *         - _id
 *         - fname
 *         - lname
 *         - email
 *         - salary
 *         - hiredate
 *         - birthdate
 *         - password
 */
//Employee delete schema definition
/**
 * @swagger
 * /api/employees/{id}:
 *   delete:
 *     summary: Delete an employee by ID
 *     description: Delete an employee from the database by their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: ID of the employee to delete
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Employee successfully deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: string
 *                   example: "deleted"
 *       404:
 *         description: Employee not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "employee not found"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
