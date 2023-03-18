/**
 * @swagger
 * /api/members:
 *   get:
 *     summary: Get all members
 *     description: Retrieve a list of all members from the database.
 *     responses:
 *       200:
 *         description: A list of all members
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Member'
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

/**
 * @swagger
 * /members:
 *   post:
 *     summary: Add a new member
 *     tags: [Members]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *               birthdate:
 *                 type: string
 *                 format: date
 *               city:
 *                 type: string
 *               street:
 *                 type: string
 *               building:
 *                 type: string
 *             example:
 *               id: "1234"
 *               name: "John Doe"
 *               email: "johndoe@example.com"
 *               phoneNumber: "555-555-5555"
 *               birthdate: "1990-01-01"
 *               city: "New York"
 *               street: "123 Main St"
 *               building: "Apt 456"
 *     responses:
 *       201:
 *         description: Member created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                     fullName:
 *                       type: string
 *                     email:
 *                       type: string
 *                     phoneNumber:
 *                       type: string
 *                     birthdate:
 *                       type: string
 *                       format: date
 *                     fullAddress:
 *                       type: object
 *                       properties:
 *                         city:
 *                           type: string
 *                         street:
 *                           type: string
 *                         building:
 *                           type: string
 *               example:
 *                 data:
 *                   _id: "1234"
 *                   fullName: "habiba hamed"
 *                   email: "bibahamed99@gmail.com"
 *                   phoneNumber: "555-555-5555"
 *                   birthdate: "1990-01-01"
 *                   fullAddress:
 *                     city: "New York"
 *                     street: "123 Main St"
 *                     building: "Apt 456"
 *       400:
 *         description: Bad request, missing or invalid fields
 *       500:
 *         description: Internal server error
 */

