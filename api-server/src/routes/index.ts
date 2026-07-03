import { Router, type IRouter } from "express";
import healthRouter from "./health";
import playersRouter from "./players";
import opportunitiesRouter from "./opportunities";
import adminRouter from "./admin";
import authRouter from "./auth";
import contactRouter from "./contact";
import statsRouter from "./stats";
import translateRouter from "./translate";

const router: IRouter = Router();

router.use(healthRouter);
router.use(authRouter);
router.use(playersRouter);
router.use(opportunitiesRouter);
router.use(adminRouter);
router.use(contactRouter);
router.use(statsRouter);
router.use(translateRouter);

export default router;
