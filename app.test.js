const { app, server, con } = require('./app.js')
const request = require('supertest');

describe('Test API', () => {

    afterAll(async () => {
        const sqldelete = "DELETE FROM products WHERE id >1 ";
        con.query(sqldelete, function (err, result) {
            if (err) throw err;
        });        
        const sqldropID = "ALTER TABLE products DROP COLUMN id;";
        con.query(sqldropID, function (err, result) {
            if (err) throw err;
        });
        const sqladdID = "ALTER TABLE products ADD COLUMN id INT AUTO_INCREMENT PRIMARY KEY FIRST;";
        con.query(sqladdID, function (err, result) {
            if (err) throw err;
        });

        con.end()
        server.close();
    });

    describe('GET method', () => {
        it('get all products', async () => {
            const response = await request(app).get('/products');
            expect(response.statusCode).toEqual(200);
        });
        it('get products by ID', async () => {
            const productId = 1;
            const response = await request(app)
            .get(`/products/${productId}`);
            expect(response.body).toEqual([{"id":1,"name":"PS6","category":"Game","price":15990,"stock":7}]);
            expect(response.statusCode).toEqual(200);
        });
    })

    describe('POST method', () => {
        it('add a new product Success', async () => {
            const newProduct = { name: 'New Product', category: 'Test', price: 10, stock: 100 };
            const response = await request(app)
                .post('/products')
                .send(newProduct);
            expect(response.status).toBe(201);
        });

        it('add a new product - without name', async () => {
            const newProduct = { category: 'Test', price: 10, stock: 100 };
            const response = await request(app)
                .post('/products')
                .send(newProduct);
            expect(response.status).toBe(404);
        });
        it('add a new product - without category', async () => {
            const newProduct = { name: 'New Product', price: 10, stock: 100 };
            const response = await request(app)
                .post('/products')
                .send(newProduct);
            expect(response.status).toBe(201);
        });
        it('add a new product - without price', async () => {
            const newProduct = { name: 'New Product', category: 'Test', stock: 100 };
            const response = await request(app)
                .post('/products')
                .send(newProduct);
            expect(response.status).toBe(404);
        });
        it('add a new product - without stock', async () => {
            const newProduct = { name: 'New Product', category: 'Test', price: 10 };
            const response = await request(app)
                .post('/products')
                .send(newProduct);
            expect(response.status).toBe(404);
        });
    })

    describe('PUT method', () => {
        it('update an existing product', async () => {
            const productId = 2;
            const updatedProduct = { name: 'new product', category: 'test', price: 100, stock: 10 };
            const response = await request(app)
                .put(`/products/${productId}`)
                .send(updatedProduct);
            expect(response.status).toBe(201);
        });
        it('update an product case Product not found', async () => {
            const productId = 30;
            const updatedProduct = { name: 'new product', category: 'test', price: 100, stock: 10 };
            const response = await request(app)
                .put(`/products/${productId}`)
                .send(updatedProduct);
            expect(response.status).toBe(404);
        });
    })

    describe('DELETE method', () => {
        it('delete an existing product', async () => {
            const productId = 2;
            const response = await request(app).delete(`/products/${productId}`);
            expect(response.status).toBe(201);
          });
    })
});
