import { Router } from 'express';
import { getShortUrl } from '../controllers/urlsController.js';
import { getShortUrlId } from '../controllers/urlsController.js';
import { openShortUrl } from '../controllers/urlsController.js';
import { deleteShortUrl } from '../controllers/urlsController.js';

import { validateUrl } from '../middlewares/urlValidation.js';

const urlRouter = Router();

urlRouter.post("/urls/shorten", validateUrl, getShortUrl);
urlRouter.get("/urls/:id", getShortUrlId);
urlRouter.get("/urls/open/:shortUrl", openShortUrl);
urlRouter.delete("/urls/:id", deleteShortUrl);


export default urlRouter;