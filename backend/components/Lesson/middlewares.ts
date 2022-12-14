import { body } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export function checkCreateLesson(req: Request, res: Response, next: NextFunction) {
  body('title')
    .exists({
      checkNull: true,
      checkFalsy: true,
    })
    .bail()
    .trim()
    .isLength({ min: 2 })
    .run(req);

  body('teacher')
    .exists({
      checkNull: true,
      checkFalsy: true,
    })
    .bail()
    .trim()
    .isLength({ min: 2 })
    .run(req);

  body('location')
    .exists({
      checkNull: true,
      checkFalsy: true,
    })
    .bail()
    .trim()
    .isLength({ min: 2 })
    .run(req);

  body('day')
    .exists({
      checkNull: true,
    })
    .run(req);

  body('timeStart')
    .exists({
      checkNull: true,
    })
    .run(req);

  body('timeEnd')
    .exists({
      checkNull: true,
    })
    .run(req);

  body('dateFrom')
    .exists({
      checkNull: true,
    })
    .run(req);

  body('dateTo')
    .exists({
      checkNull: true,
    })
    .run(req);

  next();
}
