import Logger from '@ioc:Adonis/Core/Logger'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor() {
    super(Logger)
  }

  public async handle(error: any, ctx: HttpContextContract) {
    if (error.code === 'E_VALIDATION_FAILURE') {
      return ctx.response.status(422).send({ // ( unprocessable Entity ) 422--standard code for validation error
        success: false,
        message: 'Validation failed',
        errors: error.messages,
      })
    }

    if (error.status) {
      return ctx.response.status(error.status).send({
        success: false,
        message: error.message,
        code: error.code,
      })
    }

    Logger.error(error)

    return ctx.response.status(500).send({
      success: false,
      message: 'Internal Server Error',
    })
  }

  public async report(error: any, ctx: HttpContextContract) {
    return super.report(error, ctx)
  }
}
