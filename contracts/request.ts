import { AuthUser } from "./Auth"

declare module '@ioc:Adonis/Core/Request' {
  interface RequestContract {
    authUser?: AuthUser
  }
}
