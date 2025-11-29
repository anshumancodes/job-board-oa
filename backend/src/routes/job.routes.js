import {Router} from "express";
const router=Router();
import {createJob,fetchAllJobs,updateJob,deleteJob} from "../controllers/job.controller.js"

router.route("/fetch").get(fetchAllJobs);
router.route("/update/:id").put(updateJob);
router.route("/delete/:id").delete(deleteJob);
router.route("/create").post(createJob)

export default router;



