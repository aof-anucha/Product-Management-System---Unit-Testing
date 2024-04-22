const express = require('express')
const mysql = require('mysql');
const router = express.Router();

module.exports = (con) => {
    router.post('/', async (req, res) => {
        try {
            if ((!req.body.name) || (!req.body.price) || (!req.body.stock)) {
                res.status(404).send('Please specify the product name, price, or stock of the product.');
                return;
            }

            const sql = "INSERT INTO products (name, category, price, stock) VALUES (?, ?, ?, ?)";
            const values = [req.body.name, req.body.category, req.body.price, req.body.stock];

            await new Promise((resolve, reject) => {
                con.query(sql, values, function (err, result) {
                    if (err) {
                        reject(err);
                    } else {
                        console.log("1 record inserted");
                        resolve(result);
                    }
                });
            });

            res.status(201).send('Product added successfully');
        } catch (error) {
            res.status(500).send(error);
        }

    });

    router.get('/', (req, res) => {
        // ใช้ Connection Object (con) ที่รับมาจากไฟล์ app.js ในการเชื่อมต่อฐานข้อมูล
        const sql = "SELECT * FROM products";
        con.query(sql, function (err, result, fields) {
            if (err) throw err;
            res.send(result);
            const jsonData = JSON.stringify(result);
        });
    });

    router.get('/:id', (req, res) => {
        const sql = "SELECT * FROM products WHERE id=?";
        const id = req.params.id
        con.query(sql, id, function (err, result, fields) {
            if (err) throw err;
            res.send(result);
            const jsonData = JSON.stringify(result);
            console.log(jsonData);
        });

    });


    router.delete('/:id', (req, res) => {
        const sql = "DELETE FROM products WHERE id = ? ";
        const id = req.params.id
        con.query(sql, id, function (err, result) {
            if (err) {
                res.status(500).send(err);
            } else {
                console.log("deleted successfully");
                res.status(201).send('Product deleted successfully');
            }
        });
    });

    router.put('/:id', (req, res) => {
        const sql = "SELECT * FROM products WHERE id=?";
        const id = req.params.id
        let data
        con.query(sql, id, function (err, result, fields) {
            if (result.length === 0) {
                res.status(404).json({ error: 'product not found' });
                return;
              }
            if (err) {
                res.status(500).send(err);
            }
            data = result[0]
            const sql_update = "UPDATE products SET name = ? , category = ? , price = ? , stock = ? WHERE id = ?";
            const values = [req.body.name || data.name, req.body.category || data.category, req.body.price || data.price, req.body.stock || data.stock, req.params.id];
            con.query(sql_update, values, function (err, result) {
                if (err) {
                    res.status(500).send(err);
                  }
                console.log(result.affectedRows + " record(s) updated");
                res.status(201).send('Product updated successfully');
            });
        });
    });


    return router;
};




// router.post('/', async (req, res) => {
//     try {
//         if ((!req.body.name) || (!req.body.price) || (!req.body.stock)) {
//             res.status(404).send('Please specify the product name, price, or stock of the product.');
//             return;
//         }

//         const sql = "INSERT INTO products (name, category, price, stock) VALUES (?, ?, ?, ?)";
//         const values = [req.body.name, req.body.category, req.body.price, req.body.stock];

//         await new Promise((resolve, reject) => {
//             con.query(sql, values, function (err, result) {
//                 if (err) {
//                     reject(err);
//                 } else {
//                     console.log("1 record inserted");
//                     resolve(result);
//                 }
//             });
//         });

//         res.status(201).send('Product added successfully');
//     } catch (error) {
//         res.status(500).send(error);
//     }

// });

// router.get('/', (req, res) => {
//     const sql = "SELECT * FROM products";
//     con.query(sql, function (err, result, fields) {
//         if (err) throw err;
//         res.send(result);
//         const jsonData = JSON.stringify(result);
//     });

// });

// router.get('/:id', (req, res) => {
//     const sql = "SELECT * FROM products WHERE id=?";
//     const id = req.params.id
//     con.query(sql, id, function (err, result, fields) {
//         if (err) throw err;
//         res.send(result);
//         const jsonData = JSON.stringify(result);
//         console.log(jsonData);
//     });

// });


// router.delete('/:id', (req, res) => {
//     const sql = "DELETE FROM products WHERE id = ? ";
//     const id = req.params.id
//     con.query(sql, id, function (err, result) {
//         if (err) {
//             res.status(500).send(err);
//         } else {
//             console.log("deleted successfully");
//             res.status(201).send('Product deleted successfully');
//         }
//     });
// });

// router.put('/:id', (req, res) => {
//     const sql = "SELECT * FROM products WHERE id=?";
//     const id = req.params.id
//     let data
//     con.query(sql, id, function (err, result, fields) {
//         if (err) throw err;
//         data = result[0]
//         console.log("----------------->" + data.stock);
//         const sql_update = "UPDATE products SET name = ? , category = ? , price = ? , stock = ? WHERE id = ?";
//         const values = [req.body.name || data.name, req.body.category || data.category, req.body.price || data.price, req.body.stock || data.stock, req.params.id];
//         con.query(sql_update, values, function (err, result) {
//             if (err) throw err;
//             console.log(result.affectedRows + " record(s) updated");
//             res.status(201).send('Product updated successfully');
//         });
//     });
// });

// module.exports = router;

