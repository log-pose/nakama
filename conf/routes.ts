import { Router } from "express";
import authRoutesV1 from "src/v1/auth/routes";

const router = Router();

router.use("/v1", authRoutesV1);

export default router;
