const Express = require('express');
const router = Express.Router();
let validateJWT = require("../middleware/validate-jwt");
const { LogModel } = require('../models');

router.get('/practice', validateJWT, (req, res) => {
    res.send('This is a practice route')
});

//logs create 

router.post('/create', validateJWT, async (req, res) => {
    const { description, definition, result } = req.body.log;
    const { id } = req.user;
    const logEntry = {
        description,
        definition, 
        result, 
        owner_id: id 
    }
    try {
        const newLog = await LogModel.create(logEntry);
        res.status(200).json(newLog);
    } catch (err) {
        res.status(500).json({ error: err });
    }
} );

// get logs

router.get("/", async (req, res) => {
    try {
        const entries = await LogModel.findAll();
        res.status(200).json(entries);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// get logs by user

router.get("/mine", validateJWT, async (req, res) => {
    let { id } = req.user;
    try {
        const userLogs = await LogModel.findAll({
            where: {
                owner_id: id
            }
        });
        res.status(200).json(userLogs);
    } catch (err) {
        res.status(500).json({ error: err})
    }
});

//update log
// router.put("/update/:entryId", validateJWT, async (req, res) => {
//     const { description, definition, result} = req.body.log;
//     const logId = req.params.entryId;
//     const userId = req.user.id;

//     const query = {
//         where: {
//             id: logId,
//             owner_id: userId
//         }
//     };
//     const updatedLog = {
//         description: description,
//         definition: definition,
//         result: result
//     };

//     try { 
//         const update = await LogModel.update(updatedLog, query);
//         res.status(200).json(update);
//     } catch (err) {
//         res.status(500).json({ error: err });
//     }
// });

router.put("/:id", async (req, res) => {
    const {
       description, 
       definition, 
       result
    } = req.body //faster way one lines 27-33. destructuring object. 

    try {
        await LogModel.update(
            {description, definition, result},
            { where: { id: req.params.id }, returning: true } //looking to update where the id in our database matches the id in our endpoint // return the effect that rose
        )
        .then((result) => {
            res.status(200).json({
                message: "log successfully updated.",
                updatedLog: result
            })
        })
    } catch (err) {
        res.status(500).json({
            message: `Failed to update log ${err}`
        })
    }
});

// router.delete("/:id", async (req, res) =>{
// const ownerId = req.user.id;
// const logId = req.params.id;

// try {
//     const query = {
//         where: {
//             id: logId,
//             owner_id: ownerId
//         }
//     };
//     await LogModel.destroy(query);
//     res.status(200).json({ message: "Log Entry Removed"});
// } catch (err) {
//     res.status(500).json({error: err});
// }
// })
 

router.delete("/:id", async (req, res) =>{
    

    try { 
      

      await LogModel.destroy({
          where: {id: req.params.id}
      })

      res.status(200).json({
          message: "Log successfully deleted"

      })
    } catch (err) {
        res.status(500).json({
            message: `Failed to delete log ${err}`
        })
    }

});

module.exports = router;