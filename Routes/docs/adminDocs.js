/**
 * @swagger
 * tags:
 *   name: Admins
 *   description: API for managing admins
 */

/**
 * @swagger
 * /admins:
 *   get:
 *     summary: Retrieve a list of all admins
 *     tags: [Admins]
 *     responses:
 *       200:
 *         description: A list of admins
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Admin'
 *       304:
 *         description: Admins retrieved from cache
 *   post:
 *     summary: Add a new admin
 *     tags: [Admins]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewAdmin'
 *     responses:
 *       201:
 *         description: The newly created admin
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Admin'
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /admins/{id}:
 *   get:
 *     summary: Get an admin by ID
 *     tags: [Admins]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the admin to retrieve
 *     responses:
 *       200:
 *         description: The requested admin
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/Admin'
 *       404:
 *         description: Admin not found
 *   put:
 *     summary: Update an existing admin by ID
 *     tags: [Admins]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the admin to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateAdmin'
 *     responses:
 *       200:
 *         description: Admin updated successfully
 *       400:
 *         description: Bad request
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Internal server error
 *   delete:
 *     summary: Delete an admin by ID
 *     tags: [Admins]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the admin to delete
 *     responses:
 *       200:
 *         description: Admin deleted successfully
 *       404:
 *         description: Admin not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     NewAdmin:
 *       type: object
 *       required:
 *         - _id
 *         - fname
 *         - lname
 *         - email
 *         - isBase
 *         - salary
 *         - birthdate
 *         - hiredate
 *       properties:
 *         _id:
 *           type: string
 *           description: The admin ID
 *         fname:
 *           type: string
 *           description: The admin's first name
 *         lname:
 *           type: string
 *           description: The admin's last name
 *         email:
 *           type: string
 *           description: The admin's email address
 *         isBase:
 *           type: boolean
 *           description: Indicates whether the admin is the base admin or not
 *         salary:
 *           type: number
 *           description: The admin's salary
 *         birthdate:
 *           type: string
 *           format: date
 *           description: The admin's birth date
 *         hiredate:
 *           type: string
 *           format: date
 *           description: The admin's hire date
 *     UpdateAdmin:
 *       type: object
 *       properties:
 *         fname:
 *           type: string
 *           description: The admin's first name
 *         lname:
 *           type: string
 *           description: The admin's last name
 *         email:
 *           type: string
 *           description: The admin's email address
 *         password:
 *           type: string
 *           description: The admin's password
 *         salary:
 *           type: number
 *           description: The admin's salary
 *         birthdate:
 *           type: string
 *           format: date
 *           description: The admin's birth date
 *         hiredate:
 *           type: string
 *           format: date
 *           description: The admin's hire date
 *     Admin:
 *       allOf:
 *         - type: object
 *           properties:
 *             _id:
 *               type: string
 *               description: The admin ID
 *             fname:
 *               type: string
 *               description: The admin's first name
 *             lname:
 *               type: string
 *               description: The admin's last name
 *             email:
 *               type: string
 *               description: The admin's email address
 *             isBase:
 *               type: boolean
 *               description: Indicates whether the admin is the base admin or not
 *             salary:
 *               type: number
 *               description: The admin's salary
 *             birthdate:
 *               type: string
 *               format: date
 *               description: The admin's birth date
 *             hiredate:
 *               type: string
 *               format: date
 *               description: The admin's hire date
 *         - $ref: '#/components/schemas/AdminWithImage'
 *     AdminWithImage:
 *       type: object
 *       properties:
 *         image:
 *           type: string
 *           description: The URL of the admin's profile image
 */