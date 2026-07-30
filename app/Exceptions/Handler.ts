import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor() {
    super(Logger)
  }

  public async handle(error: any, ctx: HttpContextContract) {
  if (error.code === 'E_VALIDATION_FAILURE') {
    return ctx.response.status(422).send({
      success: false,
      message: 'Validation failed',
      errors: error.messages,
    })
  }
  switch (error.code) {
    case '23502':
      return ctx.response.status(400).send({
        success: false,
        message: 'Required field cannot be null',
      })

    case '23503':
      return ctx.response.status(400).send({
        success: false,
        message: 'Foreign key constraint violation',
      })

    case '23505':
      return ctx.response.status(409).send({
        success: false,
        message: 'Duplicate record already exists',
      })

    case '22P02':
      return ctx.response.status(400).send({
        success: false,
        message: 'Invalid input syntax',
      })
  }

  switch (error.status) {

    case 400:
      return ctx.response.status(400).send({
        success: false,
        message: error.message || 'Bad Request',
      })

    case 401:
      return ctx.response.status(401).send({
        success: false,
        message: error.message || 'Unauthorized',
      })

    case 403:
      return ctx.response.status(403).send({
        success: false,
        message: error.message || 'Forbidden',
      })

    case 404:
      return ctx.response.status(404).send({
        success: false,
        message: error.message || 'Not Found',
      })

    case 406:
      return ctx.response.status(406).send({
        success: false,
        message: error.message || 'Not Acceptable',
      })

    case 409:
      return ctx.response.status(409).send({
        success: false,
        message: error.message || 'Conflict',
      })

    case 422:
      return ctx.response.status(422).send({
        success: false,
        message: error.message || 'Unprocessable Entity',
      })

    case 500:
      return ctx.response.status(500).send({
        success: false,
        message: error.message || 'Internal Server Error',
      })
  }

  return ctx.response.status(500).send({
    success: false,
    message: 'Internal Server Error',
  })
}
}
