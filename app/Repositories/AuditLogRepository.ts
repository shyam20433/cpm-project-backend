
import AuditLog from 'App/Models/AuditLog'
import { TransactionClientContract } from '@ioc:Adonis/Lucid/Database'

interface AuditLogPayload {
  tableName: string
  recordId: string
  action: 'CREATE' | 'UPDATE' | 'DELETE' |'DISABLE'|'ENABLE'|'SETUP'
  oldData?: object | null
  newData?: object | null
  changedBy: string
}

export default class AuditLogRepository {
public async create(
  data: AuditLogPayload,
  trx: TransactionClientContract
) {
  try {
    console.log(data)

    return await AuditLog.create(
      {
        tableName: data.tableName,
        recordId: data.recordId,
        action: data.action,
        oldData: data.oldData ?? null,
        newData: data.newData ?? null,
        changedBy: data.changedBy,
      },
      {
        client: trx,
      }
    )
  } catch (error:any) {
  console.log(error.message)
  console.log(error.stack)
  throw error
}
}
}
