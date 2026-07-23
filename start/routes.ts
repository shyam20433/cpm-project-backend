import Route from '@ioc:Adonis/Core/Route'
import jwt from 'jsonwebtoken'
import Env from '@ioc:Adonis/Core/Env'
//endpoints
Route.get('/endpoints', 'EndpointsController.getEndpoints')
Route.get('/endpoints/access-details', 'EndpointsController.getAccessDetails')
Route.get('/endpoints/:id', 'EndpointsController.getEndpoint')
Route.post('/endpoints', 'EndpointsController.postEndpoint')
Route.put('/endpoints/:id', 'EndpointsController.updateEndpoint')
Route.delete('/endpoints/:id', 'EndpointsController.deleteEndpoint')

//roles
Route.get('/roles', 'RolesController.getRoles')
Route.get('/roles/:key', 'RolesController.getRole')
Route.post('/roles', 'RolesController.postRole')
Route.put('/roles/:key', 'RolesController.updateRole')
Route.delete('/roles/:key', 'RolesController.deleteRole')

//permissions
Route.group(()=>{
Route.get('/permissions', 'PermissionsController.getPermissions')
Route.get('/permissions/:key', 'PermissionsController.getPermission')
Route.post('/permissions', 'PermissionsController.postPermission')
Route.put('/permissions/:key', 'PermissionsController.updatePermission')
Route.delete('/permissions/:key', 'PermissionsController.deletePermission')
}).middleware('jwtAuth')
//assigned roles
Route.get('/assigned-roles', 'AssignedRolesController.getAssignedRoles')
Route.get('/assigned-roles/:id', 'AssignedRolesController.getAssignedRole')
Route.post('/assigned-roles', 'AssignedRolesController.postAssignedRole')
Route.put('/assigned-roles/:id', 'AssignedRolesController.updateAssignedRole')
Route.delete('/assigned-roles/:id', 'AssignedRolesController.deleteAssignedRole')

//asigned permissions
Route.get('/assigned-permissions', 'AssignedPermissionsController.getAssignedPermissions')
Route.get(
  '/assigned-permissions/:roleKey/:permissionKey',
  'AssignedPermissionsController.getAssignedPermission'
)
Route.post('/assigned-permissions', 'AssignedPermissionsController.postAssignedPermission')
Route.put(
  '/assigned-permissions/:roleKey/:permissionKey',
  'AssignedPermissionsController.updateAssignedPermission'
)
Route.delete(
  '/assigned-permissions/:roleKey/:permissionKey',
  'AssignedPermissionsController.deleteAssignedPermission'
)

//assigned endpoints
Route.get('/assigned-endpoints', 'AssignedEndpointsController.getAssignedEndpoints')
Route.get(
  '/assigned-endpoints/:endpointId/:permissionKey',
  'AssignedEndpointsController.getAssignedEndpoint'
)
Route.post('/assigned-endpoints', 'AssignedEndpointsController.postAssignedEndpoint')
Route.put(
  '/assigned-endpoints/:endpointId/:permissionKey',
  'AssignedEndpointsController.updateAssignedEndpoint'
)
Route.delete(
  '/assigned-endpoints/:endpointId/:permissionKey',
  'AssignedEndpointsController.deleteAssignedEndpoint'
)


Route.get('/generate-token', async () => {
  const token = jwt.sign(
    {
      id: 1,
      role: 'ADMIN',
    },
    Env.get('APP_KEY'),
    {
      expiresIn: '1d',
    }
  )
  return {
    success: true,
    token,
  }
})
